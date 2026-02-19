import bcrypt from 'bcrypt';
import { db } from './database.js';

/**
 * Verify user credentials
 */
export async function verifyCredentials(phone, password) {
  const users = db.getUsers();
  const user = users.find(u => u.phone === phone);
  
  if (!user) {
    return null;
  }
  
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return null;
  }
  
  // Return user without password
  const { password: _, ...safeUser } = user;
  return safeUser;
}

/**
 * Hash a password
 */
export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

/**
 * Check if user exists by phone
 */
export function userExists(phone) {
  const users = db.getUsers();
  return users.some(u => u.phone === phone);
}

/**
 * Create a new user
 */
export async function createUser(userData) {
  const users = db.getUsers();
  const hashedPassword = await hashPassword(userData.password);
  
  const newUser = {
    ...userData,
    password: hashedPassword,
  };
  
  users.push(newUser);
  db.saveUsers(users);
  
  const { password: _, ...safeUser } = newUser;
  return safeUser;
}
