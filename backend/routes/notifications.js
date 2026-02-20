import express from 'express';
import { db } from '../utils/database.js';

const router = express.Router();

// Middleware to check if user is curator
const requireCurator = (req, res, next) => {
  const userId = req.headers['x-user-id'] || req.body.userId || req.query.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  const users = db.getUsers();
  const user = users.find(u => u.id === userId);
  
  if (!user || user.role !== 'curator') {
    return res.status(403).json({ error: 'Only curator can access notifications' });
  }
  
  req.userId = userId;
  next();
};

/**
 * GET /api/notifications
 * Get all notifications (curator only)
 */
router.get('/', requireCurator, (req, res) => {
  try {
    const notifications = db.getNotifications();
    notifications.sort((a, b) => b.createdAt - a.createdAt);
    res.json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

/**
 * PUT /api/notifications/seen
 * Mark all notifications as seen (curator only)
 */
router.put('/seen', requireCurator, (req, res) => {
  try {
    const notifications = db.getNotifications();
    const updated = notifications.map(n => ({ ...n, seen: true }));
    db.saveNotifications(updated);
    res.json(updated);
  } catch (error) {
    console.error('Mark notifications seen error:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

export default router;
