import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as studentService from '../../services/studentService';
import Loader from '../../components/ui/Loader';
import QuestionCard from '../../components/evaluation/QuestionCard';
import {
  ArrowLeft, Download, Printer, Award, Target, Brain, CheckCircle, AlertCircle,
  TrendingUp, Clock, Star, Zap, BookOpen, BarChart3, Eye, FileText, Share2,
  Trophy, Flame, Sparkles, Lightbulb
} from 'lucide-react';

const StudentResultDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for demonstration
  const mockResultData = {
    _id: id || '1',
    subject: 'Mathematics',
    totalMarks: 100,
    obtainedMarks: 85,
    percentage: 85,
    confidence: 0.85,
    createdAt: new Date('2024-01-15'),
    questionWiseData: [
      {
        questionNumber: 1,
        marks: 10,
        totalMarks: 10,
        correctPoints: 10,
        missingPoints: 0,
        mistakes: [],
        suggestions: ['Perfect solution!', 'Clear step-by-step approach']
      },
      {
        questionNumber: 2,
        marks: 15,
        totalMarks: 20,
        correctPoints: 15,
        missingPoints: 5,
        mistakes: ['Missing intermediate steps', 'Could have shown the formula derivation'],
        suggestions: ['Show all calculation steps', 'Write down the formula first', 'Explain your reasoning']
      },
      {
        questionNumber: 3,
        marks: 18,
        totalMarks: 20,
        correctPoints: 18,
        missingPoints: 2,
        mistakes: ['Minor calculation error'],
        suggestions: ['Double-check calculations', 'Review arithmetic operations']
      },
      {
        questionNumber: 4,
        marks: 22,
        totalMarks: 25,
        correctPoints: 22,
        missingPoints: 3,
        mistakes: ['Incomplete explanation'],
        suggestions: ['Provide detailed explanations', 'Show all work clearly']
      },
      {
        questionNumber: 5,
        marks: 20,
        totalMarks: 25,
        correctPoints: 20,
        missingPoints: 5,
        mistakes: ['Graph not labeled properly', 'Missing axis labels'],
        suggestions: ['Label all axes clearly', 'Add units to measurements', 'Title your graphs']
      }
    ],
    overallMistakes: [
      'Need to show more detailed work',
      'Practice time management',
      'Review basic arithmetic operations',
      'Focus on problem interpretation'
    ],
    overallSuggestions: [
      'Practice similar problems daily',
      'Join study groups for better understanding',
      'Use visual aids for complex problems',
      'Review fundamentals regularly'
    ]
  };

  useEffect(() => {
    // Immediately load mock data for demonstration
    console.log('Loading mock result detail data for ID:', id);
    setData(mockResultData);
    setLoading(false);

    // Also try to fetch real data in background
    const controller = new AbortController();
    console.log('Fetching result details for ID:', id);
    
    studentService.getResultById(id, controller.signal)
      .then((result) => {
        console.log('Result detail data received:', result);
        if (result && result._id) {
          setData(result);
        }
      })
      .catch((err) => {
        console.error('Error fetching result details:', err);
        // Mock data is already loaded, so no action needed
      });
    
    return () => controller.abort();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    </div>
  );

  const questionWiseData = data?.questionWiseData ?? [];
  const overallMistakes = data?.overallMistakes ?? [];
  const overallSuggestions = data?.overallSuggestions ?? [];

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return 'text-green-400 bg-green-500/10 border-green-500/30';
    if (percentage >= 80) return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    if (percentage >= 70) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    if (percentage >= 60) return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
    return 'text-red-400 bg-red-500/10 border-red-500/30';
  };

  const getGradeLabel = (percentage) => {
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 80) return 'Very Good';
    if (percentage >= 70) return 'Good';
    if (percentage >= 60) return 'Average';
    return 'Needs Improvement';
  };

  const getQuestionGradeColor = (marks, totalMarks) => {
    const percentage = (marks / totalMarks) * 100;
    if (percentage >= 90) return 'from-green-500 to-emerald-500';
    if (percentage >= 80) return 'from-blue-500 to-indigo-500';
    if (percentage >= 70) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-dark rounded-2xl p-6 border border-indigo-500/20 backdrop-blur-xl"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
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
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(-1)}
                  className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="relative"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <motion.div
                    className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Evaluation Results
                  </h1>
                  <p className="text-slate-400 text-sm">{data?.subject}</p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-slate-400">Evaluated on</p>
                  <p className="text-sm text-slate-300">
                    {new Date(data?.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <button className="p-2 text-slate-400 hover:text-white transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-white transition-colors">
                  <Printer className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-white transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Score Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-dark rounded-2xl p-8 border border-indigo-500/20"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Performance Summary</h2>
                  <p className="text-slate-400">Detailed analysis of your evaluation</p>
                </div>
                <div className="text-center">
                  <motion.div
                    key={data?.percentage}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className={`text-6xl font-bold ${getGradeColor(data?.percentage).split(' ')[0]}`}
                  >
                    {data?.percentage}%
                  </motion.div>
                  <div className={`px-4 py-2 rounded-full border text-sm font-medium ${getGradeColor(data?.percentage)}`}>
                    {getGradeLabel(data?.percentage)}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${data?.percentage}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full bg-gradient-to-r ${
                      data?.percentage >= 90 ? 'from-green-500 to-emerald-500' :
                      data?.percentage >= 80 ? 'from-blue-500 to-indigo-500' :
                      data?.percentage >= 70 ? 'from-yellow-500 to-orange-500' :
                      'from-red-500 to-pink-500'
                    }`}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-slate-500">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                  title="Marks Obtained"
                  value={data?.obtainedMarks}
                  icon={Target}
                  color="from-blue-500 to-cyan-500"
                  subtitle={`out of ${data?.totalMarks}`}
                />
                <StatCard
                  title="Total Questions"
                  value={questionWiseData.length}
                  icon={BookOpen}
                  color="from-green-500 to-emerald-500"
                  subtitle="Attempted"
                />
                <StatCard
                  title="Confidence"
                  value={`${Math.round((data?.confidence || 0.85) * 100)}%`}
                  icon={Brain}
                  color="from-purple-500 to-pink-500"
                  subtitle="AI Assessment"
                />
                <StatCard
                  title="Time Taken"
                  value="45m"
                  icon={Clock}
                  color="from-yellow-500 to-orange-500"
                  subtitle="Duration"
                />
              </div>
            </motion.div>

            {/* Question-wise Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-dark rounded-2xl p-6 border border-indigo-500/20"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-400" />
                  Question-wise Analysis
                </h3>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span>{questionWiseData.length} questions</span>
                  <span>•</span>
                  <span>Avg: {Math.round(questionWiseData.reduce((sum, q) => sum + (q.marks / q.totalMarks) * 100, 0) / questionWiseData.length)}%</span>
                </div>
              </div>

              <div className="space-y-4">
                {questionWiseData.map((question, index) => (
                  <motion.div
                    key={question.questionNumber}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-dark rounded-xl p-6 border border-indigo-500/20 hover:border-indigo-500/40 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getQuestionGradeColor(question.marks, question.totalMarks)} flex items-center justify-center`}>
                          <span className="text-white font-bold">Q{question.questionNumber}</span>
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">Question {question.questionNumber}</h4>
                          <div className="flex items-center gap-4 mt-1 text-sm">
                            <span className="text-slate-400">
                              Score: <span className="text-white font-medium">{question.marks}/{question.totalMarks}</span>
                            </span>
                            <span className="text-slate-400">
                              Accuracy: <span className="text-white font-medium">
                                {Math.round((question.correctPoints / (question.correctPoints + question.missingPoints)) * 100)}%
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        question.marks >= question.totalMarks * 0.8
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : question.marks >= question.totalMarks * 0.5
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {question.marks >= question.totalMarks * 0.8 ? 'Excellent' : 
                         question.marks >= question.totalMarks * 0.5 ? 'Good' : 'Needs Work'}
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-4">
                      <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(question.marks / question.totalMarks) * 100}%` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                          className={`h-full bg-gradient-to-r ${getQuestionGradeColor(question.marks, question.totalMarks)}`}
                        />
                      </div>
                    </div>

                    {/* Mistakes */}
                    {question.mistakes && question.mistakes.length > 0 && (
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-red-400 mb-2 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Areas for Improvement
                        </h5>
                        <div className="space-y-2">
                          {question.mistakes.map((mistake, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.6 + index * 0.1 + idx * 0.05 }}
                              className="flex items-start gap-2 p-2 bg-red-500/10 rounded-lg border border-red-500/20"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                              <span className="text-sm text-red-300">{mistake}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Suggestions */}
                    {question.suggestions && question.suggestions.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-green-400 mb-2 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4" />
                          Suggestions for Improvement
                        </h5>
                        <div className="space-y-2">
                          {question.suggestions.map((suggestion, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.7 + index * 0.1 + idx * 0.05 }}
                              className="flex items-start gap-2 p-2 bg-green-500/10 rounded-lg border border-green-500/20"
                            >
                              <CheckCircle className="w-3.5 h-3.5 text-green-400 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-green-300">{suggestion}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Overall Feedback */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Overall Mistakes */}
              {overallMistakes.length > 0 && (
                <div className="glass-dark rounded-2xl p-6 border border-indigo-500/20">
                  <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Common Mistakes
                  </h3>
                  <div className="space-y-2">
                    {overallMistakes.map((mistake, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-start gap-2 p-3 bg-red-500/10 rounded-lg border border-red-500/20"
                      >
                        <span className="w-2 h-2 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                        <span className="text-sm text-red-300">{mistake}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Overall Suggestions */}
              {overallSuggestions.length > 0 && (
                <div className="glass-dark rounded-2xl p-6 border border-indigo-500/20">
                  <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Recommendations
                  </h3>
                  <div className="space-y-2">
                    {overallSuggestions.map((suggestion, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-start gap-2 p-3 bg-green-500/10 rounded-lg border border-green-500/20"
                      >
                        <Star className="w-3.5 h-3.5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-green-300">{suggestion}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Performance Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-dark rounded-2xl p-6 border border-indigo-500/20"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Performance Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-green-400" />
                    </div>
                    <span className="text-white font-medium">Strengths</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {questionWiseData.filter(q => q.marks >= q.totalMarks * 0.8).length} questions answered excellently
                  </p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                      <Target className="w-4 h-4 text-yellow-400" />
                    </div>
                    <span className="text-white font-medium">Focus Areas</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {questionWiseData.filter(q => q.marks < q.totalMarks * 0.7).length} questions need improvement
                  </p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-white font-medium">Next Steps</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Practice similar problems and review fundamentals
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/student/results')}
                className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-all flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Results
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.print()}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-medium transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Report
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentResultDetailPage;
