import mongoose from 'mongoose';

const questionDataSchema = new mongoose.Schema(
  {
    questionNumber: {
      type: Number,
      required: true,
    },
    correctPoints: {
      type: Number,
      default: 0,
    },
    missingPoints: {
      type: Number,
      default: 0,
    },
    marks: {
      type: Number,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    mistakes: [
      {
        type: String,
      },
    ],
    suggestions: [
      {
        type: String,
      },
    ],
  },
  { _id: false },
);

const resultSchema = new mongoose.Schema(
  {
    evaluationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Evaluation',
      required: true,
      unique: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    subject: {
      type: String,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    obtainedMarks: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    questionWiseData: [questionDataSchema],
    overallMistakes: [
      {
        type: String,
      },
    ],
    overallSuggestions: [
      {
        type: String,
      },
    ],
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.85,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Result', resultSchema);
