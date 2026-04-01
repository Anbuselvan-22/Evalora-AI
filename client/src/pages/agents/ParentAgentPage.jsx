import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as teacherService from '../../services/teacherService';
import Loader from '../../components/ui/Loader';
import Badge from '../../components/ui/Badge';
import { getBadgeLevel } from '../../utils/helpers';
import StatCard from '../../components/ui/StatCard';

const ParentAgentPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchParentData = async () => {
      try {
        const result = await teacherService.getDashboard(controller.signal);
        setData(result);
      } catch (err) {
        if (err.name !== 'AbortError' && err.name !== 'CanceledError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchParentData();
    return () => controller.abort();
  }, []);

  if (loading) return <Loader />;
  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-red-400 text-sm">{error}</p>
    </div>
  );

  const subjects = data?.subjects ?? [];
  const averageScore = subjects.length > 0
    ? Math.round(subjects.reduce((sum, s) => sum + (s.marks || 0), 0) / subjects.length)
    : 0;
  const badgeLevel = getBadgeLevel(averageScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 space-y-8"
    >
      <h1 className="text-3xl font-bold text-slate-100">Student Performance Summary</h1>

      {/* Badge Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="glass rounded-xl p-8 flex flex-col items-center gap-4"
      >
        <p className="text-slate-400 text-sm uppercase tracking-wide">Achievement Level</p>
        <Badge level={badgeLevel} />
        <p className="text-slate-300 text-lg font-semibold">Average Score: {averageScore}%</p>
      </motion.div>

      {/* Subject-wise Breakdown */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100 mb-4">Subject-wise Performance</h2>
        {subjects.length === 0 ? (
          <div className="glass rounded-xl p-6 text-center">
            <p className="text-slate-400">No evaluations available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <StatCard label={subject.name} value={`${subject.marks}/${subject.totalMarks}`} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Overall Progress */}
      <div className="glass rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-slate-100">Overall Progress</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm text-slate-400">Average Score</p>
              <p className="text-sm font-semibold text-indigo-400">{averageScore}%</p>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${averageScore}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
              />
            </div>
          </div>
          <p className="text-xs text-slate-500 pt-3">
            {averageScore >= 80 && '🎉 Excellent performance! Keep it up!'}
            {averageScore >= 60 && averageScore < 80 && '👍 Good progress. A little more effort can achieve excellence!'}
            {averageScore < 60 && '💪 Keep working hard. With consistent effort, improvement is guaranteed!'}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ParentAgentPage;
