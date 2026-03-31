const authController = require('../controllers/authController.js')
const authMiddleware = require('../middleware/authMiddleware.js')

const express = require('express')
const router = express.Router()

router.post('/login', authController.login)
router.post('/register', authController.register)
router.get('/me', authMiddleware, authController.getCurrentUser)

module.exports = router
