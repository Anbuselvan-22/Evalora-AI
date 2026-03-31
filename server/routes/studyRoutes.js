const authMiddleware = require('../middleware/authMiddleware.js')
const roleMiddleware = require('../middleware/roleMiddleware.js')
const studyController = require('../controllers/studyController.js')

const express = require('express')
const router = express.Router()

router.use(authMiddleware)
router.use(roleMiddleware(['student', 'admin']))

router.post('/chat', studyController.sendMessage)
router.get('/chat/history', studyController.getChatHistory)

module.exports = router
