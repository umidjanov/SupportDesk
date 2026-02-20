import { db } from './database.js';

/**
 * Search for a student by name and return autofill data
 * Returns: { group, mentor, status } if found
 */
export function searchStudentAutofill(studentName) {
  if (!studentName || studentName.trim().length < 2) {
    return null;
  }
  
  const students = db.getStudents();
  const searchTerm = studentName.trim().toLowerCase();
  
  // Find exact match first
  let student = students.find(
    s => s.name.toLowerCase() === searchTerm
  );
  
  // If no exact match, find partial match
  if (!student) {
    student = students.find(
      s => s.name.toLowerCase().includes(searchTerm) ||
           searchTerm.includes(s.name.toLowerCase())
    );
  }
  
  if (!student) {
    return null;
  }
  
  return {
    group: student.group,
    mentor: student.mentor,
    status: student.status,
  };
}

/**
 * Get all students (for curator to manage)
 */
export function getAllStudents() {
  return db.getStudents();
}

/**
 * Add a new student (curator only)
 */
export function addStudent(studentData) {
  const students = db.getStudents();
  const newStudent = {
    id: `s${Date.now()}`,
    ...studentData,
  };
  students.push(newStudent);
  db.saveStudents(students);
  return newStudent;
}

/**
 * Update a student (curator only)
 */
export function updateStudent(studentId, updates) {
  const students = db.getStudents();
  const index = students.findIndex(s => s.id === studentId);
  
  if (index === -1) {
    throw new Error('Student not found');
  }
  
  students[index] = { ...students[index], ...updates };
  db.saveStudents(students);
  return students[index];
}

/**
 * Delete a student (curator only)
 */
export function deleteStudent(studentId) {
  const students = db.getStudents();
  const filtered = students.filter(s => s.id !== studentId);
  
  if (filtered.length === students.length) {
    throw new Error('Student not found');
  }
  
  db.saveStudents(filtered);
  return true;
}
