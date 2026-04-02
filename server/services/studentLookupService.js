// Student Lookup Service - Find or create student records

import User from '../models/User.js';

export const findOrCreateStudent = async (studentName, studentRollNo) => {
  try {
    // First try to find by roll number (most reliable)
    if (studentRollNo && studentRollNo.trim()) {
      let student = await User.findOne({ 
        rollNumber: studentRollNo.trim(), 
        role: 'student' 
      });
      
      if (student) {
        // Update name if provided and different
        if (studentName && studentName.trim() && student.name !== studentName.trim()) {
          student.name = studentName.trim();
          await student.save();
          console.log(`Updated student name: ${student.name} (${student.rollNumber})`);
        }
        return student;
      }
    }
    
    // Try to find by name if roll number not found
    if (studentName && studentName.trim()) {
      let student = await User.findOne({ 
        name: studentName.trim(), 
        role: 'student' 
      });
      
      if (student) {
        // Update roll number if provided and different
        if (studentRollNo && studentRollNo.trim() && student.rollNumber !== studentRollNo.trim()) {
          student.rollNumber = studentRollNo.trim();
          await student.save();
          console.log(`Updated student roll number: ${student.name} (${student.rollNumber})`);
        }
        return student;
      }
    }
    
    // Create new student if not found
    if (studentName && studentName.trim()) {
      const newStudent = new User({
        name: studentName.trim(),
        rollNumber: studentRollNo ? studentRollNo.trim() : '',
        role: 'student',
        email: generateStudentEmail(studentName, studentRollNo),
        password: 'temp123', // Default password, should be changed
      });
      
      await newStudent.save();
      console.log(`Created new student: ${newStudent.name} (${newStudent.rollNumber}) - ${newStudent.email}`);
      return newStudent;
    }
    
    return null;
  } catch (error) {
    console.error('Student lookup error:', error);
    throw error;
  }
};

// Generate email for new students
const generateStudentEmail = (name, rollNo) => {
  const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${cleanName}@example.com`;
};

// Find student by name or roll number
export const findStudent = async (identifier) => {
  try {
    const student = await User.findOne({
      $or: [
        { name: identifier, role: 'student' },
        { rollNumber: identifier, role: 'student' },
        { email: identifier, role: 'student' }
      ]
    });
    
    return student;
  } catch (error) {
    console.error('Find student error:', error);
    throw error;
  }
};

export default {
  findOrCreateStudent,
  findStudent,
};
