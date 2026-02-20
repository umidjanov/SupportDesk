import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const STUDENTS_FILE = path.join(DATA_DIR, 'students.json');
const RECORDS_FILE = path.join(DATA_DIR, 'records.json');
const NOTIFICATIONS_FILE = path.join(DATA_DIR, 'notifications.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Seed data
const SEED_USERS = [
  {
    id: "u1",
    name: "Aziza Karimova",
    phone: "93-111-11-11",
    password: "Aziza", // Will be hashed
    role: "support",
    avatar: "AK",
    color: "#3d5eff",
    joinDate: "01.01.2026",
  },
  {
    id: "u2",
    name: "Bobur Toshmatov",
    phone: "93-222-22-22",
    password: "Bobur",
    role: "support",
    avatar: "BT",
    color: "#059669",
    joinDate: "01.01.2026",
  },
  {
    id: "u3",
    name: "Charos Umarova",
    phone: "93-333-33-33",
    password: "Charos",
    role: "support",
    avatar: "CU",
    color: "#d97706",
    joinDate: "01.01.2026",
  },
  {
    id: "u4",
    name: "Davron Yusupov",
    phone: "93-444-44-44",
    password: "Davron",
    role: "support",
    avatar: "DY",
    color: "#7c3aed",
    joinDate: "01.01.2026",
  },
  {
    id: "u5",
    name: "Ezgulik Nazarova",
    phone: "93-555-55-55",
    password: "Ezgulik",
    role: "support",
    avatar: "EN",
    color: "#db2777",
    joinDate: "01.01.2026",
  },
  {
    id: "curator",
    name: "Kurator Admin",
    phone: "90-000-00-00",
    password: "Kurator123",
    role: "curator",
    avatar: "KA",
    color: "#0891b2",
    joinDate: "01.01.2026",
  },
];

const SEED_STUDENTS = [
  { id: "s1", name: "Mahliyo Xudoyberdiyeva", group: "GW112", mentor: "Nozila Yusupova", status: "coworking" },
  { id: "s2", name: "Sardor Alijonov", group: "GW113", mentor: "Jasur Rahimov", status: "group" },
  { id: "s3", name: "Nilufar Rahimova", group: "GW114", mentor: "Kamola Mirzayeva", status: "coworking" },
  { id: "s4", name: "Bekzod Tursunov", group: "GW112", mentor: "Nozila Yusupova", status: "coworking" },
  { id: "s5", name: "Zulfiya Qodirov", group: "GW115", mentor: "Sherzod Tursunov", status: "group" },
  { id: "s6", name: "Humoyun Baxtiyorov", group: "GW116", mentor: "Malika Hasanova", status: "coworking" },
  { id: "s7", name: "Kamola Umarova", group: "GW113", mentor: "Jasur Rahimov", status: "coworking" },
];

const SEED_RECORDS = [
  {
    id: "r1",
    supportId: "u1",
    supportName: "Aziza Karimova",
    date: "17.02.2026",
    time: "10:00",
    group: "GW112",
    mentor: "Nozila Yusupova",
    student: "Mahliyo Xudoyberdiyeva",
    theme: "JS homework",
    status: "coworking",
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: "r2",
    supportId: "u2",
    supportName: "Bobur Toshmatov",
    date: "17.02.2026",
    time: "11:30",
    group: "GW113",
    mentor: "Jasur Rahimov",
    student: "Sardor Alijonov",
    theme: "React basics",
    status: "group",
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: "r3",
    supportId: "u3",
    supportName: "Charos Umarova",
    date: "18.02.2026",
    time: "14:00",
    group: "GW114",
    mentor: "Kamola Mirzayeva",
    student: "Nilufar Rahimova",
    theme: "CSS Grid",
    status: "coworking",
    createdAt: Date.now() - 86400000,
  },
];

// Helper functions
function readFile(filePath, defaultValue = []) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
  }
  return defaultValue;
}

function writeFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
}

// Hash passwords for seed users
async function hashPasswords(users) {
  const hashedUsers = await Promise.all(
    users.map(async (user) => {
      if (user.password && !user.password.startsWith('$2')) {
        // Only hash if not already hashed
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { ...user, password: hashedPassword };
      }
      return user;
    })
  );
  return hashedUsers;
}

// Initialize database
export async function initDatabase() {
  // Initialize users
  if (!fs.existsSync(USERS_FILE)) {
    const hashedUsers = await hashPasswords(SEED_USERS);
    writeFile(USERS_FILE, hashedUsers);
    console.log('✅ Initialized users database');
  }

  // Initialize students
  if (!fs.existsSync(STUDENTS_FILE)) {
    writeFile(STUDENTS_FILE, SEED_STUDENTS);
    console.log('✅ Initialized students database');
  }

  // Initialize records
  if (!fs.existsSync(RECORDS_FILE)) {
    writeFile(RECORDS_FILE, SEED_RECORDS);
    console.log('✅ Initialized records database');
  }

  // Initialize notifications
  if (!fs.existsSync(NOTIFICATIONS_FILE)) {
    writeFile(NOTIFICATIONS_FILE, []);
    console.log('✅ Initialized notifications database');
  }
}

// Database operations
export const db = {
  // Users
  getUsers: () => readFile(USERS_FILE, []),
  saveUsers: (users) => writeFile(USERS_FILE, users),
  
  // Students
  getStudents: () => readFile(STUDENTS_FILE, []),
  saveStudents: (students) => writeFile(STUDENTS_FILE, students),
  
  // Records
  getRecords: () => readFile(RECORDS_FILE, []),
  saveRecords: (records) => writeFile(RECORDS_FILE, records),
  
  // Notifications
  getNotifications: () => readFile(NOTIFICATIONS_FILE, []),
  saveNotifications: (notifications) => writeFile(NOTIFICATIONS_FILE, notifications),
};
