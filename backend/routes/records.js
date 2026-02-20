import express from 'express';
import { db } from '../utils/database.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Middleware to extract user from request (simplified - in production use JWT)
// For now, we'll pass userId in body/query
const requireAuth = (req, res, next) => {
  const userId = req.headers['x-user-id'] || req.body.userId || req.query.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  req.userId = userId;
  next();
};

/**
 * GET /api/records
 * Get all records with optional filters
 */
router.get('/', requireAuth, (req, res) => {
  try {
    let records = db.getRecords();
    
    // Apply filters
    if (req.query.supportId) {
      records = records.filter(r => r.supportId === req.query.supportId);
    }
    if (req.query.date) {
      records = records.filter(r => r.date === req.query.date);
    }
    if (req.query.group) {
      records = records.filter(r => r.group === req.query.group);
    }
    if (req.query.search) {
      const q = req.query.search.toLowerCase();
      records = records.filter(r => 
        `${r.student}${r.mentor}${r.theme}${r.group}`.toLowerCase().includes(q)
      );
    }
    
    // Sort by createdAt descending
    records.sort((a, b) => b.createdAt - a.createdAt);
    
    res.json(records);
  } catch (error) {
    console.error('Get records error:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

/**
 * POST /api/records
 * Create a new record
 */
router.post('/', requireAuth, (req, res) => {
  try {
    const { date, time, group, mentor, student, theme, status } = req.body;
    
    // Validation
    if (!date || !time || !group || !mentor || !student || !theme || !status) {
      return res.status(400).json({ 
        error: 'Barcha maydonlar to\'ldirilishi shart!' 
      });
    }
    
    // Get user info
    const users = db.getUsers();
    const user = users.find(u => u.id === req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'Foydalanuvchi topilmadi' });
    }
    
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
    
    res.status(201).json(record);
  } catch (error) {
    console.error('Create record error:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

/**
 * PUT /api/records/:id
 * Update a record
 */
router.put('/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const records = db.getRecords();
    const index = records.findIndex(r => r.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Yozuv topilmadi!' });
    }
    
    if (records[index].supportId !== req.userId) {
      return res.status(403).json({ error: "Ruxsat yo'q!" });
    }
    
    records[index] = { ...records[index], ...req.body };
    db.saveRecords(records);
    
    res.json(records[index]);
  } catch (error) {
    console.error('Update record error:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

/**
 * DELETE /api/records/:id
 * Delete a record
 */
router.delete('/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const records = db.getRecords();
    const record = records.find(r => r.id === id);
    
    if (!record) {
      return res.status(404).json({ error: 'Yozuv topilmadi!' });
    }
    
    if (record.supportId !== req.userId) {
      return res.status(403).json({ error: "Ruxsat yo'q!" });
    }
    
    const filtered = records.filter(r => r.id !== id);
    db.saveRecords(filtered);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Delete record error:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

export default router;
