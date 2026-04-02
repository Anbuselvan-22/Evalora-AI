import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer,
} from 'recharts';
import * as studentService from '../../services/studentService';
import Loader from '../../components/ui/Loader';
import ChartCard from '../../components/ui/ChartCard';

const MemoryAgentPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    studentService.getAnalytics(controller.signal)
      .then((result) => {
        setData(result);
      })
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

  const performanceHistory = data?.performanceHistory ?? [];
  const comparisonData = data?.comparisonData ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 space-y-8"
    >
      <h1 className="text-3xl font-bold text-slate-100">Performance History</h1>

      {/* Performance History List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-100">Recent Evaluations</h2>
        {performanceHistory.length === 0 ? (
          <div className="glass rounded-xl p-6 text-center">
            <p className="text-slate-400">No evaluation history available yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {performanceHistory.map((record, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="glass rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-slate-100 font-semibold">{record.subject}</p>
                  <p className="text-slate-400 text-xs">{new Date(record.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-indigo-400">{record.score}%</p>
                  <p className="text-xs text-slate-400">{record.marks}/{record.totalMarks}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Comparison Chart */}
      <ChartCard title="Performance Comparison" isEmpty={!comparisonData?.length}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
            <Legend wrapperStyle={{ color: '#cbd5e1' }} />
            <Bar dataKey="score" fill="#6366f1" radius={[8, 8, 0, 0]} />
            {comparisonData[0]?.previousScore && (
              <Bar dataKey="previousScore" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Improvement Metrics */}
      <div className="glass rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-slate-100">Improvement Metrics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-slate-700/30 rounded-lg p-4 text-center"
          >
            <p className="text-slate-400 text-xs uppercase mb-2">Total Evaluations</p>
            <p className="text-3xl font-bold text-indigo-400">{performanceHistory.length}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-slate-700/30 rounded-lg p-4 text-center"
          >
            <p className="text-slate-400 text-xs uppercase mb-2">Highest Score</p>
            <p className="text-3xl font-bold text-green-400">
              {performanceHistory.length > 0
                ? Math.max(...performanceHistory.map((r) => r.score || 0))
                : 0}%
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-slate-700/30 rounded-lg p-4 text-center"
          >
            <p className="text-slate-400 text-xs uppercase mb-2">Average Score</p>
            <p className="text-3xl font-bold text-purple-400">
              {performanceHistory.length > 0
                ? Math.round(performanceHistory.reduce((sum, r) => sum + (r.score || 0), 0) / performanceHistory.length)
                : 0}%
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default MemoryAgentPage;
