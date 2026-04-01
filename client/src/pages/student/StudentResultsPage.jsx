import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as studentService from '../../services/studentService';
import Loader from '../../components/ui/Loader';
import { formatDate } from '../../utils/helpers';

const StudentResultsPage = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    studentService.getResults(controller.signal)
      .then(setResults)
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

  const getSubjectBadgeClass = (subject) => {
    const subjectLower = subject?.toLowerCase() || '';
    if (subjectLower.includes('math') || subjectLower.includes('calc')) return 'subject-badge-math';
    if (subjectLower.includes('sci') || subjectLower.includes('physics') || subjectLower.includes('chem') || subjectLower.includes('bio')) return 'subject-badge-science';
    if (subjectLower.includes('eng') || subjectLower.includes('lang')) return 'subject-badge-english';
    if (subjectLower.includes('hist') || subjectLower.includes('geo') || subjectLower.includes('civ')) return 'subject-badge-history';
    return 'subject-badge-math'; // default
  };

  const getScoreClass = (marks) => {
    if (marks >= 80) return 'score-excellent';
    if (marks >= 60) return 'score-good';
    if (marks >= 40) return 'score-average';
    return 'score-poor';
  };

  const rows = results ?? [];

  // Group results by subject
  const grouped = rows.reduce((acc, result) => {
    const key = result.subject ?? 'Other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(result);
    return acc;
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="page-wrapper"
    >
      <div className="dashboard-header">
        <h1 className="dashboard-title">My Results</h1>
        <p className="text-slate-400 mt-2">View your evaluation history and detailed performance</p>
      </div>

      {rows.length === 0 ? (
        <motion.div 
          className="glass-card p-16 flex flex-col items-center justify-center text-slate-500 gap-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-8xl mb-4 opacity-50">📚</div>
          <p className="text-2xl font-medium text-slate-300">No results yet</p>
          <p className="text-lg text-slate-400">Your evaluated results will appear here once you complete evaluations.</p>
          <p className="text-sm text-slate-500">Start by taking an evaluation to see your performance!</p>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([subject, items], subjectIndex) => (
            <motion.div 
              key={subject} 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: subjectIndex * 0.1 }}
            >
              <div className="flex items-center gap-3">
                <h2 className="section-title-enhanced">{subject}</h2>
                <span className={`subject-badge ${getSubjectBadgeClass(subject)}`}>
                  {items.length} {items.length === 1 ? 'evaluation' : 'evaluations'}
                </span>
              </div>
              <div className="results-grid">
                {items.map((result, index) => (
                  <motion.div
                    key={result.id}
                    className="result-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                    onClick={() => navigate(`/student/results/${result.id}`)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-100 mb-2">{result.subject}</h3>
                        <span className={`subject-badge ${getSubjectBadgeClass(result.subject)}`}>
                          {result.subject}
                        </span>
                      </div>
                      <div className="text-2xl opacity-70">
                        {subject.includes('Math') ? '🧮' : 
                         subject.includes('Science') ? '🔬' : 
                         subject.includes('English') ? '📖' : 
                         subject.includes('History') ? '📜' : '📚'}
                      </div>
                    </div>
                    
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-slate-100">{result.marks}</span>
                          <span className="text-slate-400 text-sm">/100</span>
                        </div>
                        <span className={`score-badge ${getScoreClass(result.marks)} mt-2 inline-block`}>
                          {result.marks >= 80 ? 'Excellent' :
                           result.marks >= 60 ? 'Good' :
                           result.marks >= 40 ? 'Average' : 'Needs Improvement'}
                        </span>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-slate-400 text-sm">{formatDate(result.date)}</p>
                        <div className="mt-2 text-indigo-400 text-sm font-medium flex items-center gap-1">
                          <span>View Details</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default StudentResultsPage;
