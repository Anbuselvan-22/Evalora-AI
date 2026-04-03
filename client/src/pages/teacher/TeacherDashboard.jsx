import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as teacherService from '../../services/teacherService';
import Loader from '../../components/ui/Loader';
import StatCard from '../../components/ui/StatCard';
import { formatDate } from '../../utils/helpers';
import { Users, FileText, TrendingUp, CheckCircle, Award, Target, BookOpen, Activity } from 'lucide-react';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    teacherService.getDashboard(controller.signal)
      .then(setData)
      .catch((err) => {
        if (err.name !== 'AbortError' && err.name !== 'CanceledError') {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  if (loading) return <Loader />;
  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-red-400 text-sm">{error}</p>
    </div>
  );

  const recentEvaluations = data?.recentEvaluations ?? [];
  const allEvaluations = data?.allEvaluations ?? [];
  const displayEvaluations = showAll ? allEvaluations : recentEvaluations.slice(0, 3);
  const stats = [
    {
      label: 'Total Students',
      value: data?.totalStudents ?? 0,
      icon: '👥',
      color: 'from-blue-500 to-blue-600',
      change: '+12%',
      trend: 'up'
    },
    {
      label: 'Evaluations Done',
      value: data?.evaluationsDone ?? 0,
      icon: '📝',
      color: 'from-green-500 to-green-600',
      change: '+8%',
      trend: 'up'
    },
    {
      label: 'Average Marks',
      value: `${data?.averageMarks ?? 0}%`,
      icon: '📊',
      color: 'from-purple-500 to-purple-600',
      change: '+5%',
      trend: 'up'
    },
    {
      label: 'Completion Rate',
      value: `${Math.round((data?.evaluationsDone / data?.totalStudents) * 100) || 0}%`,
      icon: '✅',
      color: 'from-indigo-500 to-indigo-600',
      change: '+3%',
      trend: 'up'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Teacher Dashboard</h1>
            <p className="text-slate-400 mt-1">Welcome back, {user?.name || 'Teacher'}! Here's your teaching overview.</p>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/teacher/upload')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
            >
              Upload Evaluation
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/teacher/results')}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
            >
              View All Results
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Modern Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="px-6 pb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Students Card */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            className="relative bg-gradient-to-br from-blue-600/20 via-blue-700/20 to-indigo-600/20 backdrop-blur-xl rounded-2xl border border-blue-500/30 p-6 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex items-center gap-1 text-green-400 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>+12%</span>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{data?.totalStudents ?? 0}</h3>
              <p className="text-blue-300 text-sm font-medium">Total Students</p>
              <div className="mt-3 h-1 bg-blue-500/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                />
              </div>
            </div>
          </motion.div>

          {/* Evaluations Done Card */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            className="relative bg-gradient-to-br from-green-600/20 via-green-700/20 to-emerald-600/20 backdrop-blur-xl rounded-2xl border border-green-500/30 p-6 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500/20 rounded-xl border border-green-500/30">
                  <FileText className="w-6 h-6 text-green-400" />
                </div>
                <div className="flex items-center gap-1 text-green-400 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>+8%</span>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{data?.evaluationsDone ?? 0}</h3>
              <p className="text-green-300 text-sm font-medium">Evaluations Done</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-1 bg-green-500/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '70%' }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                  />
                </div>
                <span className="text-xs text-green-400 font-medium">Active</span>
              </div>
            </div>
          </motion.div>

          {/* Average Marks Card */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            className="relative bg-gradient-to-br from-purple-600/20 via-purple-700/20 to-pink-600/20 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-6 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30">
                  <Target className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex items-center gap-1 text-green-400 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>+5%</span>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{data?.averageMarks ?? 0}%</h3>
              <p className="text-purple-300 text-sm font-medium">Average Marks</p>
              <div className="mt-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-purple-400">Above target</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Completion Rate Card */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            className="relative bg-gradient-to-br from-indigo-600/20 via-indigo-700/20 to-blue-600/20 backdrop-blur-xl rounded-2xl border border-indigo-500/30 p-6 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
                  <CheckCircle className="w-6 h-6 text-indigo-400" />
                </div>
                <div className="flex items-center gap-1 text-green-400 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>+3%</span>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{Math.round((data?.evaluationsDone / data?.totalStudents) * 100) || 0}%</h3>
              <p className="text-indigo-300 text-sm font-medium">Completion Rate</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-1 bg-indigo-500/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round((data?.evaluationsDone / data?.totalStudents) * 100) || 0}%` }}
                    transition={{ duration: 1, delay: 0.7 }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-blue-500"
                  />
                </div>
                <span className="text-xs text-indigo-400 font-medium">
                  {Math.round((data?.evaluationsDone / data?.totalStudents) * 100) || 0}%
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Recent Evaluations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="px-6 pt-8"
      >
        <div className="glass rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-slate-200">Recent Evaluations</h2>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg font-medium transition-colors"
              >
                Export Data
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAll(!showAll)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-300 ${
                  showAll 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25' 
                    : 'bg-slate-700 hover:bg-slate-600 text-white text-sm shadow-lg'
                }`}
              >
                {showAll ? 'Show Recent' : 'View All'}
                {showAll && (
                  <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                    {allEvaluations.length}
                  </span>
                )}
              </motion.button>
            </div>
          </div>

          <AnimatePresence>
            {displayEvaluations.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
                  <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707L19.586 16H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707L19.586 16H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707L19.586 16H7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-slate-300 mb-2">
                  {showAll ? 'No Evaluations Found' : 'No Recent Evaluations Yet'}
                </h3>
                <p className="text-slate-400 max-w-md mx-auto">
                  {showAll 
                    ? 'No evaluations found in the system. Upload your first evaluation to see student performance data and AI-powered insights.'
                    : 'Start by uploading your first evaluation to see student performance data and AI-powered insights.'
                  }
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors"
                >
                  Upload First Evaluation
                </motion.button>
              </motion.div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-4 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Student</th>
                      <th className="text-left py-4 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Subject</th>
                      <th className="text-left py-4 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Score</th>
                      <th className="text-left py-4 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="text-left py-4 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
                      <th className="text-center py-4 px-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayEvaluations.map((ev, index) => (
                      <motion.tr
                        key={ev.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index }}
                        className="border-b border-slate-800 hover:bg-slate-700/30 transition-colors"
                      >
                        <td className="py-4 px-4 w-32">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-slate-700/50">
                                {ev.studentName?.charAt(0)?.toUpperCase() || 'S'}
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 9l-4 4M6 18l-8.5-8.5M21 12a9 9 0 11-18 0 9 9 11 18 0 9 9z" />
                                </svg>
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium text-slate-200 truncate">{ev.studentName || 'Unknown'}</div>
                              <div className="text-xs text-slate-400 truncate">{ev.studentRollNo || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-slate-300 truncate max-w-xs">{ev.subject}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <span className={`font-bold text-lg ${
                                ev.percentage >= 80 ? 'text-green-400' :
                                ev.percentage >= 60 ? 'text-yellow-400' :
                                'text-red-400'
                              }`}>
                                {ev.percentage}%
                              </span>
                              {/* Progress ring */}
                              <div className="absolute -inset-2 w-12 h-12">
                                <svg className="w-full h-full transform -rotate-90">
                                  <circle
                                    className="text-slate-700"
                                    strokeWidth="3"
                                    fill="none"
                                    strokeDasharray={`${Math.min(ev.percentage, 100) * 2.51} 100`}
                                    strokeLinecap="round"
                                  />
                                  <circle
                                    className={`${
                                      ev.percentage >= 80 ? 'text-green-500' :
                                      ev.percentage >= 60 ? 'text-yellow-500' :
                                      'text-red-500'
                                    }`}
                                    strokeWidth="3"
                                    fill="none"
                                    strokeDasharray={`${Math.min(ev.percentage, 100) * 2.51} 100`}
                                    strokeLinecap="round"
                                    transform="rotate(-90)"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-2 ${
                            ev.status === 'completed' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border border-green-400/30 shadow-lg shadow-green-500/25' :
                            ev.status === 'processing' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border border-yellow-400/30 shadow-lg shadow-yellow-500/25 animate-pulse' :
                            'bg-gradient-to-r from-red-500 to-pink-500 text-white border border-red-400/30 shadow-lg shadow-red-500/25 animate-pulse'
                          }`}>
                            <div className="w-2 h-2 rounded-full bg-white/20 mr-2">
                              {ev.status === 'completed' && (
                                <svg className="w-2 h-2 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2m0 0l2 2m-2 12l-2-2m-2 12l-6-2" />
                                </svg>
                              )}
                              {ev.status === 'processing' && (
                                <svg className="w-2 h-2 text-yellow-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v8a1 1 0 018h2a1 1 0 018v8a1 1 0 018-2 2m0 0h-2a1 1 0 00-2v8a1 1 0 00-2z" />
                                </svg>
                              )}
                              {ev.status === 'pending' && (
                                <svg className="w-2 h-2 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l-3 3m0 0l3 3m-3-3h-6" />
                                </svg>
                              )}
                            </div>
                            {ev.status === 'completed' ? 'Completed' :
                             ev.status === 'processing' ? 'Processing' : 'Pending'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-400 text-sm whitespace-nowrap">
                          {formatDate(ev.date)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex justify-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => navigate(`/teacher/results/${ev.id}`)}
                              className="p-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-indigo-500/25"
                              title="View Details"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 6 0 3 3 0 01-6 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c-2.478 0-4.732 2.943-7.542 7-1.519 4.057-7.542 7-1.519 4.057-7.542 7 0z" />
                              </svg>
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => window.print()}
                              className="p-2.5 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-slate-500/25"
                              title="Download Report"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3.75-3.75M17.25 12l-3.75 3.75M4.5 20.25h15M4.5 12h15" />
                              </svg>
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default TeacherDashboard;
