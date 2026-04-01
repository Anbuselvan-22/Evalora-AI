import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import requireRole from '../middleware/roleMiddleware.js';
import Evaluation from '../models/Evaluation.js';

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
    const allowedTypes = /pdf|png|jpg|jpeg|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
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

    const { subject, studentId } = req.body;
    if (!subject) {
      return res.status(400).json({
        success: false,
        message: 'Subject is required',
        code: 'MISSING_FIELD',
      });
    }

    // Create evaluation document
    const evaluation = new Evaluation({
      teacherId: req.user.id,
      studentId: studentId || null,
      subject,
      questionPaperPath: req.files.questionPaper[0].path,
      rubricsPath: req.files.rubrics[0].path,
      answerSheetPath: req.files.answerSheet[0].path,
      totalMarks: 100,
      status: 'processing',
      metadata: {
        fileName: req.files.answerSheet[0].originalname,
        fileSize: req.files.answerSheet[0].size,
        uploadedAt: new Date(),
      },
    });

    await evaluation.save();

    // TODO: Trigger AI evaluation pipeline asynchronously

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
