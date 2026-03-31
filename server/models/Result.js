const mongoose = require('mongoose')

const resultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [{
    questionIndex: {
      type: Number,
      required: true
    },
    answer: {
      type: String,
      required: true
    },
    marksObtained: {
      type: Number,
      default: 0
    },
    maxMarks: {
      type: Number,
      required: true
    },
    feedback: {
      type: String,
      default: ''
    },
    mistakes: [{
      type: {
        type: String,
        enum: ['grammar', 'spelling', 'content', 'structure', 'concept'],
        required: true
      },
      description: {
        type: String,
        required: true
      },
      suggestion: {
        type: String,
        default: ''
      },
      severity: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
      }
    }]
  }],
  totalMarks: {
    type: Number,
    required: true
  },
  obtainedMarks: {
    type: Number,
    default: 0
  },
  percentage: {
    type: Number,
    default: 0
  },
  grade: {
    type: String,
    enum: ['A', 'B', 'C', 'D', 'F'],
    default: 'F'
  },
  overallFeedback: {
    type: String,
    default: ''
  },
  strengths: [{
    type: String
  }],
  improvements: [{
    type: String
  }],
  evaluatedAt: {
    type: Date,
    default: Date.now
  },
  evaluationStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed'],
    default: 'pending'
  },
  files: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimetype: String
  }]
}, {
  timestamps: true
})

resultSchema.pre('save', function(next) {
  if (this.isModified('obtainedMarks') && this.totalMarks) {
    this.percentage = Math.round((this.obtainedMarks / this.totalMarks) * 100)
    
    if (this.percentage >= 90) this.grade = 'A'
    else if (this.percentage >= 80) this.grade = 'B'
    else if (this.percentage >= 70) this.grade = 'C'
    else if (this.percentage >= 60) this.grade = 'D'
    else this.grade = 'F'
  }
  next()
})

module.exports = mongoose.model('Result', resultSchema)
