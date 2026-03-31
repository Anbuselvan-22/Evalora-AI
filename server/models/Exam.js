const mongoose = require('mongoose')

const examSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  class: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questions: [{
    question: {
      type: String,
      required: true
    },
    maxMarks: {
      type: Number,
      required: true,
      default: 10
    },
    type: {
      type: String,
      enum: ['short', 'long', 'mcq'],
      default: 'short'
    }
  }],
  totalMarks: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    default: 60
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'completed'],
    default: 'draft'
  },
  submissionDeadline: {
    type: Date,
    required: true
  },
  submittedBy: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    submittedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['submitted', 'evaluated'],
      default: 'submitted'
    }
  }]
}, {
  timestamps: true
})

module.exports = mongoose.model('Exam', examSchema)
