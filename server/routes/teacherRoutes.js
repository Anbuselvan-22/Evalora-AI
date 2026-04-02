import express from 'express';
import requireRole from '../middleware/roleMiddleware.js';
import Result from '../models/Result.js';
import Evaluation from '../models/Evaluation.js';
import User from '../models/User.js';

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
    // Get completed results
    const results = await Result.find({ teacherId: req.user.id }).sort({ createdAt: -1 });
    
    // Get processing evaluations
    const evaluations = await Evaluation.find({ teacherId: req.user.id, status: { $in: ['pending', 'processing'] } })
      .sort({ createdAt: -1 })
      .populate('studentId', 'name email');
    
    // Format evaluations to look like results for display
    const formattedEvaluations = evaluations.map(evaluation => ({
      id: evaluation._id,
      evaluationId: evaluation._id,
      studentName: evaluation.metadata?.studentName || 'Unassigned',
      studentEmail: evaluation.studentId?.email || '',
      studentRollNo: evaluation.metadata?.studentRollNo || '',
      subject: evaluation.subject,
      marks: 'Processing',
      obtainedMarks: 0,
      totalMarks: evaluation.totalMarks,
      percentage: 0,
      status: evaluation.status,
      date: evaluation.createdAt,
      isProcessing: true
    }));
    
    // Format results with manual student lookup
    const formattedResults = [];
    for (const result of results) {
      let studentName = 'Unknown';
      let studentEmail = '';
      let studentRollNo = '';
      
      if (result.studentId) {
        try {
          const student = await User.findById(result.studentId);
          if (student) {
            studentName = student.name || 'Unknown';
            studentEmail = student.email || '';
            studentRollNo = student.rollNumber || '';
          }
        } catch (error) {
          console.warn('Failed to lookup student:', error.message);
        }
      }
      
      formattedResults.push({
        id: result._id,
        evaluationId: result.evaluationId,
        studentName,
        studentEmail,
        studentRollNo,
        subject: result.subject,
        marks: `${result.obtainedMarks}/${result.totalMarks}`,
        obtainedMarks: result.obtainedMarks,
        totalMarks: result.totalMarks,
        percentage: result.percentage,
        status: 'completed',
        date: result.createdAt,
        isProcessing: false
      });
    }
    
    // Combine both, with processing evaluations first
    const allItems = [...formattedEvaluations, ...formattedResults];
    
    return res.json({
      success: true,
      data: allItems,
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
