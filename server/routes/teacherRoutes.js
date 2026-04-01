import express from 'express';
import requireRole from '../middleware/roleMiddleware.js';
import Result from '../models/Result.js';

const router = express.Router();

router.use(requireRole('teacher'));

// GET /api/teacher/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const results = await Result.find({ teacherId: req.user.id }).limit(10).sort({ createdAt: -1 });
    const totalResults = await Result.countDocuments({ teacherId: req.user.id });
    const averageMarks = results.length > 0
      ? Math.round(results.reduce((sum, r) => sum + r.obtainedMarks, 0) / results.length)
      : 0;

    return res.json({
      success: true,
      data: {
        totalStudents: 0,
        evaluationsDone: totalResults,
        averageMarks,
        recentEvaluations: results,
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

// GET /api/teacher/results
router.get('/results', async (req, res) => {
  try {
    const results = await Result.find({ teacherId: req.user.id }).sort({ createdAt: -1 });
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

// GET /api/teacher/results/:id
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

export default router;
