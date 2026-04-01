import express from 'express';
import requireRole from '../middleware/roleMiddleware.js';
import Result from '../models/Result.js';

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
    let results = [];
    try {
      results = await Result.find({ studentId: req.user.id }).sort({ createdAt: -1 });
    } catch (e) {
      results = MOCK_RESULTS;
    }
    return res.json({
      success: true,
      data: results,
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
      subjectStats[r.subject].total += r.percentage;
      subjectStats[r.subject].count += 1;
    });

    const weakAreas = Object.entries(subjectStats)
      .filter(([, stats]) => (stats.total / stats.count) < 60)
      .map(([subject]) => subject);

    const strongAreas = Object.entries(subjectStats)
      .filter(([, stats]) => (stats.total / stats.count) >= 80)
      .map(([subject]) => subject);

    const performanceHistory = results.map((r) => ({
      date: r.createdAt,
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

export default router;
