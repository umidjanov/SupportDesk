import express from 'express';
import { verifyCredentials, createUser, userExists } from '../utils/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

/**
 * POST /api/auth/login
 * Login with phone and password
 */
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    
    if (!phone || !password) {
      return res.status(400).json({ 
        error: 'Telefon va parol kiritilishi shart!' 
      });
    }
    
    const user = await verifyCredentials(phone, password);
    
    if (!user) {
      return res.status(401).json({ 
        error: "Telefon yoki parol noto'g'ri!" 
      });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

/**
 * POST /api/auth/register
 * Register a new support teacher
 */
router.post('/register', async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    
    if (!name || !phone || !password) {
      return res.status(400).json({ 
        error: 'Barcha maydonlar to\'ldirilishi shart!' 
      });
    }
    
    if (userExists(phone)) {
      return res.status(400).json({ 
        error: "Bu telefon raqam allaqachon ro'yxatdan o'tgan!" 
      });
    }
    
    const avatar = name
      .split(' ')
      .map(w => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
    
    const colors = ["#3d5eff", "#059669", "#d97706", "#7c3aed", "#db2777"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    const joinDate = new Date()
      .toLocaleDateString('ru-RU')
      .split('.')
      .join('.');
    
    const newUser = await createUser({
      id: uuidv4(),
      name,
      phone,
      password,
      role: 'support',
      avatar,
      color,
      joinDate,
    });
    
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

export default router;
