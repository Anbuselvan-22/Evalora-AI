import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from 'recharts';
import * as studentService from '../../services/studentService';
import Loader from '../../components/ui/Loader';
import ChartCard from '../../components/ui/ChartCard';

const PerformanceAnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    studentService.getAnalytics(controller.signal)
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

  const weakAreas = data?.weakAreas ?? [];
  const strongAreas = data?.strongAreas ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 space-y-8"
    >
      <h1 className="text-2xl font-bold text-slate-100">Performance Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weak Areas */}
        <div className="glass rounded-xl p-5">
          <h2 className="text-lg font-semibold text-red-400 mb-4">Weak Areas</h2>
          {weakAreas.length === 0 ? (
            <p className="text-slate-400 text-sm">No weak areas identified.</p>
          ) : (
            <ul className="space-y-2">
              {weakAreas.map((area, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                  <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                  {area}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Strong Areas */}
        <div className="glass rounded-xl p-5">
          <h2 className="text-lg font-semibold text-green-400 mb-4">Strong Areas</h2>
          {strongAreas.length === 0 ? (
            <p className="text-slate-400 text-sm">No strong areas identified yet.</p>
          ) : (
            <ul className="space-y-2">
              {strongAreas.map((area, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                  <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                  {area}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <ChartCard title="Performance Trend" isEmpty={!data?.performanceTrend?.length}>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data?.performanceTrend ?? []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
            <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </motion.div>
  );
};

export default PerformanceAnalyticsPage;
