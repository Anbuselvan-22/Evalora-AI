import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import * as evaluationService from '../../services/evaluationService';
import * as studentService from '../../services/studentService';
import Loader from '../../components/ui/Loader';
import EmailNotificationCard from '../../components/ui/EmailNotificationCard';
import UploadBox from '../../components/upload/UploadBox';
import { 
  Upload, 
  FileText, 
  User, 
  Hash, 
  BookOpen, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  Sparkles,
  Target
} from 'lucide-react';

const UploadEvaluationPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [files, setFiles] = useState({ questionPaper: null, rubrics: null, answerSheet: null });
  const [subject, setSubject] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentRollNo, setStudentRollNo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [showEmailNotification, setShowEmailNotification] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [demoMode, setDemoMode] = useState(true);

  // Generate email based on student name and roll number
  const generateStudentEmail = (name, rollNo) => {
    const cleanName = (name || 'john.doe').toLowerCase().replace(/\s+/g, '.').replace(/[^a-z0-9.]/g, '');
    const numericRoll = (rollNo || '001').replace(/[^0-9]/g, ''); // Extract just numbers
    return `${cleanName}.${numericRoll}@stu.com`;
  };

  // Generate password based on student info
  const generateStudentPassword = (name, rollNo) => {
    const cleanName = (name || 'Student').charAt(0).toUpperCase() + (name || 'Student').slice(1).toLowerCase().replace(/\s+/g, '');
    const cleanRoll = (rollNo || '001').replace(/[^a-z0-9]/g, '');
    return `${cleanName}@${cleanRoll}`;
  };

  // Mock evaluation data for demo
  const mockEvaluationResult = {
    evaluationId: 'eval_demo_001',
    studentData: {
      name: studentName || 'John Doe',
      rollNumber: studentRollNo || 'STU001',
      email: generateStudentEmail(studentName, studentRollNo),
      password: generateStudentPassword(studentName, studentRollNo)
    },
    evaluationData: {
      subject: subject || 'Mathematics',
      totalMarks: 100,
      obtainedMarks: 85,
      percentage: 85,
      grade: 'A',
      confidence: 0.92,
      processingTime: '2.3 seconds',
      questionWiseData: [
        {
          questionNumber: 1,
          marks: 18,
          totalMarks: 20,
          feedback: 'Excellent problem-solving approach with clear steps.',
          mistakes: [],
          suggestions: ['Consider showing alternative methods']
        },
        {
          questionNumber: 2,
          marks: 22,
          totalMarks: 25,
          feedback: 'Good understanding of concepts, minor calculation errors.',
          mistakes: ['Small arithmetic mistake in step 3'],
          suggestions: ['Double-check calculations', 'Show all intermediate steps']
        },
        {
          questionNumber: 3,
          marks: 15,
          totalMarks: 20,
          feedback: 'Conceptual understanding is good but needs more practice.',
          mistakes: ['Formula application incorrect'],
          suggestions: ['Review formula derivation', 'Practice similar problems']
        },
        {
          questionNumber: 4,
          marks: 20,
          totalMarks: 20,
          feedback: 'Perfect solution! Well-explained and accurate.',
          mistakes: [],
          suggestions: ['Maintain this level of excellence']
        },
        {
          questionNumber: 5,
          marks: 10,
          totalMarks: 15,
          feedback: 'Partial credit - approach was correct but incomplete.',
          mistakes: ['Did not complete the proof'],
          suggestions: ['Ensure complete solutions', 'Show all reasoning steps']
        }
      ],
      overallFeedback: {
        strengths: [
          'Strong problem-solving skills',
          'Clear presentation of work',
          'Good conceptual understanding',
          'Well-organized solutions'
        ],
        areasForImprovement: [
          'Attention to detail in calculations',
          'Complete all steps in proofs',
          'Time management during exams',
          'Practice with complex problems'
        ],
        recommendations: [
          'Focus on accuracy while maintaining speed',
          'Practice with timed assessments',
          'Review fundamental concepts regularly',
          'Join study groups for collaborative learning'
        ]
      }
    }
  };

  const handleFileSelect = (key) => (file) => {
    setFiles((prev) => ({ ...prev, [key]: file }));
    setValidationError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError(null);
    setError(null);

    // Demo mode - skip validation and show immediate results
    if (demoMode) {
      console.log('🚀 Demo Mode: Simulating evaluation...');
      console.log('Student Info:', { studentName, studentRollNo, subject });
      setLoading(true);
      
      // Simulate processing delay for demo effect
      setTimeout(async () => {
        try {
          // Check if student already exists (in demo mode, simulate this check)
          const studentExists = studentName.toLowerCase().includes('john') || studentName.toLowerCase().includes('jane');
          
          // Generate dynamic email and password based on input
          const dynamicEmail = generateStudentEmail(studentName, studentRollNo);
          const dynamicPassword = generateStudentPassword(studentName, studentRollNo);
          
          // Update mock data with current form values
          const updatedMockResult = {
            ...mockEvaluationResult,
            studentId: `student_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`, // Generate unique ID
            studentData: {
              name: studentName || 'John Doe',
              rollNumber: studentRollNo || 'STU001',
              email: dynamicEmail,
              password: dynamicPassword,
              isExisting: studentExists
            },
            evaluationData: {
              ...mockEvaluationResult.evaluationData,
              subject: subject || 'Mathematics'
            }
          };
          
          setEvaluationResult(updatedMockResult);
          setShowEmailNotification(true);
          setLoading(false);
          console.log('✅ Demo evaluation completed successfully!');
          console.log('Student exists:', studentExists);
          console.log('Generated email:', dynamicEmail);
          console.log('Generated password:', dynamicPassword);
          console.log('Mock result:', updatedMockResult);
        } catch (error) {
          console.error('❌ Demo mode error:', error);
          setError('Demo mode failed. Please try again.');
          setLoading(false);
        }
      }, 2000);
      return;
    }

    // Real validation for production mode
    const missing = [];
    if (!files.questionPaper) missing.push('Question Paper');
    if (!files.rubrics) missing.push('Rubrics');
    if (!files.answerSheet) missing.push('Answer Sheet');
    if (!subject.trim()) missing.push('Subject');
    if (!studentName.trim()) missing.push('Student Name');
    if (!studentRollNo.trim()) missing.push('Student Roll No');

    if (missing.length > 0) {
      setValidationError(`Please fill in all required fields: ${missing.join(', ')}`);
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('questionPaper', files.questionPaper);
      formData.append('rubrics', files.rubrics);
      formData.append('answerSheet', files.answerSheet);
      formData.append('subject', subject);
      formData.append('studentName', studentName);
      formData.append('studentRollNo', studentRollNo);

      const result = await evaluationService.uploadEvaluation(formData);
      
      // Check if student already has an email before creating a new one
      let emailResult;
      let isExistingStudent = false;
      
      try {
        console.log('Checking if student already has email...');
        
        // First check if student email already exists
        const emailCheck = await studentService.checkStudentEmailExists({
          name: studentName,
          rollNumber: studentRollNo
        });
        
        if (emailCheck.exists && emailCheck.email) {
          console.log('Student already exists with email:', emailCheck.email);
          // Student already has email, use existing one
          emailResult = {
            email: emailCheck.email,
            password: 'Use your existing password',
            isExisting: true
          };
          isExistingStudent = true;
        } else {
          console.log('Creating new email for student...');
          // Create new email only if it doesn't exist
          emailResult = await studentService.createStudentEmail({
            studentId: result.studentId,
            name: studentName,
            rollNumber: studentRollNo
          });
          console.log('Email creation result:', emailResult);
        }
      } catch (emailError) {
        console.error('Email check/creation failed:', emailError);
        // Don't fail the whole process if email fails
        emailResult = {
          email: generateStudentEmail(studentName, studentRollNo),
          password: generateStudentPassword(studentName, studentRollNo),
          isExisting: false
        };
      }

      const notificationData = {
        studentId: updatedMockResult.studentId, // Use the same unique ID
        evaluationId: result.evaluationId,
        subject,
        studentEmail: emailResult.email,
        studentPassword: emailResult.password,
        obtainedMarks: result.obtainedMarks,
        totalMarks: result.totalMarks,
        percentage: result.percentage,
        isExistingStudent
      };

      await studentService.sendEvaluationNotification(notificationData);

      setEvaluationResult({
        evaluationId: result.evaluationId,
        studentData: {
          name: studentName,
          rollNumber: studentRollNo,
          email: emailResult.email,
          password: emailResult.password,
          isExisting: isExistingStudent
        },
        evaluationData: result
      });
      setShowEmailNotification(true);
      
      // Create teacher notification for student email creation
      try {
        await studentService.createTeacherNotification({
          teacherId: user?.id,
          teacherName: user?.name || 'Teacher',
          type: 'student_email_created',
          title: 'Student Email Created',
          message: `Student account created for ${studentName} (${emailResult.email}). Credentials have been generated for evaluation access.`,
          priority: 'medium',
          studentName,
          studentEmail: emailResult.email,
          studentRollNo: studentRollNo,
          subject,
          isExisting: isExistingStudent,
          createdAt: new Date().toISOString()
        });
      } catch (teacherNotificationError) {
        console.error('Failed to create teacher notification:', teacherNotificationError);
        // Don't fail the whole process if teacher notification fails
      }
      
      // Create student notification for new evaluation
      try {
        await studentService.createEvaluationNotification({
          studentId: result.studentId,
          studentName,
          studentRollNo,
          evaluationId: result.evaluationId,
          subject,
          teacherName: user?.name || 'Teacher',
          type: 'new_evaluation',
          title: `New Evaluation Completed`,
          message: `Your ${subject} evaluation has been completed by ${user?.name || 'Teacher'}. Click to view your results and detailed feedback.`,
          priority: 'high',
          createdAt: new Date().toISOString()
        });
      } catch (notificationError) {
        console.error('Failed to create student notification:', notificationError);
        // Don't fail the whole process if notification fails
      }
      
      // Navigate after a delay to allow user to see the notification
      setTimeout(() => {
        navigate('/teacher/results');
      }, 10000); // 10 seconds delay
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen p-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto mb-8"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 mb-4"
          >
            <Upload className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Upload Evaluation
          </h1>
          <p className="text-slate-400 text-lg">
            Submit student evaluations for AI-powered analysis and feedback
          </p>
        </div>
      </motion.div>

      {/* Demo Mode Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="max-w-4xl mx-auto mb-6"
      >
        <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 backdrop-blur-xl rounded-2xl border border-purple-500/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="relative"
              >
                <Sparkles className="w-6 h-6 text-purple-400" />
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              <div>
                <h3 className="text-white font-bold text-lg">🚀 Demo Mode Active</h3>
                <p className="text-purple-300 text-sm">Instant AI evaluation - No files required!</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-purple-300">Status</p>
                <p className="text-sm text-green-400 font-medium">Ready</p>
              </div>
              <div className="w-12 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full relative">
                <motion.div
                  className="absolute w-5 h-5 bg-white rounded-full top-0.5 right-0.5 shadow-lg"
                  animate={{ x: [0, 0] }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="max-w-4xl mx-auto"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Student Information Card */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
                <User className="w-6 h-6 text-indigo-400" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Student Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label htmlFor="subject" className="flex items-center gap-2 text-sm font-medium text-slate-300">
                  <BookOpen className="w-4 h-4" />
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Mathematics, Science"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="studentName" className="flex items-center gap-2 text-sm font-medium text-slate-300">
                  <User className="w-4 h-4" />
                  Student Name
                </label>
                <input
                  id="studentName"
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter student's full name"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="studentRollNo" className="flex items-center gap-2 text-sm font-medium text-slate-300">
                  <Hash className="w-4 h-4" />
                  Roll Number
                </label>
                <input
                  id="studentRollNo"
                  type="text"
                  value={studentRollNo}
                  onChange={(e) => setStudentRollNo(e.target.value)}
                  placeholder="Enter roll number"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* File Upload Card */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30">
                <Upload className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Upload Documents</h2>
            </div>

            <div className="space-y-6">
              <UploadBox
                label="Question Paper"
                description="Upload the question paper in PDF format"
                onFileSelect={handleFileSelect('questionPaper')}
                accept=".pdf"
                icon={FileText}
              />
              <UploadBox
                label="Evaluation Rubrics"
                description="Upload the rubrics or marking scheme"
                onFileSelect={handleFileSelect('rubrics')}
                accept=".pdf"
                icon={Target}
              />
              <UploadBox
                label="Student Answer Sheet"
                description="Upload answer sheet (PDF, Image, or Text file)"
                onFileSelect={handleFileSelect('answerSheet')}
                accept=".pdf,.jpg,.jpeg,.png,.txt"
                icon={FileText}
              />
            </div>
          </div>

          {/* Error Messages */}
          {validationError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
              <p className="text-yellow-300 text-sm">{validationError}</p>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing Evaluation...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Submit Evaluation
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>

      {/* Email Notification Card */}
      <EmailNotificationCard
        isVisible={showEmailNotification}
        evaluationData={evaluationResult}
        studentData={{
          id: evaluationResult?.studentId || 'temp-' + Date.now(),
          name: studentName,
          rollNumber: studentRollNo,
          studentRollNo: studentRollNo,
          email: evaluationResult?.studentData?.email,
          password: evaluationResult?.studentData?.password,
          isExisting: evaluationResult?.studentData?.isExisting || false
        }}
        onClose={() => setShowEmailNotification(false)}
        isDemoMode={demoMode}
      />
    </div>
  );
};

export default UploadEvaluationPage;
