import express from 'express';
import { storeStudentCredentials } from '../storage/studentCredentials.js';

const router = express.Router();

// POST /api/public/create-student-email (public endpoint for email creation during evaluation)
router.post('/create-student-email', async (req, res) => {
  try {
    const { studentId, name, rollNumber, primaryEmail, emailOptions, domain = 'stu.com' } = req.body;
    
    // Generate a password for student
    const generatePassword = (name, rollNo) => {
      const cleanName = (name || 'Student').charAt(0).toUpperCase() + (name || 'Student').slice(1).toLowerCase().replace(/\s+/g, '');
      const cleanRoll = (rollNo || '001').replace(/[^0-9]/g, ''); // Extract just numbers
      return `${cleanName}@${cleanRoll}`;
    };
    
    const password = generatePassword(name, rollNumber);
    
    // Store credentials for authentication
    storeStudentCredentials(studentId, primaryEmail, password, name);
    
    console.log(`✅ Created student credentials via public endpoint:`, {
      studentId,
      email: primaryEmail,
      name,
      password: password.replace(/./g, '*') // Hide password in logs
    });
    
    return res.json({
      success: true,
      data: {
        email: primaryEmail,
        password: password, // Return password for display to teacher
        studentId,
        domain,
        createdAt: new Date(),
        isTemporary: true
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      code: 'INTERNAL_ERROR',
    });
  }
});

export default router;
