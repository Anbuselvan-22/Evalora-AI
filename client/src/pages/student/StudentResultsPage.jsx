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
      transition={{ duration: 0.3 }}
      className="p-6 space-y-8"
    >
      <h1 className="text-2xl font-bold text-slate-100">My Results</h1>

      {rows.length === 0 ? (
        <div className="glass rounded-xl p-10 flex flex-col items-center justify-center text-slate-500 gap-2">
          <p className="text-lg font-medium text-slate-400">No results yet</p>
          <p className="text-sm">Your evaluated results will appear here.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([subject, items]) => (
          <div key={subject} className="space-y-3">
            <h2 className="text-lg font-semibold text-indigo-400">{subject}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((result) => (
                <motion.div
                  key={result._id}
                  className="glass rounded-xl p-5 cursor-pointer hover:ring-1 hover:ring-indigo-500/50 transition-all"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigate(`/student/results/${result._id}`)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-slate-200 font-semibold">{result.subject}</p>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      result.status === 'completed' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {result.status === 'completed' ? 'Completed' : 'Processing'}
                    </span>
                  </div>
                  <p className="text-indigo-400 text-xl font-bold mt-2">
                    {result.status === 'completed' 
                      ? `${result.obtainedMarks}/${result.totalMarks} marks` 
                      : 'Processing...'}
                  </p>
                  <p className="text-slate-400 text-sm mt-1">
                    {formatDate(result.createdAt)}
                  </p>
                  {result.status === 'completed' && (
                    <p className="text-slate-300 text-sm mt-2">
                      Score: {result.percentage}%
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        ))
      )}
    </motion.div>
  );
};

export default StudentResultsPage;
