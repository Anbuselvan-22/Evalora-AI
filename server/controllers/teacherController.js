const teacherController = {
  getDashboardStats: async (req, res) => {
    try {
      const stats = {
        totalEvaluations: 0,
        pendingEvaluations: 0,
        completedEvaluations: 0,
        averageScore: 85
      }
      res.json(stats)
    } catch (error) {
      console.error('Dashboard stats error:', error)
      res.status(500).json({ message: 'Server error' })
    }
  },

  getEvaluations: async (req, res) => {
    try {
      const evaluations = [
        {
          _id: '1',
          title: 'Math Quiz 1',
          subject: 'Mathematics',
          class: '10A',
          status: 'completed',
          submissionCount: 25,
          createdAt: new Date()
        },
        {
          _id: '2',
          title: 'Science Test',
          subject: 'Science',
          class: '10B',
          status: 'pending',
          submissionCount: 0,
          createdAt: new Date()
        }
      ]
      res.json(evaluations)
    } catch (error) {
      console.error('Get evaluations error:', error)
      res.status(500).json({ message: 'Server error' })
    }
  },

  uploadEvaluation: async (req, res) => {
    try {
      const { title, subject, class: className, description } = req.body
      
      if (!title || !subject || !className) {
        return res.status(400).json({ message: 'Please provide required fields' })
      }

      const evaluation = {
        _id: Date.now().toString(),
        title,
        subject,
        class: className,
        description,
        status: 'pending',
        createdAt: new Date()
      }

      res.json(evaluation)
    } catch (error) {
      console.error('Upload evaluation error:', error)
      res.status(500).json({ message: 'Server error' })
    }
  }
}

module.exports = teacherController
