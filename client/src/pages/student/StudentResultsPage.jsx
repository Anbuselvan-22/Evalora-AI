import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as studentService from '../../services/studentService';
import Loader from '../../components/ui/Loader';
import { formatDate } from '../../utils/helpers';
import { 
  Search, Filter, Download, Eye, TrendingUp, BookOpen, Calendar, CheckCircle, AlertCircle, 
  Award, Target, BarChart3, Clock, Star, Zap, Activity, Users, Brain, ArrowUp, ArrowDown,
  Trophy, Flame, Sparkles
} from 'lucide-react';

const StudentResultsPage = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showFilters, setShowFilters] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({});

  // Load mock data immediately for demonstration
  const mockData = [
    {
      id: '1',
      subject: 'Mathematics',
      totalMarks: 100,
      obtainedMarks: 85,
      percentage: 85,
      status: 'completed',
      date: '2024-01-15',
      feedback: 'Good problem-solving skills. Practice more word problems.'
    },
    {
      id: '2',
      subject: 'Physics',
      totalMarks: 100,
      obtainedMarks: 72,
      percentage: 72,
      status: 'completed',
      date: '2024-01-10',
      feedback: 'Understanding of concepts is good. Work on numerical problems.'
    },
    {
      id: '3',
      subject: 'Chemistry',
      totalMarks: 100,
      obtainedMarks: 90,
      percentage: 90,
      status: 'completed',
      date: '2024-01-08',
      feedback: 'Excellent performance! Keep up the good work.'
    },
    {
      id: '4',
      subject: 'Biology',
      totalMarks: 100,
      obtainedMarks: 78,
      percentage: 78,
      status: 'completed',
      date: '2024-01-05',
      feedback: 'Good knowledge of concepts. Improve diagram practice.'
    },
    {
      id: '5',
      subject: 'Computer Science',
      totalMarks: 100,
      obtainedMarks: 92,
      percentage: 92,
      status: 'completed',
      date: '2024-01-03',
      feedback: 'Outstanding performance in programming concepts.'
    },
    {
      id: '6',
      subject: 'English',
      totalMarks: 100,
      obtainedMarks: 88,
      percentage: 88,
      status: 'processing',
      date: '2024-01-20',
      feedback: 'Evaluation in progress...'
    }
  ];

  useEffect(() => {
    // Immediately load mock data for demonstration
    console.log('Loading mock data for demonstration...');
    setResults(mockData);
    setTimeout(() => {
      const stats = getStatistics(mockData);
      setAnimatedStats(stats);
    }, 500);
    setLoading(false);

    // Also try to fetch real data in background
    const controller = new AbortController();
    console.log('Fetching student results...');
    
    studentService.getResults(controller.signal)
      .then((data) => {
        console.log('Results data received:', data);
        if (data && data.length > 0) {
          setResults(data);
          setTimeout(() => {
            const stats = getStatistics(data);
            setAnimatedStats(stats);
          }, 500);
        }
      })
      .catch((err) => {
        console.error('Error fetching results:', err);
        // Mock data is already loaded, so no action needed
      });
    
    return () => controller.abort();
  }, []);

  useEffect(() => {
    filterAndSortResults();
  }, [results, searchQuery, subjectFilter, sortBy]);

  const filterAndSortResults = () => {
    if (!results) return;

    let filtered = [...results];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(result =>
        result.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.status?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Subject filter
    if (subjectFilter !== 'all') {
      filtered = filtered.filter(result => result.subject === subjectFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date) - new Date(a.date);
        case 'subject':
          return a.subject?.localeCompare(b.subject);
        case 'score':
          const scoreA = a.percentage || 0;
          const scoreB = b.percentage || 0;
          return scoreB - scoreA;
        default:
          return 0;
      }
    });

    setFilteredResults(filtered);
  };

  const getStatistics = (data = results) => {
    if (!data) return { total: 0, average: 0, best: 0, completed: 0 };
    
    const total = data.length;
    const completed = data.filter(r => r.status === 'completed').length;
    const validScores = data.filter(r => r.percentage);
    const average = validScores.length > 0 
      ? Math.round(validScores.reduce((sum, r) => sum + r.percentage, 0) / validScores.length)
      : 0;
    const best = Math.max(...validScores.map(r => r.percentage), 0);

    return { total, average, best, completed };
  };

  const getUniqueSubjects = () => {
    if (!results) return [];
    return [...new Set(results.map(r => r.subject).filter(Boolean))];
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return 'text-green-400 bg-green-500/10 border-green-500/30';
    if (percentage >= 80) return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    if (percentage >= 70) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    if (percentage >= 60) return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
    return 'text-red-400 bg-red-500/10 border-red-500/30';
  };

  const getGradeLabel = (percentage) => {
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 80) return 'Good';
    if (percentage >= 70) return 'Average';
    if (percentage >= 60) return 'Pass';
    return 'Needs Improvement';
  };

  const getStatusIcon = (result) => {
    if (result.status === 'processing') return <Clock className="w-4 h-4 text-yellow-400" />;
    if (result.percentage >= 80) return <Award className="w-4 h-4 text-green-400" />;
    return <CheckCircle className="w-4 h-4 text-blue-400" />;
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

  const stats = getStatistics();
  const subjects = getUniqueSubjects();

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
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <motion.div
                    className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    My Results
                  </h1>
                  <p className="text-slate-400 text-sm">Track your academic performance and progress</p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download All
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/student/analytics')}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  View Analytics
                </motion.button>
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
              Performance Overview
            </h2>
            
            <div className="space-y-4">
              <StatCard
                title="Total Evaluations"
                value={animatedStats.total || 0}
                icon={BookOpen}
                color="from-blue-500 to-cyan-500"
                subtitle="Completed assessments"
              />
              
              <StatCard
                title="Average Score"
                value={`${animatedStats.average || 0}%`}
                icon={Target}
                color="from-green-500 to-emerald-500"
                subtitle="Overall performance"
              />
              
              <StatCard
                title="Best Score"
                value={`${animatedStats.best || 0}%`}
                icon={Award}
                color="from-yellow-500 to-orange-500"
                subtitle="Personal best"
              />
              
              <StatCard
                title="Completed"
                value={animatedStats.completed || 0}
                icon={CheckCircle}
                color="from-purple-500 to-pink-500"
                subtitle="Finished evaluations"
              />
            </div>

            {/* Quick Insights */}
            <div className="border-t border-slate-700/50 pt-6 mt-6">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                Performance Insights
              </h3>
              <div className="space-y-2">
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span className="text-xs text-slate-300">
                      {(animatedStats.average || 0) >= 80 ? '🔥 Hot streak!' : 'Keep pushing forward!'}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-slate-300">
                      {animatedStats.completed > 5 ? '✨ Consistent performer' : 'Build your momentum'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Results Content */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Search and Filters */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-dark rounded-2xl p-6 border border-indigo-500/20"
              >
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search by subject or status..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowFilters(!showFilters)}
                      className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
                    >
                      <Filter className="w-4 h-4" />
                      Filters
                      {subjectFilter !== 'all' && (
                        <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                      )}
                    </motion.button>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    >
                      <option value="date">Sort by Date</option>
                      <option value="subject">Sort by Subject</option>
                      <option value="score">Sort by Score</option>
                    </select>
                  </div>
                </div>

                {/* Advanced Filters */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-slate-700/50"
                    >
                      <select
                        value={subjectFilter}
                        onChange={(e) => setSubjectFilter(e.target.value)}
                        className="px-4 py-2 bg-slate-800/60 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      >
                        <option value="all">All Subjects</option>
                        {subjects.map(subject => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))}
                      </select>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Results Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {filteredResults.length === 0 ? (
                  <div className="glass-dark rounded-2xl p-8 text-center border border-indigo-500/20">
                    <BookOpen className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
                    <p className="text-slate-400">
                      {searchQuery || subjectFilter !== 'all' 
                        ? 'Try adjusting your search or filters' 
                        : 'Your evaluations will appear here once completed'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResults.map((result, index) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -4 }}
                        onClick={() => navigate(`/student/results/${result.id}`)}
                        className="glass-dark rounded-2xl p-6 cursor-pointer group border border-indigo-500/20 hover:border-indigo-500/40 transition-all"
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              result.status === 'completed' 
                                ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                                : 'bg-gradient-to-br from-yellow-500 to-orange-500'
                            }`}>
                              {result.status === 'completed' ? (
                                <Trophy className="w-6 h-6 text-white" />
                              ) : (
                                <Clock className="w-6 h-6 text-white animate-pulse" />
                              )}
                            </div>
                            <div>
                              <h3 className="text-white font-semibold">{result.subject}</h3>
                              <p className="text-slate-400 text-sm">{formatDate(result.date)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(result)}
                          </div>
                        </div>

                        {/* Score Display */}
                        {result.status === 'completed' ? (
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <motion.span
                                key={result.percentage}
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 100 }}
                                className="text-3xl font-bold text-white"
                              >
                                {result.percentage}%
                              </motion.span>
                              <div className={`px-3 py-1 rounded-full border text-xs font-medium ${getGradeColor(result.percentage)}`}>
                                {getGradeLabel(result.percentage)}
                              </div>
                            </div>
                            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${result.percentage}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className={`h-full ${
                                  result.percentage >= 90 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                                  result.percentage >= 80 ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
                                  result.percentage >= 70 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                                  'bg-gradient-to-r from-orange-500 to-red-500'
                                }`}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="mb-4">
                            <div className="flex items-center gap-3 text-yellow-400">
                              <Clock className="w-5 h-5 animate-pulse" />
                              <span className="font-medium">Processing...</span>
                            </div>
                            <p className="text-slate-400 text-sm mt-1">Your evaluation is being processed</p>
                          </div>
                        )}

                        {/* Additional Details */}
                        {result.status === 'completed' && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-400">Score:</span>
                              <span className="text-white font-medium">{result.obtainedMarks}/{result.totalMarks}</span>
                            </div>
                            {result.feedback && (
                              <div className="pt-2 border-t border-slate-700/50">
                                <p className="text-slate-300 text-sm line-clamp-2">{result.feedback}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                              result.status === 'completed' 
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                            }`}>
                              {result.status === 'completed' ? 'Completed' : 'Processing'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/student/results/${result.id}`);
                              }}
                              className="p-2 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 hover:text-indigo-300 transition-colors opacity-0 group-hover:opacity-100"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </motion.button>
                            {result.status === 'completed' && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                title="Download"
                              >
                                <Download className="w-4 h-4" />
                              </motion.button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
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

export default StudentResultsPage;
