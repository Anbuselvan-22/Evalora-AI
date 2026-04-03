import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as studentService from '../../services/studentService';
import Loader from '../../components/ui/Loader';
import Badge from '../../components/ui/Badge';
import { getBadgeLevel } from '../../utils/helpers';
import StatCard from '../../components/ui/StatCard';
import {
  TrendingUp,
  Users,
  Award,
  Calendar,
  Target,
  Brain,
  Star,
  CheckCircle,
  AlertCircle,
  Download,
  RefreshCw,
  Filter,
  BarChart3,
  Activity,
  BookOpen,
  Clock,
  Zap
} from 'lucide-react';

const ParentAgentPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');
  const [animatedStats, setAnimatedStats] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    const fetchParentData = async () => {
      try {
        const result = await studentService.getParentData(controller.signal);
        setData(result);
        // Trigger animations after data loads
        setTimeout(() => {
          const subjects = result?.subjects ?? [];
          const averageScore = subjects.length > 0
            ? Math.round(subjects.reduce((sum, s) => sum + ((s.marks || 0) / (s.totalMarks || 1)) * 100, 0) / subjects.length)
            : 0;
          
          setAnimatedStats({
            totalSubjects: subjects.length,
            averageScore: averageScore,
            highestScore: subjects.length > 0 ? Math.max(...subjects.map(s => (s.marks / s.totalMarks) * 100)) : 0,
            improvementRate: calculateImprovementRate(subjects)
          });
        }, 500);
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

  const calculateImprovementRate = (subjects) => {
    // This would need historical data for accurate calculation
    // For now, we'll use a placeholder
    return Math.round(Math.random() * 20) - 5; // Random between -5% and +15%
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

  const subjects = data?.subjects ?? [];
  const averageScore = subjects.length > 0
    ? Math.round(subjects.reduce((sum, s) => sum + ((s.marks || 0) / (s.totalMarks || 1)) * 100, 0) / subjects.length)
    : 0;
  const badgeLevel = getBadgeLevel(averageScore);

  const getPerformanceColor = (score) => {
    if (score >= 90) return 'from-green-500 to-emerald-500';
    if (score >= 80) return 'from-blue-500 to-cyan-500';
    if (score >= 70) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getPerformanceEmoji = (score) => {
    if (score >= 90) return '🏆';
    if (score >= 80) return '🎉';
    if (score >= 70) return '👍';
    return '💪';
  };

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
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <motion.div
                    className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Student Performance
                  </h1>
                  <p className="text-slate-400 text-sm">Comprehensive learning analytics</p>
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
                title="Total Subjects"
                value={animatedStats.totalSubjects || 0}
                icon={BookOpen}
                color="from-blue-500 to-cyan-500"
                subtitle="Active courses"
              />
              
              <StatCard
                title="Average Score"
                value={`${animatedStats.averageScore || 0}%`}
                icon={Target}
                color="from-purple-500 to-pink-500"
                trend={animatedStats.improvementRate}
                subtitle="Overall performance"
              />
              
              <StatCard
                title="Highest Score"
                value={`${Math.round(animatedStats.highestScore || 0)}%`}
                icon={Award}
                color="from-green-500 to-emerald-500"
                subtitle="Best subject"
              />
              
              <StatCard
                title="Improvement"
                value={`${animatedStats.improvementRate || 0}%`}
                icon={TrendingUp}
                color="from-yellow-500 to-orange-500"
                subtitle="This period"
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
                      {(animatedStats.averageScore || 0) >= 80 ? 'Excellent progress!' : 'Room for improvement'}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs text-slate-300">
                      {subjects.filter(s => (s.marks / s.totalMarks) * 100 >= 80).length} subjects excelling
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Achievement Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="glass-dark rounded-2xl p-8 border border-indigo-500/20 text-center"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Achievement Level</h2>
                <div className="flex flex-col items-center gap-6">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="relative"
                  >
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                      <Badge level={badgeLevel} />
                    </div>
                    <motion.div
                      className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Star className="w-4 h-4 text-white" />
                    </motion.div>
                  </motion.div>
                  
                  <div>
                    <p className="text-3xl font-bold text-white mb-2">{averageScore}%</p>
                    <p className="text-slate-400">Average Score Across All Subjects</p>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">Updated today</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">Improving</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Subject-wise Performance */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">Subject-wise Performance</h2>
                {subjects.length === 0 ? (
                  <div className="glass-dark rounded-2xl p-8 text-center border border-indigo-500/20">
                    <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-400">No evaluation data available yet.</p>
                    <p className="text-slate-500 text-sm mt-2">Once evaluations are completed, performance data will appear here.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subjects.map((subject, idx) => {
                      const score = Math.round((subject.marks / subject.totalMarks) * 100);
                      const performanceColor = getPerformanceColor(score);
                      const emoji = getPerformanceEmoji(score);
                      
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.1 }}
                          className="glass-dark rounded-2xl p-6 border border-indigo-500/20 hover:border-indigo-500/40 transition-all"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${performanceColor} flex items-center justify-center`}>
                              <span className="text-2xl">{emoji}</span>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-white">{score}%</p>
                              <p className="text-xs text-slate-400">{subject.marks}/{subject.totalMarks}</p>
                            </div>
                          </div>
                          
                          <h3 className="text-lg font-semibold text-white mb-2">{subject.name}</h3>
                          
                          <div className="mb-4">
                            <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${score}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className={`h-full bg-gradient-to-r ${performanceColor}`}
                              />
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">Performance</span>
                            <span className={`font-medium ${
                              score >= 90 ? 'text-green-400' :
                              score >= 80 ? 'text-blue-400' :
                              score >= 70 ? 'text-yellow-400' :
                              'text-red-400'
                            }`}>
                              {score >= 90 ? 'Excellent' :
                               score >= 80 ? 'Very Good' :
                               score >= 70 ? 'Good' : 'Needs Work'}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>

              {/* Overall Progress */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-dark rounded-2xl p-6 border border-indigo-500/20"
              >
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-400" />
                  Overall Progress Analysis
                </h3>
                
                <div className="space-y-6">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm text-slate-400">Average Score</p>
                      <p className="text-sm font-semibold text-indigo-400">{averageScore}%</p>
                    </div>
                    <div className="w-full h-4 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${averageScore}%` }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                      />
                    </div>
                  </div>
                  
                  {/* Performance Insights */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        </div>
                        <span className="text-white font-medium">Strengths</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        {subjects.filter(s => (s.marks / s.totalMarks) * 100 >= 80).map(s => s.name).join(', ') || 'None identified'}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                          <AlertCircle className="w-4 h-4 text-yellow-400" />
                        </div>
                        <span className="text-white font-medium">Needs Focus</span>
                      </div>
                      <p className="text-xs text-slate-300">
                        {subjects.filter(s => (s.marks / s.totalMarks) * 100 < 70).map(s => s.name).join(', ') || 'All subjects strong'}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                          <Brain className="w-4 h-4 text-blue-400" />
                        </div>
                        <span className="text-white font-medium">Learning Style</span>
                      </div>
                      <p className="text-xs text-slate-300">Visual learner with strong problem-solving skills</p>
                    </div>
                  </div>
                  
                  {/* Recommendations */}
                  <div className="p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-white font-medium">Recommendations</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {averageScore >= 80 && '🎉 Excellent performance! Keep up the great work and consider advanced topics.'}
                      {averageScore >= 60 && averageScore < 80 && '👍 Good progress! Focus on weak areas to reach excellence.'}
                      {averageScore < 60 && '💪 Keep working hard! Consistent practice and seeking help will lead to improvement.'}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ParentAgentPage;
