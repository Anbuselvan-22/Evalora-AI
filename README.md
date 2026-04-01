# Evalora AI - Smart Evaluation & Learning Platform

A comprehensive AI-powered education platform that enables teachers to evaluate student responses intelligently and provides personalized learning experiences for students.

## 🎯 Features

### Teacher Features
- **Dashboard**: View evaluation statistics and recent submissions
- **Upload Evaluations**: Submit question papers, rubrics, and answer sheets for AI evaluation
- **Results Management**: Browse and review all evaluation results
- **Detailed Review**: View question-wise marks, mistakes, and improvement suggestions

### Student Features
- **Dashboard**: Track total marks, average scores, and performance trends
- **Results**: View all evaluation results with detailed feedback
- **Performance Analytics**: Identify weak and strong areas
- **AI Study Agent**: Chat with AI for personalized study help
- **Agent Pages**: Access study techniques, performance summaries, and historical comparisons

## 🏗️ Project Structure

```
Evalora-AI/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── pages/          # Route-based pages
│   │   ├── components/     # Reusable React components
│   │   ├── services/       # API service modules
│   │   ├── context/        # React Context (Auth)
│   │   ├── utils/          # Helper functions
│   │   └── App.jsx         # Main app component
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env                # Frontend environment variables
│
└── server/                 # Node.js/Express backend
    ├── routes/             # API route handlers
    ├── controllers/        # Business logic
    ├── models/             # MongoDB schemas
    ├── middleware/         # Auth & role middleware
    ├── services/           # AI pipeline services
    ├── utils/              # Helper utilities
    ├── uploads/            # File storage
    ├── index.js            # Server entry point
    ├── package.json
    └── .env                # Backend environment variables
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB (local or Atlas)

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_DEV_LOGS=true
```

4. Start development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/evalora-ai
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
UPLOAD_DIR=./uploads
```

4. Start development server:
```bash
npm run dev
```

The backend will be available at `http://localhost:5000`

## 🔐 Authentication

- **Role-based Login**: Teachers and students have separate login flows
- **JWT Tokens**: Secure token-based authentication
- **Protected Routes**: All API endpoints (except `/auth`) require valid JWT token

### Test Credentials (Development)

Teacher:
- Email: `teacher@example.com`
- Password: `password123`
- Role: Teacher

Student:
- Email: `student@example.com`
- Password: `password123`
- Role: Student

## 📋 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### Teacher Routes
- `GET /api/teacher/dashboard` - Dashboard statistics
- `GET /api/teacher/results` - List all results
- `GET /api/teacher/results/:id` - Get specific result

### Evaluation
- `POST /api/evaluate` - Submit files for evaluation (multipart form-data)

### Student Routes
- `GET /api/student/dashboard` - Dashboard with charts
- `GET /api/student/results` - List student's results
- `GET /api/student/results/:id` - Get specific result
- `GET /api/student/analytics` - Performance analytics

### Agent Routes
- `GET /api/agents/parent` - Parent performance summary
- `GET /api/agents/memory` - Historical performance
- `POST /api/agents/study-agent` - AI study chat

## 🎨 Frontend Technologies

- **React** (Vite)
- **Tailwind CSS** - Styling with dark theme
- **Framer Motion** - Page & component animations
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **React Router** - Navigation
- **React Context** - State management

## ⚙️ Backend Technologies

- **Express.js** - Server framework
- **MongoDB + Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **Tesseract.js** - OCR (text extraction)
- **CORS** - Cross-origin requests

## 🤖 AI Evaluation Pipeline

The system processes evaluations in stages:

1. **OCR Extraction**: Extract text from PDF/image files
2. **Text Cleaning**: Normalize and remove OCR artifacts
3. **Question Splitting**: Separate questions from continuous text
4. **AI Evaluation**: Compare answers against rubric using LLM
5. **Feedback Generation**: Create mistakes list and improvement suggestions
6. **Result Storage**: Save in MongoDB with confidence score

*Note: Currently using mock implementations. Replace with actual LLM (OpenAI, Google Gemini) in production.*

## 🧪 Testing

### Frontend Tests (Optional)
```bash
cd client
npm run test
```

### Backend Tests (Optional)
```bash
cd server
npm run test
```

## 📦 Deployment

### Frontend (Vercel)
1. Connect repository to Vercel
2. Set environment variable: `VITE_API_URL`
3. Deploy

### Backend (Render/Railway)
1. Connect repository to platform
2. Configure environment variables
3. Deploy

## 📝 Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_DEV_LOGS=false
```

### Backend (.env)
```
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/evalora-ai
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
UPLOAD_DIR=./uploads
OPENAI_API_KEY=your_key
GEMINI_API_KEY=your_key
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally or check Atlas connection string
- Verify `MONGODB_URI` in `.env`

### Token Expired
- Login again to get a fresh token
- Check `JWT_EXPIRES_IN` setting

### CORS Errors
- Verify `CLIENT_URL` matches your frontend URL
- Check `CORS_ORIGIN` in backend settings

### File Upload Issues
- Ensure `uploads` directory exists and is writable
- Check file size limits (50MB max)
- Verify allowed file types: pdf, png, jpg, jpeg, gif

## 📚 Additional Resources

- [Evalora AI Requirements](/requirements.md)
- [System Design](/design.md)
- [Implementation Tasks](/tasks.md)

## 📄 License

This project is proprietary and confidential.

## 👥 Contributors

- Built with ❤️ for smart education

---

**Happy Learning! 🎓**
