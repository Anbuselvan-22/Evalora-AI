import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/ui/Loader';
import Layout from '../components/layout/Layout';

const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const TeacherDashboard = lazy(() => import('../pages/teacher/TeacherDashboard'));
const TeacherProfilePage = lazy(() => import('../pages/teacher/TeacherProfilePage'));
const UploadEvaluationPage = lazy(() => import('../pages/teacher/UploadEvaluationPage'));
const TeacherResultsPage = lazy(() => import('../pages/teacher/TeacherResultsPage'));
const TeacherResultDetailPage = lazy(() => import('../pages/teacher/TeacherResultDetailPage'));
const StudentDashboard = lazy(() => import('../pages/student/StudentDashboard'));
const StudentProfilePage = lazy(() => import('../pages/student/StudentProfilePage'));
const StudentResultsPage = lazy(() => import('../pages/student/StudentResultsPage'));
const NotificationsPage = lazy(() => import('../pages/student/NotificationsPage'));
const StudentResultDetailPage = lazy(() => import('../pages/student/StudentResultDetailPage'));
const PerformanceAnalyticsPage = lazy(() => import('../pages/student/PerformanceAnalyticsPage'));
const AIStudyAgentPage = lazy(() => import('../pages/student/AIStudyAgentPage'));
const FocusSessionPage = lazy(() => import('../pages/student/FocusSessionPage'));
const TrainerAgentPage = lazy(() => import('../pages/agents/TrainerAgentPage'));
const ParentAgentPage = lazy(() => import('../pages/agents/ParentAgentPage'));
const MemoryAgentPage = lazy(() => import('../pages/agents/MemoryAgentPage'));

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<Loader />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<LoginPage />} />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/profile" element={<TeacherProfilePage />} />
            <Route path="/teacher/upload" element={<UploadEvaluationPage />} />
            <Route path="/teacher/results" element={<TeacherResultsPage />} />
            <Route path="/teacher/results/:id" element={<TeacherResultDetailPage />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/profile" element={<StudentProfilePage />} />
            <Route path="/student/notifications" element={<NotificationsPage />} />
            <Route path="/student/results" element={<StudentResultsPage />} />
            <Route path="/student/results/:id" element={<StudentResultDetailPage />} />
            <Route path="/student/analytics" element={<PerformanceAnalyticsPage />} />
            <Route path="/student/focus-session" element={<FocusSessionPage />} />
            <Route path="/student/study-agent" element={<AIStudyAgentPage />} />
            <Route path="/agents/trainer" element={<TrainerAgentPage />} />
            <Route path="/agents/parent" element={<ParentAgentPage />} />
            <Route path="/agents/memory" element={<MemoryAgentPage />} />
          </Route>
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

export default AppRoutes;
