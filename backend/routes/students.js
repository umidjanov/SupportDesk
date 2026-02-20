import express from 'express';
import { searchStudentAutofill, getAllStudents, addStudent, updateStudent, deleteStudent } from '../utils/autofill.js';
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
    return res.status(403).json({ error: 'Only curator can perform this action' });
  }
  
  req.userId = userId;
  next();
};

/**
 * GET /api/students/autofill?name=...
 * Search for student autofill data
 * Returns: { group, mentor, status } if found
 */
router.get('/autofill', (req, res) => {
  try {
    const { name } = req.query;
    
    if (!name || name.trim().length < 2) {
      return res.json(null);
    }
    
    const autofill = searchStudentAutofill(name);
    res.json(autofill);
  } catch (error) {
    console.error('Autofill search error:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

/**
 * GET /api/students
 * Get all students (curator only)
 */
router.get('/', requireCurator, (req, res) => {
  try {
    const students = getAllStudents();
    res.json(students);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

/**
 * POST /api/students
 * Add a new student (curator only)
 */
router.post('/', requireCurator, (req, res) => {
  try {
    const { name, group, mentor, status } = req.body;
    
    if (!name || !group || !mentor || !status) {
      return res.status(400).json({ 
        error: 'Barcha maydonlar to\'ldirilishi shart!' 
      });
    }
    
    const student = addStudent({ name, group, mentor, status });
    res.status(201).json(student);
  } catch (error) {
    console.error('Add student error:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

/**
 * PUT /api/students/:id
 * Update a student (curator only)
 */
router.put('/:id', requireCurator, (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const student = updateStudent(id, updates);
    res.json(student);
  } catch (error) {
    if (error.message === 'Student not found') {
      return res.status(404).json({ error: error.message });
    }
    console.error('Update student error:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

/**
 * DELETE /api/students/:id
 * Delete a student (curator only)
 */
router.delete('/:id', requireCurator, (req, res) => {
  try {
    const { id } = req.params;
    deleteStudent(id);
    res.json({ success: true });
  } catch (error) {
    if (error.message === 'Student not found') {
      return res.status(404).json({ error: error.message });
    }
    console.error('Delete student error:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

export default router;
