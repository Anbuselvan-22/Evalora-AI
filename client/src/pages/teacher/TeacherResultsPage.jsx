import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as evaluationService from '../../services/evaluationService';
import Loader from '../../components/ui/Loader';
import { formatDate } from '../../utils/helpers';
import { Search, Filter, Download, Eye, TrendingUp, Users, BookOpen, Calendar, CheckCircle, Clock, AlertCircle, FileText, Award, Target } from 'lucide-react';

const TeacherResultsPage = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    evaluationService.getResults(controller.signal)
      .then(setResults)
      .catch((err) => {
        if (err.name !== 'AbortError' && err.name !== 'CanceledError') {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  useEffect(() => {
    filterAndSortResults();
  }, [results, searchQuery, statusFilter, subjectFilter, sortBy]);

  const filterAndSortResults = () => {
    if (!results) return;

    let filtered = [...results];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(result =>
        result.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.studentRollNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.subject?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(result => {
        if (statusFilter === 'completed') return !result.isProcessing;
        if (statusFilter === 'processing') return result.isProcessing;
        return true;
      });
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
        case 'name':
          return a.studentName?.localeCompare(b.studentName);
        case 'subject':
          return a.subject?.localeCompare(b.subject);
        case 'score':
          const scoreA = (a.obtainedMarks / a.totalMarks) || 0;
          const scoreB = (b.obtainedMarks / b.totalMarks) || 0;
          return scoreB - scoreA;
        default:
          return 0;
      }
    });

    setFilteredResults(filtered);
  };

  const getStatistics = () => {
    if (!results) return { total: 0, completed: 0, processing: 0, averageScore: 0 };
    
    const total = results.length;
    const completed = results.filter(r => !r.isProcessing).length;
    const processing = results.filter(r => r.isProcessing).length;
    const completedResults = results.filter(r => !r.isProcessing && r.obtainedMarks && r.totalMarks);
    const averageScore = completedResults.length > 0 
      ? Math.round(completedResults.reduce((sum, r) => sum + (r.obtainedMarks / r.totalMarks) * 100, 0) / completedResults.length)
      : 0;

    return { total, completed, processing, averageScore };
  };

  const getUniqueSubjects = () => {
    if (!results) return [];
    return [...new Set(results.map(r => r.subject).filter(Boolean))];
  };

  const getStatusIcon = (result) => {
    if (result.isProcessing) return <Clock className="w-4 h-4 text-yellow-400" />;
    const percentage = (result.obtainedMarks / result.totalMarks) * 100;
    if (percentage >= 80) return <Award className="w-4 h-4 text-green-400" />;
    if (percentage >= 60) return <CheckCircle className="w-4 h-4 text-blue-400" />;
    return <AlertCircle className="w-4 h-4 text-orange-400" />;
  };

  const getStatusColor = (result) => {
    if (result.isProcessing) return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
    const percentage = (result.obtainedMarks / result.totalMarks) * 100;
    if (percentage >= 80) return 'bg-green-500/10 border-green-500/30 text-green-400';
    if (percentage >= 60) return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
    return 'bg-orange-500/10 border-orange-500/30 text-orange-400';
  };

  if (loading) return <Loader />;
  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-red-400 text-sm">{error}</p>
    </div>
  );

  const stats = getStatistics();
  const subjects = getUniqueSubjects();

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Evaluation Results</h1>
          <p className="text-slate-400">Manage and track student evaluation performance</p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Results
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/teacher/upload')}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-medium transition-all duration-300 flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            New Evaluation
          </motion.button>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          className="relative bg-gradient-to-br from-blue-600/20 via-blue-700/20 to-indigo-600/20 backdrop-blur-xl rounded-2xl border border-blue-500/30 p-6 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stats.total}</h3>
            <p className="text-blue-300 text-sm font-medium">Total Evaluations</p>
            <div className="mt-3 h-1 bg-blue-500/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          className="relative bg-gradient-to-br from-green-600/20 via-green-700/20 to-emerald-600/20 backdrop-blur-xl rounded-2xl border border-green-500/30 p-6 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl border border-green-500/30">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stats.completed}</h3>
            <p className="text-green-300 text-sm font-medium">Completed</p>
            <div className="mt-3 h-1 bg-green-500/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                transition={{ duration: 1, delay: 0.6 }}
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          className="relative bg-gradient-to-br from-yellow-600/20 via-yellow-700/20 to-orange-600/20 backdrop-blur-xl rounded-2xl border border-yellow-500/30 p-6 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-xl border border-yellow-500/30">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stats.processing}</h3>
            <p className="text-yellow-300 text-sm font-medium">Processing</p>
            <div className="mt-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-yellow-400">In progress</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          className="relative bg-gradient-to-br from-purple-600/20 via-purple-700/20 to-pink-600/20 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-6 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stats.averageScore}%</h3>
            <p className="text-purple-300 text-sm font-medium">Average Score</p>
            <div className="mt-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-xs text-green-400">Good performance</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by student name, roll number, or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
              {(statusFilter !== 'all' || subjectFilter !== 'all') && (
                <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
              )}
            </motion.button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
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
              className="mt-4 pt-4 border-t border-slate-700/50 flex flex-col md:flex-row gap-4"
            >
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
              </select>

              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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

      {/* Results Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden"
      >
        {filteredResults.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No results found</h3>
            <p className="text-slate-400">
              {searchQuery || statusFilter !== 'all' || subjectFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Start by uploading your first evaluation'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filteredResults.map((result, index) => (
                  <motion.tr
                    key={result.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-white/5 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/teacher/results/${result.id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {result.studentName?.charAt(0)?.toUpperCase() || 'S'}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{result.studentName}</p>
                          <p className="text-slate-400 text-sm">{result.studentRollNo || '-'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300">{result.subject}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {!result.isProcessing ? (
                        <div>
                          <p className="text-white font-semibold">{result.obtainedMarks}/{result.totalMarks}</p>
                          <p className="text-slate-400 text-sm">
                            {Math.round((result.obtainedMarks / result.totalMarks) * 100)}%
                          </p>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(result)}`}>
                        {getStatusIcon(result)}
                        <span>{result.isProcessing ? 'Processing' : 'Completed'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(result.date)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/teacher/results/${result.id}`);
                          }}
                          className="p-2 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 hover:text-indigo-300 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TeacherResultsPage;
