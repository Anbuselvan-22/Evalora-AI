const studentController = {
  getDashboardStats: async (req, res) => {
    try {
      const stats = {
        totalEvaluations: 5,
        completedEvaluations: 3,
        averageScore: 78,
        pendingEvaluations: 2
      }
      res.json(stats)
    } catch (error) {
      console.error('Dashboard stats error:', error)
      res.status(500).json({ message: 'Server error' })
    }
  },

  getResults: async (req, res) => {
    try {
      const results = [
        {
          _id: '1',
          exam: { title: 'Math Quiz 1', subject: 'Mathematics' },
          obtainedMarks: 85,
          totalMarks: 100,
          percentage: 85,
          grade: 'B',
          createdAt: new Date()
        },
        {
          _id: '2',
          exam: { title: 'Science Test', subject: 'Science' },
          obtainedMarks: 92,
          totalMarks: 100,
          percentage: 92,
          grade: 'A',
          createdAt: new Date()
        }
      ]
      res.json(results)
    } catch (error) {
      console.error('Get results error:', error)
      res.status(500).json({ message: 'Server error' })
    }
  },

  getResultDetail: async (req, res) => {
    try {
      const { id } = req.params
      const result = {
        _id: id,
        exam: { title: 'Math Quiz 1', subject: 'Mathematics', class: '10A' },
        obtainedMarks: 85,
        totalMarks: 100,
        percentage: 85,
        grade: 'B',
        evaluatedAt: new Date(),
        answers: [
          {
            questionIndex: 0,
            answer: 'The answer to the first question...',
            marksObtained: 8,
            maxMarks: 10,
            feedback: 'Good attempt, but could be more detailed.',
            mistakes: [
              {
                type: 'content',
                description: 'Missing key concept explanation',
                severity: 'medium'
              }
            ]
          }
        ],
        overallFeedback: 'Good performance overall. Focus on providing more detailed explanations.',
        strengths: ['Clear writing', 'Good structure'],
        improvements: ['Add more details', 'Include examples']
      }
      res.json(result)
    } catch (error) {
      console.error('Get result detail error:', error)
      res.status(500).json({ message: 'Server error' })
    }
  },

  getAnalytics: async (req, res) => {
    try {
      const analytics = {
        performanceData: [
          { name: 'Test 1', score: 75 },
          { name: 'Test 2', score: 82 },
          { name: 'Test 3', score: 85 },
          { name: 'Test 4', score: 78 }
        ],
        subjectWisePerformance: {
          'Mathematics': 85,
          'Science': 92,
          'English': 78
        },
        strengths: ['Problem solving', 'Critical thinking'],
        improvementAreas: ['Writing clarity', 'Time management']
      }
      res.json(analytics)
    } catch (error) {
      console.error('Get analytics error:', error)
      res.status(500).json({ message: 'Server error' })
    }
  }
}

module.exports = studentController
