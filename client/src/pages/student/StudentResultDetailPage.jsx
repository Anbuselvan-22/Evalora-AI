import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as studentService from '../../services/studentService';
import Loader from '../../components/ui/Loader';
import QuestionCard from '../../components/evaluation/QuestionCard';

const StudentResultDetailPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    studentService.getResultById(id, controller.signal)
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

  const getScoreClass = (marks, totalMarks) => {
    const percentage = (marks / totalMarks) * 100;
    if (percentage >= 80) return 'score-excellent';
    if (percentage >= 60) return 'score-good';
    if (percentage >= 40) return 'score-average';
    return 'score-poor';
  };

  const getScoreLabel = (marks, totalMarks) => {
    const percentage = (marks / totalMarks) * 100;
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 60) return 'Good';
    if (percentage >= 40) return 'Average';
    return 'Needs Improvement';
  };

  const totalMarks = questions?.reduce((sum, q) => sum + (q.marks || 0), 0) || 0;
  const totalCorrectPoints = questions?.reduce((sum, q) => sum + (q.correctPoints || 0), 0) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="page-wrapper"
    >
      {/* Header Section */}
      <motion.div 
        className="glass-card p-8 mb-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="dashboard-title mb-2">{data?.studentName || 'Student'}</h1>
            <p className="text-xl text-slate-300">{data?.subject || 'Subject'}</p>
            <p className="text-slate-400 mt-2">Evaluation completed on {formatDate(data?.date)}</p>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="text-center md:text-right">
              <div className="flex items-baseline gap-2 justify-center md:justify-end">
                <span className="text-4xl font-bold text-slate-100">{totalCorrectPoints}</span>
                <span className="text-xl text-slate-400">/ {totalMarks}</span>
              </div>
              <span className={`score-badge ${getScoreClass(totalCorrectPoints, totalMarks)} mt-3`}>
                {getScoreLabel(totalCorrectPoints, totalMarks)} ({Math.round((totalCorrectPoints / totalMarks) * 100) || 0}%)
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Questions Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <h2 className="section-title-enhanced">Question Analysis</h2>
          <span className="subject-badge subject-badge-math">
            {questions.length} {questions.length === 1 ? 'Question' : 'Questions'}
          </span>
        </div>
        
        {questions.length === 0 ? (
          <motion.div 
            className="glass-card p-16 flex flex-col items-center justify-center text-slate-500 gap-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-6xl mb-4 opacity-50">📝</div>
            <p className="text-xl font-medium text-slate-300">No questions available</p>
            <p className="text-slate-400">The evaluation details are not available at the moment.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {questions.map((q, index) => (
              <motion.div
                key={q.questionNumber}
                className="question-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="question-header">
                  <div className="question-number">
                    <span className="question-number-badge">{q.questionNumber}</span>
                    <span>Question {q.questionNumber}</span>
                  </div>
                  <span className={`score-badge ${getScoreClass(q.correctPoints || 0, q.marks || 1)}`}>
                    {q.correctPoints || 0}/{q.marks || 0} marks
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Section 
                    title="Correct Points" 
                    items={q.correctPoints ? [`${q.correctPoints} points earned`] : []} 
                    colorClass="text-green-400" 
                    bulletClass="bg-green-400" 
                  />
                  <Section 
                    title="Missing Points" 
                    items={q.missingPoints ? [`${q.missingPoints} points missing`] : []} 
                    colorClass="text-yellow-400" 
                    bulletClass="bg-yellow-400" 
                  />
                </div>

                {q.mistakes && q.mistakes.length > 0 && (
                  <Section 
                    title="Mistakes" 
                    items={q.mistakes} 
                    colorClass="text-red-400" 
                    bulletClass="bg-red-400" 
                  />
                )}

                {q.suggestions && q.suggestions.length > 0 && (
                  <Section 
                    title="Suggestions for Improvement" 
                    items={q.suggestions} 
                    colorClass="text-blue-400" 
                    bulletClass="bg-blue-400" 
                  />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StudentResultDetailPage;
