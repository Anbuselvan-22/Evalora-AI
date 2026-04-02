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
      transition={{ duration: 0.3 }}
      className="p-6 space-y-8"
    >
      <h1 className="text-2xl font-bold text-slate-100">Teacher Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Students" value={data?.totalStudents ?? 0} />
        <StatCard label="Evaluations Done" value={data?.evaluationsDone ?? 0} />
        <StatCard label="Average Marks" value={data?.averageMarks ?? 0} />
      </div>

      <div className="glass rounded-xl p-5">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Recent Evaluations</h2>
        {recentEvaluations.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-6">No recent evaluations found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="pb-3 pr-4 font-medium">Student Name</th>
                  <th className="pb-3 pr-4 font-medium">Subject</th>
                  <th className="pb-3 pr-4 font-medium">Marks</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentEvaluations.map((ev) => (
                  <tr key={ev.id} className="border-b border-slate-800 hover:bg-white/5 transition-colors">
                    <td className="py-3 pr-4 text-slate-200">{ev.studentName}</td>
                    <td className="py-3 pr-4 text-slate-300">{ev.subject}</td>
                    <td className="py-3 pr-4 text-indigo-400 font-medium">{ev.marks}</td>
                    <td className="py-3 text-slate-400">{formatDate(ev.date)}</td>
                  </tr>
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
