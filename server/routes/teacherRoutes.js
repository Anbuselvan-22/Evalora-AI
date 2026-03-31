const authMiddleware = require('../middleware/authMiddleware.js')
const roleMiddleware = require('../middleware/roleMiddleware.js')
const teacherController = require('../controllers/teacherController.js')

const express = require('express')
const router = express.Router()

router.use(authMiddleware)
router.use(roleMiddleware(['teacher', 'admin']))

router.get('/dashboard', teacherController.getDashboardStats)
router.get('/evaluations', teacherController.getEvaluations)
router.post('/upload', teacherController.uploadEvaluation)

module.exports = router
