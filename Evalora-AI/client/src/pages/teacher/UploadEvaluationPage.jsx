import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as evaluationService from '../../services/evaluationService';
import Loader from '../../components/ui/Loader';
import UploadBox from '../../components/upload/UploadBox';

const UploadEvaluationPage = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState({ questionPaper: null, rubrics: null, answerSheet: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(null);

  const handleFileSelect = (key) => (file) => {
    setFiles((prev) => ({ ...prev, [key]: file }));
    setValidationError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError(null);
    setError(null);

    const missing = [];
    if (!files.questionPaper) missing.push('Question Paper');
    if (!files.rubrics) missing.push('Rubrics');
    if (!files.answerSheet) missing.push('Answer Sheet');

    if (missing.length > 0) {
      setValidationError(`Please upload the following: ${missing.join(', ')}`);
      return;
    }

    const formData = new FormData();
    formData.append('questionPaper', files.questionPaper);
    formData.append('rubrics', files.rubrics);
    formData.append('answerSheet', files.answerSheet);

    setLoading(true);
    try {
      await evaluationService.submitEvaluation(formData);
      navigate('/teacher/results');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 max-w-2xl mx-auto space-y-6"
    >
      <h1 className="text-2xl font-bold text-slate-100">Upload Evaluation</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <UploadBox
          label="Question Paper"
          onFileSelect={handleFileSelect('questionPaper')}
          accept=".pdf,.doc,.docx"
        />
        <UploadBox
          label="Rubrics"
          onFileSelect={handleFileSelect('rubrics')}
          accept=".pdf,.doc,.docx"
        />
        <UploadBox
          label="Answer Sheet"
          onFileSelect={handleFileSelect('answerSheet')}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        />

        {validationError && (
          <p className="text-yellow-400 text-sm">{validationError}</p>
        )}
        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-colors duration-200"
        >
          Submit Evaluation
        </button>
      </form>
    </motion.div>
  );
};

export default UploadEvaluationPage;
