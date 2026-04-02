import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import requireRole from '../middleware/roleMiddleware.js';
import Evaluation from '../models/Evaluation.js';
import { runEvaluationPipelineAsync } from '../services/pipelineService.js';
import { findOrCreateStudent } from '../services/studentLookupService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '../uploads');
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|png|jpg|jpeg|gif|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) || file.mimetype === 'text/plain';
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Invalid file type'));
  },
});

router.use(requireRole('teacher'));

// POST /api/evaluate
router.post('/', upload.fields([
  { name: 'questionPaper', maxCount: 1 },
  { name: 'rubrics', maxCount: 1 },
  { name: 'answerSheet', maxCount: 1 },
]), async (req, res) => {
  try {
    if (!req.files || !req.files.questionPaper || !req.files.rubrics || !req.files.answerSheet) {
      return res.status(400).json({
        success: false,
        message: 'All three files (questionPaper, rubrics, answerSheet) are required',
        code: 'MISSING_FILES',
      });
    }

    const { subject, studentId, studentName, studentRollNo } = req.body;
    if (!subject) {
      return res.status(400).json({
        success: false,
        message: 'Subject is required',
        code: 'MISSING_FIELD',
      });
    }

    // Create or find student by name and roll number
    let student = null;
    if (studentName || studentRollNo) {
      try {
        student = await findOrCreateStudent(studentName, studentRollNo);
        console.log(`Student processed: ${student?.name || 'Unknown'} (${student?.rollNumber || 'No Roll No'})`);
      } catch (error) {
        console.warn('Could not process student info:', error.message);
      }
    }

    // Create evaluation document
    const evaluation = new Evaluation({
      teacherId: req.user.id,
      studentId: student?._id || null,
      subject,
      questionPaperPath: req.files.questionPaper[0].path,
      rubricsPath: req.files.rubrics[0].path,
      answerSheetPath: req.files.answerSheet[0].path,
      totalMarks: 100,
      status: 'pending',
      metadata: {
        fileName: req.files.answerSheet[0].originalname,
        fileSize: req.files.answerSheet[0].size,
        uploadedAt: new Date(),
        studentName: studentName || 'Unassigned',
        studentRollNo: studentRollNo || '',
      },
    });

    await evaluation.save();

    // Trigger AI evaluation pipeline asynchronously
    console.log('🔄 Triggering AI evaluation pipeline...');
    runEvaluationPipelineAsync(
      evaluation._id,
      evaluation.questionPaperPath,
      evaluation.rubricsPath,
      evaluation.answerSheetPath
    ).catch(error => {
      console.error('Pipeline failed:', error);
      // The pipeline will update the evaluation status to 'failed'
    });

    return res.status(201).json({
      success: true,
      data: {
        evaluationId: evaluation._id,
        message: 'Evaluation submitted for processing',
      },
    });
  } catch (error) {
    console.error('Evaluation error:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
      code: 'INTERNAL_ERROR',
    });
  }
});

export default router;
