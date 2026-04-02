import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as evaluationService from '../../services/evaluationService';
import Loader from '../../components/ui/Loader';
import QuestionCard from '../../components/evaluation/QuestionCard';

const TeacherResultDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    evaluationService.getResultById(id, controller.signal)
      .then(setData)
      .catch((err) => {
        if (err.name !== 'AbortError' && err.name !== 'CanceledError') {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-red-400 text-sm">{error}</p>
    </div>
  );

  const questionWiseData = data?.questionWiseData ?? [];
  const overallMistakes = data?.overallMistakes ?? [];
  const overallSuggestions = data?.overallSuggestions ?? [];

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return 'text-green-400';
    if (percentage >= 80) return 'text-blue-400';
    if (percentage >= 70) return 'text-yellow-400';
    if (percentage >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const getGradeLabel = (percentage) => {
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 80) return 'Good';
    if (percentage >= 70) return 'Average';
    if (percentage >= 60) return 'Below Average';
    return 'Needs Improvement';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 space-y-6 max-w-6xl mx-auto"
    >
      {/* Header Section */}
      <div className="glass rounded-xl p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => navigate(-1)}
                className="p-2 glass rounded-lg hover:bg-slate-700/50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-slate-100">Student Evaluation Report</h1>
            </div>
            <div className="space-y-1">
              <p className="text-lg text-slate-200">{data?.studentName}</p>
              <p className="text-sm text-slate-400">
                {data?.studentRollNo && `Roll No: ${data?.studentRollNo} • `}
                {data?.subject}
              </p>
              <p className="text-sm text-slate-400">
                Evaluated on {new Date(data?.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold ${getGradeColor(data?.percentage)}`}>
              {data?.percentage}%
            </div>
            <div className="text-sm text-slate-400">{getGradeLabel(data?.percentage)}</div>
          </div>
        </div>

        {/* Score Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="glass rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-indigo-400">{data?.obtainedMarks}</div>
            <div className="text-xs text-slate-400">Marks Obtained</div>
          </div>
          <div className="glass rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-slate-300">{data?.totalMarks}</div>
            <div className="text-xs text-slate-400">Total Marks</div>
          </div>
          <div className="glass rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{questionWiseData.length}</div>
            <div className="text-xs text-slate-400">Questions</div>
          </div>
          <div className="glass rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{Math.round(data?.confidence * 100)}%</div>
            <div className="text-xs text-slate-400">Confidence</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">Overall Performance</h3>
        <div className="relative">
          <div className="w-full bg-slate-700 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${data?.percentage}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-400">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Question-wise Analysis */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">Question-wise Analysis</h3>
        <div className="space-y-4">
          {questionWiseData.map((question, index) => (
            <motion.div
              key={question.questionNumber}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-slate-700 rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium text-slate-200">Question {question.questionNumber}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm text-slate-400">
                      Score: {question.marks}/{question.totalMarks}
                    </span>
                    <span className="text-sm text-slate-400">
                      Accuracy: {Math.round((question.correctPoints / (question.correctPoints + question.missingPoints)) * 100)}%
                    </span>
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

              {/* Progress bar for individual question */}
              <div className="mb-3">
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      question.marks >= question.totalMarks * 0.8
                        ? 'bg-green-500'
                        : question.marks >= question.totalMarks * 0.5
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${(question.marks / question.totalMarks) * 100}%` }}
                  />
                </div>
              </div>

              {/* Mistakes */}
              {question.mistakes && question.mistakes.length > 0 && (
                <div className="mb-3">
                  <h5 className="text-sm font-medium text-red-400 mb-2">Areas for Improvement:</h5>
                  <ul className="space-y-1">
                    {question.mistakes.map((mistake, idx) => (
                      <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                        {mistake}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggestions */}
              {question.suggestions && question.suggestions.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-green-400 mb-2">Suggestions:</h5>
                  <ul className="space-y-1">
                    {question.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Overall Feedback */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Overall Mistakes */}
        {overallMistakes.length > 0 && (
          <div className="glass rounded-xl p-6">
            <h3 className="text-lg font-semibold text-red-400 mb-4">Common Mistakes</h3>
            <ul className="space-y-2">
              {overallMistakes.map((mistake, index) => (
                <li key={index} className="text-sm text-slate-300 flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                  {mistake}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Overall Suggestions */}
        {overallSuggestions.length > 0 && (
          <div className="glass rounded-xl p-6">
            <h3 className="text-lg font-semibold text-green-400 mb-4">Recommendations</h3>
            <ul className="space-y-2">
              {overallSuggestions.map((suggestion, index) => (
                <li key={index} className="text-sm text-slate-300 flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => navigate('/teacher/results')}
          className="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white rounded-xl font-medium transition-all"
        >
          Back to Results
        </button>
        <button
          onClick={() => window.print()}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all"
        >
          Download Report
        </button>
      </div>
    </motion.div>
  );
};

export default TeacherResultDetailPage;
