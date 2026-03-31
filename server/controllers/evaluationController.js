const authMiddleware = require('../middleware/authMiddleware.js')
const roleMiddleware = require('../middleware/roleMiddleware.js')

const evaluationController = {
  getEvaluation: async (req, res) => {
    try {
      const { id } = req.params
      const evaluation = {
        _id: id,
        title: 'Sample Evaluation',
        subject: 'Mathematics',
        description: 'Complete this math assessment',
        questions: [
          {
            questionIndex: 0,
            question: 'What is 2 + 2?',
            maxMarks: 10,
            type: 'short'
          }
        ]
      }
      res.json(evaluation)
    } catch (error) {
      console.error('Get evaluation error:', error)
      res.status(500).json({ message: 'Server error' })
    }
  },

  submitEvaluation: async (req, res) => {
    try {
      const { id } = req.params
      const submission = {
        _id: Date.now().toString(),
        evaluationId: id,
        status: 'submitted',
        submittedAt: new Date()
      }
      res.json(submission)
    } catch (error) {
      console.error('Submit evaluation error:', error)
      res.status(500).json({ message: 'Server error' })
    }
  }
}

module.exports = evaluationController
