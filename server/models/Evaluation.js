import mongoose from 'mongoose';

const evaluationSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
    },
    questionPaperPath: {
      type: String,
      required: true,
    },
    rubricsPath: {
      type: String,
      required: true,
    },
    answerSheetPath: {
      type: String,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
      default: 100,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    metadata: {
      fileName: String,
      fileSize: Number,
      uploadedAt: Date,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Evaluation', evaluationSchema);
