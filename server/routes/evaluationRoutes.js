const authMiddleware = require('../middleware/authMiddleware.js')
const evaluationController = require('../controllers/evaluationController.js')

const express = require('express')
const router = express.Router()

router.use(authMiddleware)

router.get('/:id', evaluationController.getEvaluation)
router.post('/:id/submit', evaluationController.submitEvaluation)

module.exports = router
