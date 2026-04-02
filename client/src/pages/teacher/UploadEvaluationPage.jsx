import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as evaluationService from '../../services/evaluationService';
import Loader from '../../components/ui/Loader';
import UploadBox from '../../components/upload/UploadBox';

const UploadEvaluationPage = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState({ questionPaper: null, rubrics: null, answerSheet: null });
  const [subject, setSubject] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentRollNo, setStudentRollNo] = useState('');
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
    if (!subject.trim()) missing.push('Subject');
    if (!studentName.trim()) missing.push('Student Name');
    if (!studentRollNo.trim()) missing.push('Roll Number');

    if (missing.length > 0) {
      setValidationError(`Please provide the following: ${missing.join(', ')}`);
      return;
    }

    const formData = new FormData();
    formData.append('questionPaper', files.questionPaper);
    formData.append('rubrics', files.rubrics);
    formData.append('answerSheet', files.answerSheet);
    formData.append('subject', subject);
    formData.append('studentName', studentName);
    formData.append('studentRollNo', studentRollNo);

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
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-2">
            Subject
          </label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., Mathematics, Science, English"
            className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="studentName" className="block text-sm font-medium text-slate-300 mb-2">
              Student Name
            </label>
            <input
              id="studentName"
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Enter student's full name"
              className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="studentRollNo" className="block text-sm font-medium text-slate-300 mb-2">
              Roll Number
            </label>
            <input
              id="studentRollNo"
              type="text"
              value={studentRollNo}
              onChange={(e) => setStudentRollNo(e.target.value)}
              placeholder="Enter roll number"
              className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={loading}
            />
          </div>
        </div>
        
        <UploadBox
          label="Question Paper"
          onFileSelect={handleFileSelect('questionPaper')}
          accept=".pdf"
        />
        <UploadBox
          label="Rubrics"
          onFileSelect={handleFileSelect('rubrics')}
          accept=".pdf"
        />
        <UploadBox
          label="Answer Sheet"
          onFileSelect={handleFileSelect('answerSheet')}
          accept=".pdf,.jpg,.jpeg,.png,.txt"
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
