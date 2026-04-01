import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as evaluationService from '../../services/evaluationService';
import Loader from '../../components/ui/Loader';
import QuestionCard from '../../components/evaluation/QuestionCard';

const TeacherResultDetailPage = () => {
  const { id } = useParams();
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

  const questions = data?.questions ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-slate-100">{data?.studentName}</h1>
        <p className="text-slate-400 mt-1">{data?.subject}</p>
      </div>

      <div className="space-y-4">
        {questions.map((q) => (
          <QuestionCard
            key={q.questionNumber}
            questionNumber={q.questionNumber}
            marks={q.marks}
            correctPoints={q.correctPoints}
            missingPoints={q.missingPoints}
            mistakes={q.mistakes}
            suggestions={q.suggestions}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default TeacherResultDetailPage;
