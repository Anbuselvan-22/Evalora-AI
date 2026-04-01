import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as teacherService from '../../services/teacherService';
import Loader from '../../components/ui/Loader';
import StatCard from '../../components/ui/StatCard';
import { formatDate } from '../../utils/helpers';

const TeacherDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="page-wrapper"
    >
      <div className="dashboard-header">
        <h1 className="dashboard-title">Teacher Dashboard</h1>
        <p className="text-slate-400 mt-2">Monitor your students' progress and evaluation results</p>
      </div>

      <div className="teacher-dashboard-grid">
        <motion.div
          className="stat-card-enhanced"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">👥</div>
            <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center">
              <span className="text-indigo-400 text-lg font-bold">{data?.totalStudents ?? 0}</span>
            </div>
          </div>
          <p className="text-3xl font-bold gradient-text">{data?.totalStudents ?? 0}</p>
          <p className="text-sm text-slate-400 mt-2">Total Students</p>
        </motion.div>

        <motion.div
          className="stat-card-enhanced"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">📊</div>
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <span className="text-green-400 text-lg font-bold">{data?.evaluationsDone ?? 0}</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-green-400">{data?.evaluationsDone ?? 0}</p>
          <p className="text-sm text-slate-400 mt-2">Evaluations Done</p>
        </motion.div>

        <motion.div
          className="stat-card-enhanced"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">⭐</div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <span className="text-yellow-400 text-lg font-bold">{data?.averageMarks ?? 0}</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-yellow-400">{data?.averageMarks ?? 0}</p>
          <p className="text-sm text-slate-400 mt-2">Average Marks</p>
        </motion.div>
      </div>

      <div className="section-card">
        <h2 className="section-title-enhanced">Recent Evaluations</h2>
        {recentEvaluations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 opacity-50">📝</div>
            <p className="text-slate-400 text-lg">No recent evaluations found.</p>
            <p className="text-slate-500 text-sm mt-2">Start evaluating your students to see their progress here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-700/50">
            <table className="evaluations-table">
              <thead>
                <tr>
                  <th className="rounded-tl-lg">Student Name</th>
                  <th>Subject</th>
                  <th>Marks</th>
                  <th className="rounded-tr-lg">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentEvaluations.map((ev, index) => (
                  <motion.tr 
                    key={ev.id} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="hover-lift cursor-pointer"
                  >
                    <td className="font-medium text-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center">
                          <span className="text-indigo-400 text-xs font-bold">{ev.studentName?.charAt(0)?.toUpperCase() || 'S'}</span>
                        </div>
                        {ev.studentName}
                      </div>
                    </td>
                    <td className="text-slate-300">
                      <span className="px-2 py-1 bg-slate-700/50 rounded text-xs">
                        {ev.subject}
                      </span>
                    </td>
                    <td>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                        ev.marks >= 80 ? 'bg-green-500/20 text-green-400' :
                        ev.marks >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {ev.marks}
                        <span className="text-xs opacity-75">/100</span>
                      </span>
                    </td>
                    <td className="text-slate-400">{formatDate(ev.date)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TeacherDashboard;
