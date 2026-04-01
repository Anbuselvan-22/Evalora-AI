import express from 'express';
import Result from '../models/Result.js';

const router = express.Router();

// GET /api/agents/parent
router.get('/parent', async (req, res) => {
  try {
    const results = await Result.find({ studentId: req.user.id });
    const subjects = results.reduce((acc, r) => {
      acc.push({
        name: r.subject,
        marks: r.obtainedMarks,
        totalMarks: r.totalMarks,
      });
      return acc;
    }, []);

    const averageScore = results.length > 0
      ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length)
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
    const results = await Result.find({ studentId: req.user.id }).sort({ createdAt: -1 });

    const performanceHistory = results.map((r) => ({
      date: r.createdAt,
      score: r.percentage,
      subject: r.subject,
      marks: r.obtainedMarks,
      totalMarks: r.totalMarks,
    }));

    const comparisonData = results.map((r) => ({
      name: r.subject,
      score: r.percentage,
      previousScore: r.percentage - 5, // Mock previous score
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

    // Mock AI response
    const mockReplies = [
      'That\'s a great question! Let me help you understand this concept better.',
      'I\'d be happy to help you with that. Here\'s what you should know...',
      'Let me break this down for you in simple terms.',
      'Based on your performance, here\'s my recommendation for improvement.',
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
