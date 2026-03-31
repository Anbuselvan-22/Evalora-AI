const authMiddleware = require('../middleware/authMiddleware.js')
const roleMiddleware = require('../middleware/roleMiddleware.js')
const studentController = require('../controllers/studentController.js')

const express = require('express')
const router = express.Router()

router.use(authMiddleware)
router.use(roleMiddleware(['student', 'admin']))

router.get('/dashboard', studentController.getDashboardStats)
router.get('/results', studentController.getResults)
router.get('/results/:id', studentController.getResultDetail)
router.get('/analytics', studentController.getAnalytics)

module.exports = router
