import { db } from '../utils/database.js';
import { v4 as uuidv4 } from 'uuid';
import { searchStudentAutofill } from '../utils/autofill.js';
import { withLock } from '../utils/concurrency.js';

// Store connected users by socket ID
const connectedUsers = new Map();

// Error handler wrapper for socket events
function handleSocketError(socket, callback, fn) {
  try {
    return fn();
  } catch (error) {
    console.error('Socket error:', error);
    const errorMessage = error.message || 'Server xatosi';
    
    if (callback && typeof callback === 'function') {
      callback({ success: false, error: errorMessage });
    } else {
      socket.emit('error', { message: errorMessage });
    }
  }
}

/**
 * Setup Socket.io event handlers
 */
export function setupSocketHandlers(socket, io) {
  // Handle user authentication
  socket.on('authenticate', (data) => {
    const { userId, role } = data;
    if (userId) {
      connectedUsers.set(socket.id, { userId, role, socketId: socket.id });
      socket.join(role === 'curator' ? 'curators' : `support:${userId}`);
      console.log(`User authenticated: ${userId} (${role})`);
    }
  });

  // Handle student autofill search with error handling
  socket.on('student:autofill', (data, callback) => {
    handleSocketError(socket, callback, () => {
      // Validate input
      if (!data || typeof data !== 'object') {
        return callback({ success: false, error: 'Invalid request data' });
      }
      
      const { name } = data;
      
      if (!name || typeof name !== 'string' || name.trim().length < 2) {
        return callback({ success: true, data: null });
      }
      
      const autofill = searchStudentAutofill(name);
      callback({ success: true, data: autofill });
    });
  });

  // Handle new record submission with concurrency protection
  socket.on('record:submit', async (data, callback) => {
    handleSocketError(socket, callback, async () => {
      const userInfo = connectedUsers.get(socket.id);
      if (!userInfo) {
        return callback({ success: false, error: 'Authentication required' });
      }

      const { date, time, group, mentor, student, theme, status } = data;
      
      // Validation
      if (!date || !time || !group || !mentor || !student || !theme || !status) {
        return callback({ 
          success: false, 
          error: 'Barcha maydonlar to\'ldirilishi shart!' 
        });
      }

      // Use lock to prevent race conditions
      const lockId = `record:submit:${userInfo.userId}`;
      
      await withLock(lockId, async () => {
        // Get user info
        const users = db.getUsers();
        const user = users.find(u => u.id === userInfo.userId);
        
        if (!user) {
          return callback({ success: false, error: 'Foydalanuvchi topilmadi' });
        }

        // Create record
        const record = {
          id: uuidv4(),
          supportId: user.id,
          supportName: user.name,
          date,
          time,
          group,
          mentor,
          student: student.trim(),
          theme,
          status,
          createdAt: Date.now(),
        };

        // Save to database
        const records = db.getRecords();
        records.push(record);
        db.saveRecords(records);

        // Create notification for curator
        const notifications = db.getNotifications();
        const notification = {
          id: uuidv4(),
          type: 'new_record',
          supportId: user.id,
          supportName: user.name,
          student: record.student,
          group: record.group,
          theme: record.theme,
          recordId: record.id,
          createdAt: Date.now(),
          seen: false,
        };
        notifications.push(notification);
        db.saveNotifications(notifications);

        // Emit to curator in real-time (with error handling)
        try {
          io.to('curators').emit('record:new', {
            record,
            notification,
          });
        } catch (emitError) {
          console.error('Error emitting to curators:', emitError);
          // Don't fail the request if emit fails
        }

        // Emit confirmation to sender
        callback({ success: true, data: record });
      });
    });
  });

  // Handle record update with concurrency protection
  socket.on('record:update', async (data, callback) => {
    handleSocketError(socket, callback, async () => {
      const userInfo = connectedUsers.get(socket.id);
      if (!userInfo) {
        return callback({ success: false, error: 'Authentication required' });
      }

      // Validate input
      if (!data || !data.id) {
        return callback({ success: false, error: 'Record ID required' });
      }

      const { id, ...updates } = data;
      const lockId = `record:update:${id}`;
      
      await withLock(lockId, async () => {
        const records = db.getRecords();
        const index = records.findIndex(r => r.id === id);

        if (index === -1) {
          return callback({ success: false, error: 'Yozuv topilmadi!' });
        }

        if (records[index].supportId !== userInfo.userId) {
          return callback({ success: false, error: "Ruxsat yo'q!" });
        }

        records[index] = { ...records[index], ...updates };
        db.saveRecords(records);

        // Emit update to curator with error handling
        try {
          io.to('curators').emit('record:updated', {
            record: records[index],
          });
        } catch (emitError) {
          console.error('Error emitting update to curators:', emitError);
        }

        callback({ success: true, data: records[index] });
      });
    });
  });

  // Handle record delete with concurrency protection
  socket.on('record:delete', async (data, callback) => {
    handleSocketError(socket, callback, async () => {
      const userInfo = connectedUsers.get(socket.id);
      if (!userInfo) {
        return callback({ success: false, error: 'Authentication required' });
      }

      // Validate input
      if (!data || !data.id) {
        return callback({ success: false, error: 'Record ID required' });
      }

      const { id } = data;
      const lockId = `record:delete:${id}`;
      
      await withLock(lockId, async () => {
        const records = db.getRecords();
        const record = records.find(r => r.id === id);

        if (!record) {
          return callback({ success: false, error: 'Yozuv topilmadi!' });
        }

        if (record.supportId !== userInfo.userId) {
          return callback({ success: false, error: "Ruxsat yo'q!" });
        }

        const filtered = records.filter(r => r.id !== id);
        db.saveRecords(filtered);

        // Emit delete to curator with error handling
        try {
          io.to('curators').emit('record:deleted', { id });
        } catch (emitError) {
          console.error('Error emitting delete to curators:', emitError);
        }

        callback({ success: true });
      });
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    connectedUsers.delete(socket.id);
  });

  // Error handling middleware
  socket.on('error', (error) => {
    console.error('Socket error:', error);
    try {
      socket.emit('error', { message: 'Connection error occurred' });
    } catch (emitError) {
      console.error('Failed to emit error to client:', emitError);
    }
  });

  // Handle malformed packets gracefully
  socket.onAny((eventName, ...args) => {
    // Log unknown events for debugging
    if (!['authenticate', 'student:autofill', 'record:submit', 'record:update', 'record:delete', 'error', 'disconnect'].includes(eventName)) {
      console.warn(`Unknown socket event received: ${eventName}`);
    }
  });
}
