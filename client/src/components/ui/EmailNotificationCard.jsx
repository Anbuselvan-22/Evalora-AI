import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle, AlertCircle, ExternalLink, Copy, Eye, EyeOff } from 'lucide-react';
import * as studentService from '../../services/studentService';
import { formatStudentEmailForDisplay } from '../../utils/emailGenerator';

const EmailNotificationCard = ({ 
  evaluationData, 
  studentData, 
  isVisible, 
  onClose,
  autoCloseDelay = 8000,
  isDemoMode = false // Add demo mode prop
}) => {
  const [emailStatus, setEmailStatus] = useState('loading'); // loading, success, error
  const [emailInfo, setEmailInfo] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(''); // '', 'email', 'records'

  useEffect(() => {
    // Only create email if we don't already have email info
    if (isVisible && studentData && !emailInfo) {
      createStudentEmail();
    }

    // Auto-close after delay
    if (isVisible && autoCloseDelay > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, studentData, evaluationData, autoCloseDelay, onClose, emailInfo]);

  const openEmailClient = () => {
    if (emailInfo?.email) {
      setButtonLoading('email');
      try {
        // Create a mailto link with the student's email
        const mailtoLink = `mailto:${emailInfo.email}`;
        
        // Try to open in a new window/tab first
        const newWindow = window.open(mailtoLink, '_blank');
        
        // If popup blocker prevents opening, try current window
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
          window.location.href = mailtoLink;
        }
        
        console.log('Opening email client for:', emailInfo.email);
        
        // Show success feedback
        setTimeout(() => {
          setButtonLoading('');
        }, 500);
      } catch (error) {
        console.error('Failed to open email client:', error);
        // Fallback: copy email to clipboard and show message
        copyToClipboard(emailInfo.email);
        alert('Email copied to clipboard! Please paste it in your email client.');
        setButtonLoading('');
      }
    }
  };

  const viewRecords = () => {
    if (emailInfo?.email) {
      setButtonLoading('records');
      
      // Simulate loading and then show message
      setTimeout(() => {
        alert(`Records for ${emailInfo.email} would be displayed here.\n\nThis would typically navigate to:\n/student/records?email=${emailInfo.email}`);
        setButtonLoading('');
      }, 500);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const createStudentEmail = async () => {
    if (!studentData?.name || !studentData?.rollNumber) {
      setEmailStatus('error');
      return;
    }

    setEmailStatus('loading');

    try {
      let result;
      
      // Check if we already have complete email info from evaluationData
      if (evaluationData?.studentData?.email && evaluationData?.studentData?.password) {
        // Use the complete data that was already created during evaluation
        result = {
          success: true,
          email: evaluationData.studentData.email,
          emailCredentials: {
            email: evaluationData.studentData.email,
            password: evaluationData.studentData.password
          },
          isExisting: evaluationData.studentData.isExisting || false
        };
        setEmailStatus('success');
        console.log('✅ Using evaluation result data:', result.email);
      } else if (studentData?.isExisting) {
        // Use existing email - student already exists
        result = {
          success: true,
          email: studentData.email,
          emailCredentials: {
            email: studentData.email,
            password: studentData.password || 'Use your existing password'
          },
          isExisting: true
        };
        setEmailStatus('success');
        console.log('✅ Using existing student email:', result.email);
      } else if (evaluationData?.existingEmail) {
        // Use existing email (legacy check)
        result = {
          success: true,
          email: evaluationData.existingEmail,
          emailCredentials: {
            email: evaluationData.existingEmail,
            password: 'Use your existing password'
          },
          isExisting: true
        };
        setEmailStatus('success');
        console.log('✅ Using legacy existing email:', result.email);
      } else if (evaluationData?.emailInfo) {
        // Use newly created email info
        result = evaluationData.emailInfo;
        setEmailStatus('success');
        console.log('✅ Using provided email info:', result.email);
      } else {
        // Only make API calls if this is not demo mode and we don't have existing data
        if (isDemoMode) {
          // In demo mode, create a mock result
          result = {
            success: true,
            email: studentData.email,
            emailCredentials: {
              email: studentData.email,
              password: studentData.password
            },
            isExisting: false
          };
          setEmailStatus('success');
          console.log('✅ Demo mode: Created mock email:', result.email);
        } else {
          // Fallback to creating new email (original logic)
          result = await studentService.createStudentEmail({
            studentId: studentData.id,
            name: studentData.name,
            rollNumber: studentData.rollNumber || studentData.studentRollNo,
            evaluationId: evaluationData?.id
          });
          setEmailStatus('success');

          // Send evaluation notification
          await studentService.sendEvaluationNotification({
            studentId: studentData.id,
            email: result.email,
            evaluationData,
            emailCredentials: result.emailCredentials
          });
        }
      }

      setEmailInfo(result);

    } catch (error) {
      console.error('Failed to handle student email:', error);
      setEmailStatus('error');
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed top-4 right-4 z-50 w-full max-w-md"
      >
        <div className="bg-gradient-to-br from-slate-900 via-indigo-900/50 to-slate-900 backdrop-blur-xl rounded-2xl border border-indigo-500/30 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 p-4 border-b border-indigo-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  emailStatus === 'success' ? 'bg-green-500/20' :
                  emailStatus === 'error' ? 'bg-red-500/20' : 'bg-blue-500/20'
                }`}>
                  {emailStatus === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : emailStatus === 'error' ? (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  ) : (
                    <Mail className="w-5 h-5 text-blue-400 animate-pulse" />
                  )}
                </div>
                <div>
                  <h3 className="text-white font-semibold">
                    {emailInfo?.isExisting ? 'Evaluation Delivered' : 'Student Email Created'}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {emailStatus === 'success' ? 
                      (emailInfo?.isExisting ? `Evaluated and delivered to ${studentData?.name} with email` : 'Access your evaluation records') :
                     emailStatus === 'error' ? 'Failed to create email' : 'Processing your evaluation...'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                ×
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {emailStatus === 'loading' && (
              <div className="text-center py-6">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-blue-400 animate-pulse" />
                </div>
                <p className="text-slate-300 text-sm">Processing your evaluation...</p>
                <p className="text-slate-500 text-xs mt-2">Checking student records and creating notification</p>
              </div>
            )}

            {emailStatus === 'success' && emailInfo && (
              <div className="space-y-4">
                {/* Email Address */}
                <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                  <label className="text-xs text-slate-400 font-medium">Email Address</label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-white font-mono text-sm flex-1">
                      {formatStudentEmailForDisplay(emailInfo.email)}
                    </span>
                    <button
                      onClick={() => copyToClipboard(emailInfo.email)}
                      className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-white transition-colors"
                      title="Copy email"
                    >
                      {copied ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password */}
                {emailInfo.emailCredentials && (
                  <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                    <label className="text-xs text-slate-400 font-medium">Password</label>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-white font-mono text-sm flex-1">
                        {showPassword ? emailInfo.emailCredentials.password : '••••••••••••'}
                      </span>
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-white transition-colors"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => copyToClipboard(emailInfo.emailCredentials.password)}
                        className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-white transition-colors"
                        title="Copy password"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button 
                    onClick={openEmailClient}
                    disabled={buttonLoading === 'email'}
                    className={`flex-1 px-3 py-2 rounded-lg font-medium transition-all duration-300 text-sm flex items-center justify-center gap-2 ${
                      buttonLoading === 'email' 
                        ? 'bg-slate-600 text-white cursor-not-allowed' 
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white'
                    }`}
                  >
                    {buttonLoading === 'email' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Opening...
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-4 h-4" />
                        Open Email
                      </>
                    )}
                  </button>
                  <button 
                    onClick={viewRecords}
                    disabled={buttonLoading === 'records'}
                    className={`flex-1 px-3 py-2 rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-2 ${
                      buttonLoading === 'records'
                        ? 'bg-slate-600 text-white cursor-not-allowed'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    }`}
                  >
                    {buttonLoading === 'records' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        View Records
                      </>
                    )}
                  </button>
                </div>

                {/* Info Message */}
                {emailInfo.usedAlternative && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2">
                    <p className="text-yellow-300 text-xs">
                      Alternative email format was used to avoid duplicates
                    </p>
                  </div>
                )}

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-300 text-xs">
                    {emailInfo?.isExisting 
                      ? `📧 Evaluation results have been sent to ${studentData?.name}'s existing email address. 
                      They can use their existing credentials to access their performance reports and detailed analytics.`
                      : `📧 Your evaluation records have been sent to this email address. 
                      Use these credentials to access your performance reports and detailed analytics.`
                    }
                  </p>
                </div>
              </div>
            )}

            {emailStatus === 'error' && (
              <div className="text-center py-6">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
                <p className="text-red-400 text-sm font-medium mb-2">Email Creation Failed</p>
                <p className="text-slate-400 text-xs mb-4">
                  We couldn't create your student email. Please contact support.
                </p>
                <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-medium transition-colors text-sm">
                  Contact Support
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EmailNotificationCard;
