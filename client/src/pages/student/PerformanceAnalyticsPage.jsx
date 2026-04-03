import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import * as studentService from '../../services/studentService';
import Loader from '../../components/ui/Loader';
import {
  TrendingUp, TrendingDown, Brain, Target, Award, Calendar, Activity, BarChart3,
  PieChart as PieChartIcon, Zap, Star, CheckCircle, AlertCircle, Filter, Download,
  RefreshCw, Eye, BookOpen, Trophy, Flame, Sparkles, ArrowUp, ArrowDown, Users
} from 'lucide-react';

const PerformanceAnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');
  const [chartType, setChartType] = useState('line');
  const [animatedStats, setAnimatedStats] = useState({});
  const [selectedMetric, setSelectedMetric] = useState('performance');

  // Load mock data immediately for demonstration
  const mockData = {
    weakAreas: ['Physics', 'Biology'],
    strongAreas: ['Mathematics', 'Computer Science'],
    performanceHistory: [
      { date: '2024-01-15', score: 85, subject: 'Mathematics', marks: 85, totalMarks: 100 },
      { date: '2024-01-10', score: 72, subject: 'Physics', marks: 72, totalMarks: 100 },
      { date: '2024-01-08', score: 90, subject: 'Chemistry', marks: 90, totalMarks: 100 },
      { date: '2024-01-05', score: 78, subject: 'Biology', marks: 78, totalMarks: 100 },
      { date: '2024-01-03', score: 92, subject: 'Computer Science', marks: 92, totalMarks: 100 }
    ],
    comparisonData: [
      { name: 'Mathematics', score: 85 },
      { name: 'Physics', score: 72 },
      { name: 'Chemistry', score: 90 },
      { name: 'Biology', score: 78 },
      { name: 'Computer Science', score: 92 }
    ]
  };

  useEffect(() => {
    // Immediately load mock data for demonstration
    console.log('Loading mock analytics data for demonstration...');
    setData(mockData);
    setTimeout(() => {
      const stats = calculateStats(mockData);
      setAnimatedStats(stats);
    }, 500);
    setLoading(false);

    // Also try to fetch real data in background
    const controller = new AbortController();
    console.log('Fetching student analytics...');
    
    studentService.getAnalytics(controller.signal)
      .then((result) => {
        console.log('Analytics data received:', result);
        if (result && (result.performanceHistory || result.comparisonData)) {
          setData(result);
          setTimeout(() => {
            const stats = calculateStats(result);
            setAnimatedStats(stats);
          }, 500);
        }
      })
      .catch((err) => {
        console.error('Error fetching analytics:', err);
        // Mock data is already loaded, so no action needed
      });
    
    return () => controller.abort();
  }, []);

  const calculateStats = (analyticsData) => {
    const performanceHistory = analyticsData?.performanceHistory ?? [];
    const comparisonData = analyticsData?.comparisonData ?? [];
    
    const totalEvaluations = performanceHistory.length;
    const averageScore = performanceHistory.length > 0 
      ? Math.round(performanceHistory.reduce((sum, item) => sum + item.score, 0) / performanceHistory.length)
      : 0;
    const highestScore = performanceHistory.length > 0 
      ? Math.max(...performanceHistory.map(item => item.score))
      : 0;
    const subjectsCovered = comparisonData.length;
    const improvementRate = calculateImprovementRate(performanceHistory);
    
    return {
      totalEvaluations,
      averageScore,
      highestScore,
      subjectsCovered,
      improvementRate
    };
  };

  const calculateImprovementRate = (history) => {
    if (history.length < 2) return 0;
    const first = history[0].score || 0;
    const last = history[history.length - 1].score || 0;
    return Math.round(((last - first) / first) * 100);
  };

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

  if (loading) return <Loader />;
  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    </div>
  );

  const weakAreas = data?.weakAreas ?? [];
  const strongAreas = data?.strongAreas ?? [];
  const performanceHistory = data?.performanceHistory ?? [];
  const comparisonData = data?.comparisonData ?? [];

  const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }) => (
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
            {trend > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
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

  const getChartData = () => {
    switch (chartType) {
      case 'bar':
        return comparisonData;
      case 'area':
        return performanceHistory.map(item => ({
          ...item,
          date: new Date(item.date).toLocaleDateString()
        }));
      case 'radar':
        return comparisonData.map(item => ({
          subject: item.name,
          score: item.score,
          fullMark: 100
        }));
      default:
        return performanceHistory.map(item => ({
          ...item,
          date: new Date(item.date).toLocaleDateString()
        }));
    }
  };

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
                  <p className="text-slate-400 text-sm">Deep insights into your learning journey</p>
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
          {/* Sidebar - Stats & Insights */}
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
                icon={BookOpen}
                color="from-blue-500 to-cyan-500"
                subtitle="Completed assessments"
              />
              
              <StatCard
                title="Average Score"
                value={`${animatedStats.averageScore || 0}%`}
                icon={Target}
                color="from-green-500 to-emerald-500"
                trend={animatedStats.improvementRate}
                subtitle="Overall performance"
              />
              
              <StatCard
                title="Highest Score"
                value={`${animatedStats.highestScore || 0}%`}
                icon={Trophy}
                color="from-yellow-500 to-orange-500"
                subtitle="Personal best"
              />
              
              <StatCard
                title="Subjects Covered"
                value={animatedStats.subjectsCovered || 0}
                icon={Users}
                color="from-purple-500 to-pink-500"
                subtitle="Different topics"
              />
            </div>

            {/* Strengths & Weaknesses */}
            <div className="border-t border-slate-700/50 pt-6 mt-6">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                Performance Analysis
              </h3>
              
              {/* Strong Areas */}
              <div className="mb-4">
                <h4 className="text-xs text-green-400 font-medium mb-2">Strong Areas</h4>
                {strongAreas.length === 0 ? (
                  <p className="text-xs text-slate-500">Keep working to identify your strengths!</p>
                ) : (
                  <div className="space-y-1">
                    {strongAreas.map((area, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-2 p-2 bg-green-500/10 rounded-lg border border-green-500/20"
                      >
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        <span className="text-xs text-green-300">{area}</span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Weak Areas */}
              <div>
                <h4 className="text-xs text-orange-400 font-medium mb-2">Areas to Improve</h4>
                {weakAreas.length === 0 ? (
                  <p className="text-xs text-slate-500">🎉 No areas need improvement!</p>
                ) : (
                  <div className="space-y-1">
                    {weakAreas.map((area, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-2 p-2 bg-orange-500/10 rounded-lg border border-orange-500/20"
                      >
                        <AlertCircle className="w-3 h-3 text-orange-400" />
                        <span className="text-xs text-orange-300">{area}</span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Insights */}
            <div className="border-t border-slate-700/50 pt-6 mt-6">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Insights
              </h3>
              <div className="space-y-2">
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span className="text-xs text-slate-300">
                      {(animatedStats.averageScore || 0) >= 80 ? '🔥 Excellent performance!' : 'Keep pushing forward!'}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs text-slate-300">
                      {(animatedStats.improvementRate || 0) > 0 ? '📈 Improving steadily' : '📊 Stay consistent'}
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
                <h2 className="text-2xl font-bold text-white">Performance Visualization</h2>
                <div className="flex items-center gap-2 bg-slate-800/60 rounded-lg p-1">
                  {[
                    { type: 'line', icon: Activity },
                    { type: 'bar', icon: BarChart3 },
                    { type: 'area', icon: TrendingUp },
                    { type: 'radar', icon: Target }
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

              {/* Performance Trend Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-dark rounded-2xl p-6 border border-indigo-500/20"
              >
                <h3 className="text-lg font-semibold text-white mb-6">Performance Trend</h3>
                {performanceHistory.length === 0 ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <Activity className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                      <p className="text-slate-400">No performance data available</p>
                    </div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    {chartType === 'line' && (
                      <LineChart data={getChartData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                        <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', r: 6 }} />
                      </LineChart>
                    )}
                    {chartType === 'bar' && (
                      <BarChart data={getChartData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                        <Bar dataKey="score" fill="#6366f1" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    )}
                    {chartType === 'area' && (
                      <AreaChart data={getChartData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                        <Area type="monotone" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                      </AreaChart>
                    )}
                    {chartType === 'radar' && (
                      <RadarChart data={getChartData()}>
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                        <Radar name="Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                      </RadarChart>
                    )}
                  </ResponsiveContainer>
                )}
              </motion.div>

              {/* Subject Comparison */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-dark rounded-2xl p-6 border border-indigo-500/20"
              >
                <h3 className="text-lg font-semibold text-white mb-6">Subject Comparison</h3>
                {comparisonData.length === 0 ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                      <p className="text-slate-400">No subject comparison data available</p>
                    </div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                      <Bar dataKey="score" fill="#10b981" radius={[8, 8, 0, 0]} />
                      {comparisonData[0]?.previousScore && (
                        <Bar dataKey="previousScore" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                      )}
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </motion.div>

              {/* Performance Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Performance Distribution */}
                <div className="glass-dark rounded-2xl p-6 border border-indigo-500/20">
                  <h3 className="text-lg font-semibold text-white mb-4">Score Distribution</h3>
                  {performanceHistory.length === 0 ? (
                    <p className="text-slate-400 text-center py-8">No data available</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Excellent (90-100%)', value: performanceHistory.filter(s => s.score >= 90).length },
                            { name: 'Good (80-89%)', value: performanceHistory.filter(s => s.score >= 80 && s.score < 90).length },
                            { name: 'Average (70-79%)', value: performanceHistory.filter(s => s.score >= 70 && s.score < 80).length },
                            { name: 'Below Average (<70%)', value: performanceHistory.filter(s => s.score < 70).length }
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label
                        >
                          {[
                            { name: 'Excellent (90-100%)', value: performanceHistory.filter(s => s.score >= 90).length },
                            { name: 'Good (80-89%)', value: performanceHistory.filter(s => s.score >= 80 && s.score < 90).length },
                            { name: 'Average (70-79%)', value: performanceHistory.filter(s => s.score >= 70 && s.score < 80).length },
                            { name: 'Below Average (<70%)', value: performanceHistory.filter(s => s.score < 70).length }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>

                {/* Recent Performance */}
                <div className="glass-dark rounded-2xl p-6 border border-indigo-500/20">
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Performance</h3>
                  {performanceHistory.length === 0 ? (
                    <p className="text-slate-400 text-center py-8">No recent evaluations</p>
                  ) : (
                    <div className="space-y-3">
                      {performanceHistory.slice(-5).reverse().map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              item.score >= 90 ? 'bg-green-500/20 text-green-400' :
                              item.score >= 80 ? 'bg-blue-500/20 text-blue-400' :
                              item.score >= 70 ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {item.score >= 90 ? '🏆' : item.score >= 80 ? '👍' : item.score >= 70 ? '📊' : '📚'}
                            </div>
                            <div>
                              <p className="text-white text-sm font-medium">{item.subject}</p>
                              <p className="text-slate-400 text-xs">{new Date(item.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-bold">{item.score}%</p>
                            <p className="text-xs text-slate-400">{item.marks}/{item.totalMarks}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalyticsPage;
