import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Legend, Cell, ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Award as AwardIcon,
  BookOpen as BookOpenIcon,
  Target as TargetIcon,
  Activity as ActivityIcon,
} from 'lucide-react';
import * as studentService from '../../services/studentService';
import Loader from '../../components/ui/Loader';
import StatCard from '../../components/ui/StatCard';
import ChartCard from '../../components/ui/ChartCard';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-dark p-3 rounded-lg border border-slate-700">
        <p className="text-slate-300 text-sm font-medium">{label}</p>
        <p className="text-indigo-400 text-lg font-bold">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-dark p-3 rounded-lg border border-slate-700">
        <p className="text-slate-300 text-sm font-medium">{payload[0].name}</p>
        <p className="text-indigo-400 text-lg font-bold">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

const StudentDashboard = () => {
  // Mock data for demonstration
  const mockDashboardData = {
    totalMarks: 415,
    averageScore: 83,
    totalEvaluations: 6,
    subjects: [
      { name: 'Mathematics', marks: 85, totalMarks: 100, percentage: 85 },
      { name: 'Physics', marks: 72, totalMarks: 100, percentage: 72 },
      { name: 'Chemistry', marks: 90, totalMarks: 100, percentage: 90 },
      { name: 'Biology', marks: 78, totalMarks: 100, percentage: 78 },
      { name: 'Computer Science', marks: 92, totalMarks: 100, percentage: 92 },
      { name: 'English', marks: 88, totalMarks: 100, percentage: 88 }
    ],
    scoreProgression: [
      { date: '2024-01-03', score: 92 },
      { date: '2024-01-05', score: 78 },
      { date: '2024-01-08', score: 90 },
      { date: '2024-01-10', score: 72 },
      { date: '2024-01-15', score: 85 }
    ],
    subjectDistribution: [
      { subject: 'Mathematics', score: 85 },
      { subject: 'Physics', score: 72 },
      { subject: 'Chemistry', score: 90 },
      { subject: 'Biology', score: 78 },
      { subject: 'Computer Science', score: 92 },
      { subject: 'English', score: 88 }
    ]
  };

  const [data, setData] = useState(mockDashboardData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Data is already set in initial state, just try to fetch real data in background
    console.log('Dashboard initialized with mock data');
    
    const controller = new AbortController();
    console.log('Fetching real student dashboard data...');
    
    studentService.getDashboard(controller.signal)
      .then((realData) => {
        console.log('Real dashboard data received:', realData);
        if (realData && (realData.subjects || realData.averageScore)) {
          setData(realData);
          console.log('Using real dashboard data');
        } else {
          console.log('Keeping mock data - real data incomplete');
        }
      })
      .catch((err) => {
        console.error('Error fetching real dashboard data:', err);
        console.log('Keeping mock data due to API error');
      });
    
    return () => controller.abort();
  }, []);

  if (loading) return <Loader />;
  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-red-400 text-sm">{error}</p>
    </div>
  );

  // Debug logging
  console.log('Dashboard data:', data);
  console.log('Subjects:', data?.subjects);
  console.log('Average score from data:', data?.averageScore);

  // Calculate correct average score from subjects data
  const subjects = data?.subjects ?? [];
  const correctAverageScore = subjects.length > 0
    ? Math.round(subjects.reduce((sum, s) => sum + ((s.marks || 0) / (s.totalMarks || 1)) * 100, 0) / subjects.length)
    : data?.averageScore ?? 0;

  console.log('Calculated average score:', correctAverageScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="min-h-screen p-6 space-y-8"
    >
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Student Dashboard</h1>
          <p className="text-slate-400">Track your academic progress and performance</p>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="glass px-4 py-2 rounded-xl"
        >
          <div className="flex items-center gap-2">
            <ActivityIcon className="w-5 h-5 text-green-400" />
            <span className="text-green-400 text-sm font-medium">Active</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Modern Stats Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* Total Marks Card */}
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          className="relative bg-gradient-to-br from-indigo-600/20 via-indigo-700/20 to-purple-600/20 backdrop-blur-xl rounded-2xl border border-indigo-500/30 p-6 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
                <AwardIcon className="w-6 h-6 text-indigo-400" />
              </div>
              <div className="flex items-center gap-1 text-green-400 text-sm">
                <TrendingUpIcon className="w-4 h-4" />
                <span>+12%</span>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{data?.totalMarks ?? 0}</h3>
            <p className="text-indigo-300 text-sm font-medium">Total Marks</p>
            <div className="mt-3 h-1 bg-indigo-500/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '75%' }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Average Score Card */}
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          className="relative bg-gradient-to-br from-green-600/20 via-green-700/20 to-emerald-600/20 backdrop-blur-xl rounded-2xl border border-green-500/30 p-6 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl border border-green-500/30">
                <TargetIcon className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex items-center gap-1 text-green-400 text-sm">
                <TrendingUpIcon className="w-4 h-4" />
                <span>+8%</span>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{correctAverageScore}%</h3>
            <p className="text-green-300 text-sm font-medium">Average Score</p>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-1 bg-green-500/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${correctAverageScore}%` }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                />
              </div>
              <span className="text-xs text-green-400 font-medium">{correctAverageScore}%</span>
            </div>
          </div>
        </motion.div>

        {/* Total Evaluations Card */}
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          className="relative bg-gradient-to-br from-purple-600/20 via-purple-700/20 to-pink-600/20 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-6 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30">
                <BookOpenIcon className="w-6 h-6 text-purple-400" />
              </div>
              <div className="px-2 py-1 bg-purple-500/20 rounded-lg border border-purple-500/30">
                <span className="text-xs text-purple-300 font-medium">New</span>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{data?.totalEvaluations ?? 0}</h3>
            <p className="text-purple-300 text-sm font-medium">Total Evaluations</p>
            <div className="mt-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-purple-400">Ready to start</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Performance Trend Card */}
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          className="relative bg-gradient-to-br from-orange-600/20 via-orange-700/20 to-amber-600/20 backdrop-blur-xl rounded-2xl border border-orange-500/30 p-6 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-500/20 rounded-xl border border-orange-500/30">
                {data?.performanceTrend === 'up' ? (
                  <TrendingUpIcon className="w-6 h-6 text-green-400" />
                ) : (
                  <TrendingDownIcon className="w-6 h-6 text-yellow-400" />
                )}
              </div>
              <div className={`px-2 py-1 rounded-lg border ${
                data?.performanceTrend === 'up' 
                  ? 'bg-green-500/20 border-green-500/30' 
                  : 'bg-yellow-500/20 border-yellow-500/30'
              }`}>
                <span className={`text-xs font-medium ${
                  data?.performanceTrend === 'up' ? 'text-green-300' : 'text-yellow-300'
                }`}>
                  {data?.performanceTrend === 'up' ? '↑' : '→'}
                </span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {data?.performanceTrend === 'up' ? 'Improving' : 'Stable'}
            </h3>
            <p className="text-orange-300 text-sm font-medium">Performance Trend</p>
            <div className="mt-3">
              <div className={`text-xs ${
                data?.performanceTrend === 'up' ? 'text-green-400' : 'text-yellow-400'
              }`}>
                {data?.performanceTrend === 'up' ? 'Great progress!' : 'Keep going!'}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Charts Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <ChartCard title="Score Progression" isEmpty={!data?.scoreProgression?.length}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data?.scoreProgression ?? []} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.3} />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#94a3b8', fontSize: 12 }} 
                stroke="#475569"
              />
              <YAxis 
                tick={{ fill: '#94a3b8', fontSize: 12 }} 
                stroke="#475569"
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#6366f1" 
                strokeWidth={3}
                dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#818cf8' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Subject Distribution" isEmpty={!data?.subjectDistribution?.length}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
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
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
              <Legend 
                wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }}
                verticalAlign="middle"
                align="right"
                layout="vertical"
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </motion.div>

      {/* Additional Charts Row */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <ChartCard title="Monthly Performance" isEmpty={!data?.monthlyPerformance?.length}>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data?.monthlyPerformance ?? []} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.3} />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#94a3b8', fontSize: 12 }} 
                stroke="#475569"
              />
              <YAxis 
                tick={{ fill: '#94a3b8', fontSize: 12 }} 
                stroke="#475569"
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="score" 
                fill="#8b5cf6"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Recent Activity" isEmpty={!data?.recentActivity?.length}>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {data?.recentActivity?.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="glass-sm p-3 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'evaluation' ? 'bg-green-400' : 
                    activity.type === 'improvement' ? 'bg-blue-400' : 'bg-yellow-400'
                  }`} />
                  <div>
                    <p className="text-slate-300 text-sm font-medium">{activity.title}</p>
                    <p className="text-slate-500 text-xs">{activity.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-indigo-400 text-sm font-bold">{activity.score}%</p>
                </div>
              </motion.div>
            )) || (
              <div className="text-center py-8 text-slate-500">
                <p className="text-sm">No recent activity</p>
              </div>
            )}
          </div>
        </ChartCard>
      </motion.div>
    </motion.div>
  );
};

export default StudentDashboard;
