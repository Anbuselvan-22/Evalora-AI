import express from 'express';
import requireRole from '../middleware/roleMiddleware.js';
import Result from '../models/Result.js';
import Evaluation from '../models/Evaluation.js';
import { storeStudentCredentials } from '../storage/studentCredentials.js';

const router = express.Router();

// Mock data for testing without MongoDB
const MOCK_RESULTS = [
  {
    _id: '507f1f77bcf86cd799439013',
    evaluationId: '507f1f77bcf86cd799439001',
    studentId: '507f1f77bcf86cd799439012',
    subject: 'Mathematics',
    totalMarks: 100,
    obtainedMarks: 85,
    percentage: 85,
    createdAt: new Date('2024-01-15'),
    questionWiseData: [
      { questionNumber: 1, marks: 10, totalMarks: 10, correctPoints: 10, missingPoints: 0, mistakes: [], suggestions: [] },
      { questionNumber: 2, marks: 15, totalMarks: 20, correctPoints: 15, missingPoints: 5, mistakes: ['Missing step'], suggestions: ['Show all steps'] },
    ],
  },
  {
    _id: '507f1f77bcf86cd799439014',
    evaluationId: '507f1f77bcf86cd799439002',
    studentId: '507f1f77bcf86cd799439012',
    subject: 'Physics',
    totalMarks: 100,
    obtainedMarks: 72,
    percentage: 72,
    createdAt: new Date('2024-01-10'),
    questionWiseData: [],
  },
];

// Mock student emails storage
const studentEmails = new Map();

// POST /api/student/create-email (public endpoint for email creation during evaluation)
router.post('/create-email', async (req, res) => {
  try {
    const { studentId, name, rollNumber, primaryEmail, emailOptions, domain = 'example.com' } = req.body;
    
    // Generate a password for the student
    const generatePassword = (name, rollNo) => {
      const cleanName = (name || 'Student').charAt(0).toUpperCase() + (name || 'Student').slice(1).toLowerCase().replace(/\s+/g, '');
      const cleanRoll = (rollNo || '001').replace(/[^a-z0-9]/g, '');
      return `${cleanName}@${cleanRoll}`;
    };
    
    const password = generatePassword(name, rollNumber);
    
    // Store the email in our mock storage
    studentEmails.set(studentId, primaryEmail);
    
    // Store credentials for authentication
    storeStudentCredentials(studentId, primaryEmail, password, name);
    
    console.log(`✅ Created student credentials:`, {
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

// Apply authentication middleware to all routes except create-email
router.use(requireRole('student'));

// GET /api/student/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    let results = [];
    try {
      results = await Result.find({ studentId: req.user.id });
    } catch (e) {
      results = MOCK_RESULTS;
    }

    const totalMarks = results.reduce((sum, r) => sum + r.obtainedMarks, 0);
    const averageScore = results.length > 0
      ? Math.round((totalMarks / (results.length * 100)) * 100)
      : 0;

    const scoreProgression = results.map((r) => ({
      date: new Date(r.createdAt).toLocaleDateString(),
      score: r.percentage,
    }));

    const subjectDistribution = results.reduce((acc, r) => {
      const existing = acc.find((s) => s.subject === r.subject);
      if (existing) {
        existing.score = (existing.score + r.percentage) / 2;
      } else {
        acc.push({ subject: r.subject, score: r.percentage });
      }
      return acc;
    }, []);

    return res.json({
      success: true,
      data: {
        totalMarks,
        averageScore,
        scoreProgression,
        subjectDistribution,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      code: 'INTERNAL_ERROR',
    });
  }
});

// GET /api/student/results
router.get('/results', async (req, res) => {
  try {
    let allResults = [];
    
    // Get completed results
    try {
      const completedResults = await Result.find({ studentId: req.user.id }).sort({ createdAt: -1 });
      allResults = completedResults.map(result => ({
        ...result.toObject(),
        status: 'completed',
        type: 'result'
      }));
    } catch (e) {
      // Use mock results if database fails
      allResults = MOCK_RESULTS.map(result => ({
        ...result,
        status: 'completed',
        type: 'result'
      }));
    }
    
    // Get processing evaluations
    try {
      const processingEvaluations = await Evaluation.find({ 
        studentId: req.user.id, 
        status: { $in: ['pending', 'processing'] } 
      }).sort({ createdAt: -1 });
      
      const formattedEvaluations = processingEvaluations.map(evaluation => ({
        _id: evaluation._id,
        evaluationId: evaluation._id,
        studentId: evaluation.studentId,
        subject: evaluation.subject,
        totalMarks: evaluation.totalMarks,
        obtainedMarks: 0,
        percentage: 0,
        status: evaluation.status,
        createdAt: evaluation.createdAt,
        type: 'evaluation',
        metadata: evaluation.metadata
      }));
      
      allResults = [...formattedEvaluations, ...allResults];
    } catch (e) {
      console.warn('Could not fetch processing evaluations:', e.message);
    }
    
    // Sort by date (newest first)
    allResults.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return res.json({
      success: true,
      data: allResults,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      code: 'INTERNAL_ERROR',
    });
  }
});

// GET /api/student/results/:id
router.get('/results/:id', async (req, res) => {
  try {
    let result = null;
    try {
      result = await Result.findById(req.params.id);
    } catch (e) {
      result = MOCK_RESULTS.find((r) => r._id === req.params.id);
    }

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found',
        code: 'NOT_FOUND',
      });
    }
    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      code: 'INTERNAL_ERROR',
    });
  }
});

