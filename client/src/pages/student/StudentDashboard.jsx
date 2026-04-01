import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Legend, Cell, ResponsiveContainer,
} from 'recharts';
import * as studentService from '../../services/studentService';
import Loader from '../../components/ui/Loader';
import StatCard from '../../components/ui/StatCard';
import ChartCard from '../../components/ui/ChartCard';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    studentService.getDashboard(controller.signal)
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="page-wrapper"
    >
      <div className="dashboard-header">
        <h1 className="dashboard-title">Student Dashboard</h1>
        <p className="text-slate-400 mt-2">Track your academic progress and performance</p>
      </div>

      <div className="student-dashboard-grid">
        <motion.div
          className="student-stat-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">🎯</div>
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <span className="text-green-400 text-lg font-bold">{data?.totalMarks ?? 0}</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-green-400">{data?.totalMarks ?? 0}</p>
          <p className="text-sm text-slate-400 mt-2">Total Marks</p>
        </motion.div>

        <motion.div
          className="student-stat-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">📊</div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
              <span className="text-blue-400 text-lg font-bold">{data?.averageScore ?? 0}%</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-400">{data?.averageScore ?? 0}%</p>
          <p className="text-sm text-slate-400 mt-2">Average Score</p>
        </motion.div>

        <motion.div
          className="student-stat-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">🏆</div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <span className="text-yellow-400 text-lg font-bold">{data?.rank ?? '#'}</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-yellow-400">{data?.rank ?? '#'}</p>
          <p className="text-sm text-slate-400 mt-2">Class Rank</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="chart-container"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <h3 className="chart-title">Score Progression</h3>
          {data?.scoreProgression?.length ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data?.scoreProgression ?? []}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.5} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                  axisLine={{ stroke: '#475569' }}
                />
                <YAxis 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  axisLine={{ stroke: '#475569' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
                  }}
                  labelStyle={{ color: '#e2e8f0', fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  dot={{ fill: '#6366f1', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: '#818cf8' }}
                  fill="url(#scoreGradient)"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500 gap-2">
              <div className="text-6xl mb-4 opacity-50">📈</div>
              <p className="text-lg font-medium text-slate-400">No score data available</p>
              <p className="text-sm">Start taking evaluations to see your progress</p>
            </div>
          )}
        </motion.div>

        <motion.div
          className="chart-container"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <h3 className="chart-title">Subject Distribution</h3>
          {data?.subjectDistribution?.length ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <defs>
                  {COLORS.map((color, index) => (
                    <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={color} stopOpacity={0.3}/>
                    </linearGradient>
                  ))}
                </defs>
                <Pie
                  data={data?.subjectDistribution ?? []}
                  dataKey="score"
                  nameKey="subject"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={40}
                  paddingAngle={2}
                >
                  {(data?.subjectDistribution ?? []).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={`url(#gradient-${index})`} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
                  }}
                />
                <Legend 
                  wrapperStyle={{ 
                    color: '#94a3b8', 
                    fontSize: '12px',
                    paddingTop: '20px'
                  }}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500 gap-2">
              <div className="text-6xl mb-4 opacity-50">🎨</div>
              <p className="text-lg font-medium text-slate-400">No subject data available</p>
              <p className="text-sm">Take evaluations in different subjects to see distribution</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StudentDashboard;
