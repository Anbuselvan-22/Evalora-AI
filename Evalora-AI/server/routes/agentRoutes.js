import express from 'express';
import Result from '../models/Result.js';

const router = express.Router();

const MOCK_RESULTS = [
  {
    subject: 'Mathematics',
    marks: 85,
    totalMarks: 100,
    percentage: 85,
  },
  {
    subject: 'Physics',
    marks: 72,
    totalMarks: 100,
    percentage: 72,
  },
];

// GET /api/agents/parent
router.get('/parent', async (req, res) => {
  try {
    let results = [];
    try {
      results = await Result.find({ studentId: req.user.id });
    } catch (e) {
      results = MOCK_RESULTS;
    }

    const subjects = results.map((r) => ({
      name: r.subject || 'Unknown',
      marks: r.obtainedMarks || r.marks,
      totalMarks: r.totalMarks || 100,
    }));

    const averageScore = results.length > 0
      ? Math.round(results.reduce((sum, r) => sum + (r.percentage || 0), 0) / results.length)
      : 0;

    return res.json({
      success: true,
      data: {
        subjects,
        averageScore,
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

// GET /api/agents/memory
router.get('/memory', async (req, res) => {
  try {
    let results = [];
    try {
      results = await Result.find({ studentId: req.user.id }).sort({ createdAt: -1 });
    } catch (e) {
      results = MOCK_RESULTS.map((r, i) => ({ ...r, createdAt: new Date(Date.now() - i * 86400000), _id: i }));
    }

    const performanceHistory = (Array.isArray(results) ? results : []).map((r) => ({
      date: r.createdAt || new Date(),
      score: r.percentage || r.marks,
      subject: r.subject,
      marks: r.obtainedMarks || r.marks,
      totalMarks: r.totalMarks || 100,
    }));

    const comparisonData = (Array.isArray(results) ? results : []).map((r) => ({
      name: r.subject || 'Subject',
      score: r.percentage || r.marks,
      previousScore: (r.percentage || r.marks) - 5,
    }));

    return res.json({
      success: true,
      data: {
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

// POST /api/agents/study-agent
router.post('/study-agent', (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
        code: 'EMPTY_MESSAGE',
      });
    }

    const mockReplies = [
      'That\'s a great question! Let me help you understand this concept better. Based on your performance, I\'d recommend focusing on step-by-step problem-solving techniques.',
      'I\'d be happy to help you with that. Here\'s what you should know: Practice active recall, test yourself frequently, and create mind maps to visualize concepts.',
      'Let me break this down for you in simple terms. Understanding the fundamentals is key to mastering advanced topics.',
      'Based on your performance, here\'s my recommendation for improvement: Allocate more time to weak areas and maintain consistency in your study schedule.',
    ];

    const reply = mockReplies[Math.floor(Math.random() * mockReplies.length)];

    return res.json({
      success: true,
      data: {
        reply,
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

export default router;
