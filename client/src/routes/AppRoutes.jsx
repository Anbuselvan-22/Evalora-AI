import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

// Auth Pages
import LoginPage from '../pages/auth/LoginPage.jsx'

// Teacher Pages
import TeacherDashboard from '../pages/teacher/TeacherDashboard.jsx'
import UploadEvaluationPage from '../pages/teacher/UploadEvaluationPage.jsx'
import TeacherResultsPage from '../pages/teacher/TeacherResultsPage.jsx'
import TeacherResultDetailPage from '../pages/teacher/TeacherResultDetailPage.jsx'

// Student Pages
import StudentDashboard from '../pages/student/StudentDashboard.jsx'
import StudentResultsPage from '../pages/student/StudentResultsPage.jsx'
import StudentResultDetailPage from '../pages/student/StudentResultDetailPage.jsx'
import PerformanceAnalyticsPage from '../pages/student/PerformanceAnalyticsPage.jsx'
import AIStudyAgentPage from '../pages/student/AIStudyAgentPage.jsx'

// Agent Pages
import TrainerAgentPage from '../pages/agents/TrainerAgentPage.jsx'
import ParentAgentPage from '../pages/agents/ParentAgentPage.jsx'
import MemoryAgentPage from '../pages/agents/MemoryAgentPage.jsx'

// Layout Components
import Navbar from '../components/layout/Navbar.jsx'
import Sidebar from '../components/layout/Sidebar.jsx'

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  const getLayout = (children) => (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  )

  const routes = {
    teacher: [
      { path: '/dashboard', element: <TeacherDashboard /> },
      { path: '/upload', element: <UploadEvaluationPage /> },
      { path: '/results', element: <TeacherResultsPage /> },
      { path: '/results/:id', element: <TeacherResultDetailPage /> },
    ],
    student: [
      { path: '/dashboard', element: <StudentDashboard /> },
      { path: '/results', element: <StudentResultsPage /> },
      { path: '/results/:id', element: <StudentResultDetailPage /> },
      { path: '/analytics', element: <PerformanceAnalyticsPage /> },
      { path: '/ai-tutor', element: <AIStudyAgentPage /> },
    ],
    parent: [
      { path: '/dashboard', element: <ParentAgentPage /> },
    ],
    trainer: [
      { path: '/dashboard', element: <TrainerAgentPage /> },
    ],
  }

  const userRoutes = routes[user.role] || []

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/dashboard" replace />} />
      {userRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={getLayout(element)} />
      ))}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default AppRoutes
