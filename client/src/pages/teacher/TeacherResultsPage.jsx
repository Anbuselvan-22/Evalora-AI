import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as evaluationService from '../../services/evaluationService';
import Loader from '../../components/ui/Loader';
import { formatDate } from '../../utils/helpers';

const TeacherResultsPage = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <Loader />;
  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-red-400 text-sm">{error}</p>
    </div>
  );

  const rows = results ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 space-y-6"
    >
      <h1 className="text-2xl font-bold text-slate-100">Evaluation Results</h1>

      <div className="glass rounded-xl p-5">
        {rows.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-6">No results found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="pb-3 pr-4 font-medium">Student Name</th>
                  <th className="pb-3 pr-4 font-medium">Roll No</th>
                  <th className="pb-3 pr-4 font-medium">Subject</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((result) => (
                  <tr
                    key={result.id}
                    className="border-b border-slate-800 hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => navigate(`/teacher/results/${result.id}`)}
                  >
                    <td className="py-3 pr-4 text-slate-200">{result.studentName}</td>
                    <td className="py-3 pr-4 text-slate-300">{result.studentRollNo || '-'}</td>
                    <td className="py-3 pr-4 text-slate-300">{result.subject}</td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        result.isProcessing 
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                          : 'bg-green-500/20 text-green-400 border border-green-500/30'
                      }`}>
                        {result.isProcessing ? 'Processing' : `${result.obtainedMarks}/${result.totalMarks}`}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400">{formatDate(result.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TeacherResultsPage;
