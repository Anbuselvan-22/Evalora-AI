import express from 'express';
import requireRole from '../middleware/roleMiddleware.js';
import Result from '../models/Result.js';

const router = express.Router();

router.use(requireRole('student'));

// GET /api/student/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const results = await Result.find({ studentId: req.user.id });
    const totalMarks = results.reduce((sum, r) => sum + r.obtainedMarks, 0);
    const averageScore = results.length > 0
      ? Math.round((totalMarks / (results.length * 100)) * 100)
      : 0;

    // Score progression data
    const scoreProgression = results.map((r) => ({
      date: new Date(r.createdAt).toLocaleDateString(),
      score: r.percentage,
    }));

    // Subject distribution
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
    const results = await Result.find({ studentId: req.user.id }).sort({ createdAt: -1 });
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
    const result = await Result.findById(req.params.id);
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
    const results = await Result.find({ studentId: req.user.id });

    // Identify weak and strong areas
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
