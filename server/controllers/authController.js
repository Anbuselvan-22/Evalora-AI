const jwt = require('jsonwebtoken')
const User = require('../models/User.js')

const authController = {
  login: async (req, res) => {
    try {
      const { email, password, role } = req.body

      if (!email || !password || !role) {
        return res.status(400).json({ message: 'Please provide all required fields' })
      }

      const user = await User.findOne({ email, role, isActive: true })
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' })
      }

      const isMatch = await user.comparePassword(password)
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' })
      }

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      )

      res.json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          class: user.class
        }
      })
    } catch (error) {
      console.error('Login error:', error)
      res.status(500).json({ message: 'Server error' })
    }
  },

  register: async (req, res) => {
    try {
      const { name, email, password, role, class: className } = req.body

      if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Please provide all required fields' })
      }

      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' })
      }

      const user = new User({
        name,
        email,
        password,
        role,
        class: className
      })

      await user.save()

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      )

      res.status(201).json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          class: user.class
        }
      })
    } catch (error) {
      console.error('Registration error:', error)
      res.status(500).json({ message: 'Server error' })
    }
  },

  getCurrentUser: async (req, res) => {
    try {
      const user = await User.findById(req.userId).select('-password')
      res.json(user)
    } catch (error) {
      console.error('Get current user error:', error)
      res.status(500).json({ message: 'Server error' })
    }
  }
}

module.exports = authController
