const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
const connectDB = require('./config/db.js')

dotenv.config()

const app = express()

connectDB()

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/auth', require('./routes/authRoutes.js'))
app.use('/api/teacher', require('./routes/teacherRoutes.js'))
app.use('/api/student', require('./routes/studentRoutes.js'))
app.use('/api/evaluations', require('./routes/evaluationRoutes.js'))
app.use('/api/student', require('./routes/studyRoutes.js'))

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Evalora AI Server is running' })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Something went wrong!' })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