// GET /api/student/analytics
router.get('/analytics', async (req, res) => {
  try {
    let results = [];
    try {
      results = await Result.find({ studentId: req.user.id });
    } catch (e) {
      results = MOCK_RESULTS;
    }

    const subjectStats = {};
    results.forEach((r) => {
      if (!subjectStats[r.subject]) {
        subjectStats[r.subject] = { total: 0, count: 0 };
      }
      subjectStats[r.subject].total += r.percentage || 0;
      subjectStats[r.subject].count += 1;
    });

    const weakAreas = Object.entries(subjectStats)
      .filter(([, stats]) => (stats.total / stats.count) < 70)
      .map(([subject]) => subject);

    const strongAreas = Object.entries(subjectStats)
      .filter(([, stats]) => (stats.total / stats.count) >= 85)
      .map(([subject]) => subject);

    const performanceHistory = results.map((r) => ({
      date: new Date(r.createdAt).toLocaleDateString(),
      score: r.percentage,
      subject: r.subject,
      marks: r.obtainedMarks,
      totalMarks: r.totalMarks,
    }));

    const comparisonData = Object.entries(subjectStats).map(([subject, stats]) => ({
      name: subject,
      score: Math.round(stats.total / stats.count),
    }));

    return res.json({
      success: true,
      data: {
        weakAreas,
        strongAreas,
        performanceHistory,
        comparisonData,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      code: 'INTERNAL_ERROR',
    });
  }
});

// POST /api/student/check-email
router.post('/check-email', async (req, res) => {
  try {
    const { name, rollNumber, domain = 'example.com' } = req.body;
    
    // Generate email based on name and roll number
    const normalizeName = (name) => {
      return name.toLowerCase().replace(/\s+/g, '.');
    };
    const normalizeRoll = (roll) => {
      return roll.toLowerCase().replace(/[^a-z0-9]/g, '');
    };
    
    const baseEmail = `${normalizeName(name)}.${normalizeRoll(roll)}@${domain}`;
    
    // Check if email already exists in our mock storage
    const existingEmail = Array.from(studentEmails.values()).find(
      email => email.toLowerCase() === baseEmail.toLowerCase()
    );
    
    return res.json({
      success: true,
      data: {
        exists: !!existingEmail,
        email: existingEmail || baseEmail
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

// GET /api/student/email/:studentId
router.get('/email/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const email = studentEmails.get(studentId);
    
    if (!email) {
      return res.status(404).json({
        success: false,
        message: 'Email not found for this student',
        code: 'NOT_FOUND',
      });
    }
    
    return res.json({
      success: true,
      data: {
        email,
        studentId,
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

// PUT /api/student/email/:studentId
router.put('/email/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { email } = req.body;
    
    // Update the email in our mock storage
    studentEmails.set(studentId, email);
    
    return res.json({
      success: true,
      data: {
        email,
        studentId,
        updatedAt: new Date(),
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

// POST /api/student/send-evaluation-notification
router.post('/send-evaluation-notification', async (req, res) => {
  try {
    const notificationData = req.body;
    
    // In a real implementation, this would send an email
    // For now, we'll just return success
    console.log('Evaluation notification sent:', notificationData);
    
    return res.json({
      success: true,
      data: {
        message: 'Evaluation notification sent successfully',
        notificationId: `notif_${Date.now()}`,
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

// Mock notifications storage
const notifications = new Map();

// GET /api/student/notifications/:studentId
router.get('/notifications/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const studentNotifications = notifications.get(studentId) || [];
    
    return res.json({
      success: true,
      data: studentNotifications
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      code: 'INTERNAL_ERROR',
    });
  }
});

// POST /api/student/notifications/evaluation
router.post('/notifications/evaluation', async (req, res) => {
  try {
    const notificationData = req.body;
    const { studentId } = notificationData;
    
    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID is required',
        code: 'MISSING_FIELD',
      });
    }
    
    const notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      ...notificationData,
      createdAt: new Date(),
      read: false
    };
    
    // Store notification
    if (!notifications.has(studentId)) {
      notifications.set(studentId, []);
    }
    notifications.get(studentId).unshift(notification);
    
    return res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      code: 'INTERNAL_ERROR',
    });
  }
});

// PATCH /api/student/notifications/:notificationId/read
router.patch('/notifications/:notificationId/read', async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    // Find and mark notification as read
    for (let [studentId, studentNotifications] of notifications.entries()) {
      const notification = studentNotifications.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
        notification.readAt = new Date();
        break;
      }
    }
    
    return res.json({
      success: true,
      data: { message: 'Notification marked as read' }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      code: 'INTERNAL_ERROR',
    });
  }
});

// PATCH /api/student/notifications/:studentId/read-all
router.patch('/notifications/:studentId/read-all', async (req, res) => {
  try {
    const { studentId } = req.params;
    const studentNotifications = notifications.get(studentId) || [];
    
    // Mark all notifications as read
    studentNotifications.forEach(notification => {
      notification.read = true;
      notification.readAt = new Date();
    });
    
    return res.json({
      success: true,
      data: { message: 'All notifications marked as read' }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      code: 'INTERNAL_ERROR',
    });
  }
});

// DELETE /api/student/notifications/:notificationId
router.delete('/notifications/:notificationId', async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    // Find and remove notification
    for (let [studentId, studentNotifications] of notifications.entries()) {
      const index = studentNotifications.findIndex(n => n.id === notificationId);
      if (index !== -1) {
        studentNotifications.splice(index, 1);
        break;
      }
    }
    
    return res.json({
      success: true,
      data: { message: 'Notification deleted' }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      code: 'INTERNAL_ERROR',
    });
  }
});

// GET /api/student/notifications/:studentId/unread-count
router.get('/notifications/:studentId/unread-count', async (req, res) => {
  try {
    const { studentId } = req.params;
    const studentNotifications = notifications.get(studentId) || [];
    
    const unreadCount = studentNotifications.filter(n => !n.read).length;
    
    return res.json({
      success: true,
      data: { count: unreadCount }
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
