import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer,
  LineChart, Line, Area, AreaChart, PieChart, Pie, Cell
} from 'recharts';
import * as studentService from '../../services/studentService';
import Loader from '../../components/ui/Loader';
import {
  TrendingUp,
  Calendar,
  Award,
  Target,
  Brain,
  Clock,
  Star,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  Filter,
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Zap
} from 'lucide-react';

const MemoryAgentPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');
  const [chartType, setChartType] = useState('bar');
  const [animatedStats, setAnimatedStats] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    studentService.getAnalytics(controller.signal)
      .then((result) => {
        setData(result);
        // Trigger animations after data loads
        setTimeout(() => {
          setAnimatedStats({
            totalEvaluations: result.performanceHistory?.length || 0,
            highestScore: Math.max(...(result.performanceHistory?.map(r => r.score || 0) || [0])),
            averageScore: result.performanceHistory?.length > 0 
              ? Math.round(result.performanceHistory.reduce((sum, r) => sum + (r.score || 0), 0) / result.performanceHistory.length)
              : 0,
            improvementRate: calculateImprovementRate(result.performanceHistory || [])
          });
        }, 500);
      })
      .catch((err) => {
        if (err.name !== 'AbortError' && err.name !== 'CanceledError') {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const calculateImprovementRate = (history) => {
    if (history.length < 2) return 0;
    const first = history[0].score || 0;
    const last = history[history.length - 1].score || 0;
    return Math.round(((last - first) / first) * 100);
  };

  if (loading) return <Loader />;
  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    </div>
  );

  const performanceHistory = data?.performanceHistory ?? [];
  const comparisonData = data?.comparisonData ?? [];

  // Process data for different chart types
  const getChartData = () => {
    switch (chartType) {
      case 'line':
        return comparisonData.map(item => ({
          ...item,
          trend: item.previousScore ? ((item.score - item.previousScore) / item.previousScore * 100).toFixed(1) : 0
        }));
      case 'area':
        return comparisonData.map(item => ({
          name: item.name,
          score: item.score,
          previous: item.previousScore || 0
        }));
      case 'pie':
        return comparisonData.map(item => ({
          name: item.name,
          value: item.score
        }));
      default:
        return comparisonData;
    }
  };

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

  const StatCard = ({ title, value, icon: Icon, color, trend, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-dark rounded-2xl p-6 border border-indigo-500/20 backdrop-blur-xl"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            <TrendingUp className={`w-4 h-4 ${trend < 0 ? 'rotate-180' : ''}`} />
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-slate-400 text-sm mb-1">{title}</h3>
        <motion.div
          key={value}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="text-3xl font-bold text-white"
        >
          {value}
        </motion.div>
        {subtitle && <p className="text-slate-500 text-xs mt-1">{subtitle}</p>}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 flex flex-col">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl"
          animate={{
            x: [0, 100, 0, -100, 0],
            y: [0, -100, 100, 0, -100],
            scale: [1, 1.2, 1, 0.8, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-purple-600/20 blur-3xl"
          animate={{
            x: [0, -100, 0, 100, 0],
            y: [0, 100, -100, 0, 100],
            scale: [1, 0.8, 1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-dark border-b border-indigo-500/20 backdrop-blur-xl flex-shrink-0"
        >
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="relative"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <motion.div
                    className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Performance Analytics
                  </h1>
                  <p className="text-slate-400 text-sm">Track your learning progress</p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select
                    value={selectedTimeRange}
                    onChange={(e) => setSelectedTimeRange(e.target.value)}
                    className="bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-1 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    <option value="all">All Time</option>
                    <option value="month">This Month</option>
                    <option value="week">This Week</option>
                  </select>
                </div>
                <button className="p-2 text-slate-400 hover:text-white transition-colors">
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-white transition-colors">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Stats */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-80 glass-dark border-r border-indigo-500/20 backdrop-blur-xl p-6 flex-shrink-0"
          >
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" />
              Performance Metrics
            </h2>
            
            <div className="space-y-4">
              <StatCard
                title="Total Evaluations"
                value={animatedStats.totalEvaluations || 0}
                icon={Calendar}
                color="from-blue-500 to-cyan-500"
                subtitle="Completed assessments"
              />
              
              <StatCard
                title="Highest Score"
                value={`${animatedStats.highestScore || 0}%`}
                icon={Award}
                color="from-green-500 to-emerald-500"
                trend={animatedStats.improvementRate}
                subtitle="Personal best"
              />
              
              <StatCard
                title="Average Score"
                value={`${animatedStats.averageScore || 0}%`}
                icon={Target}
                color="from-purple-500 to-pink-500"
                subtitle="Overall performance"
              />
              
              <StatCard
                title="Improvement Rate"
                value={`${animatedStats.improvementRate || 0}%`}
                icon={TrendingUp}
                color="from-yellow-500 to-orange-500"
                subtitle="Since first evaluation"
              />
            </div>

            {/* Quick Insights */}
            <div className="border-t border-slate-700/50 pt-6 mt-6">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                Quick Insights
              </h3>
              <div className="space-y-2">
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-slate-300">
                      {(animatedStats.averageScore || 0) >= 80 ? 'Excellent performance!' : 'Keep improving!'}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs text-slate-300">
                      {(animatedStats.improvementRate || 0) > 0 ? 'Positive trend detected' : 'Steady progress'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Chart Controls */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
              >
                <h2 className="text-2xl font-bold text-white">Performance Overview</h2>
                <div className="flex items-center gap-2 bg-slate-800/60 rounded-lg p-1">
                  {[
                    { type: 'bar', icon: BarChart3 },
                    { type: 'line', icon: Activity },
                    { type: 'area', icon: BarChart },
                    { type: 'pie', icon: PieChartIcon }
                  ].map(({ type, icon: Icon }) => (
                    <button
                      key={type}
                      onClick={() => setChartType(type)}
                      className={`p-2 rounded-md transition-all ${
                        chartType === type
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Performance History List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-lg font-semibold text-white mb-4">Recent Evaluations</h3>
                {performanceHistory.length === 0 ? (
                  <div className="glass-dark rounded-2xl p-8 text-center border border-indigo-500/20">
                    <Calendar className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-400">No evaluation history available yet.</p>
                    <p className="text-slate-500 text-sm mt-2">Complete some evaluations to see your performance trends.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {performanceHistory.map((record, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="glass-dark rounded-xl p-4 border border-indigo-500/20 hover:border-indigo-500/40 transition-all"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-white font-semibold">{record.subject}</h4>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            record.score >= 80 ? 'bg-green-500/20 text-green-400' :
                            record.score >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {record.score >= 80 ? '🎉' : record.score >= 60 ? '👍' : '💪'}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-2xl font-bold text-white">{record.score}%</p>
                            <p className="text-xs text-slate-400">{record.marks}/{record.totalMarks}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-500">
                              {new Date(record.date).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-slate-400">
                              {new Date(record.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${record.score}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className={`h-full ${
                                record.score >= 80 ? 'bg-green-500' :
                                record.score >= 60 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Comparison Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-dark rounded-2xl p-6 border border-indigo-500/20"
              >
                <h3 className="text-lg font-semibold text-white mb-6">Performance Comparison</h3>
                {comparisonData?.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    {chartType === 'bar' && (
                      <BarChart data={getChartData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                          labelStyle={{ color: '#cbd5e1' }}
                        />
                        <Legend wrapperStyle={{ color: '#cbd5e1' }} />
                        <Bar dataKey="score" fill="#6366f1" radius={[8, 8, 0, 0]} />
                        {comparisonData[0]?.previousScore && (
                          <Bar dataKey="previousScore" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                        )}
                      </BarChart>
                    )}
                    {chartType === 'line' && (
                      <LineChart data={getChartData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                          labelStyle={{ color: '#cbd5e1' }}
                        />
                        <Legend wrapperStyle={{ color: '#cbd5e1' }} />
                        <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', r: 6 }} />
                        {comparisonData[0]?.previousScore && (
                          <Line type="monotone" dataKey="previousScore" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 6 }} />
                        )}
                      </LineChart>
                    )}
                    {chartType === 'area' && (
                      <AreaChart data={getChartData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                          labelStyle={{ color: '#cbd5e1' }}
                        />
                        <Legend wrapperStyle={{ color: '#cbd5e1' }} />
                        <Area type="monotone" dataKey="score" stackId="1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="previous" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                      </AreaChart>
                    )}
                    {chartType === 'pie' && (
                      <PieChart>
                        <Pie
                          data={getChartData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {getChartData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                          labelStyle={{ color: '#cbd5e1' }}
                        />
                      </PieChart>
                    )}
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                      <p className="text-slate-400">No comparison data available</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MemoryAgentPage;
