import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as studentService from '../../services/studentService';
import { Bell, CheckCircle, X, ExternalLink, BookOpen, Award, TrendingUp, Clock, Check, Trash2, Upload } from 'lucide-react';

const NotificationCenter = ({ isOpen, onClose, position = 'top-right', userRole }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isOpen && user) {
      fetchNotifications();
    }
  }, [isOpen, user, userRole]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      if (userRole === 'teacher') {
        // Fetch real teacher notifications from API
        const data = await studentService.getTeacherNotifications();
        setNotifications(Array.isArray(data) ? data : []);
        
        // Calculate unread count
        const unreadCount = Array.isArray(data) ? data.filter(n => !n.read).length : 0;
        setUnreadCount(unreadCount);
      } else {
        // For students, use original logic
        const data = await studentService.getStudentNotifications(user.id);
        // Ensure data is an array
        setNotifications(Array.isArray(data) ? data : []);
        
        // Get unread count
        try {
          const count = await studentService.getUnreadNotificationCount(user.id);
          setUnreadCount(count || 0);
        } catch (countError) {
          console.error('Failed to get unread count:', countError);
          setUnreadCount(0);
        }
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      // Set mock notifications for demo
      if (userRole === 'teacher') {
        setNotifications([
          {
            id: 'teacher_notif_001',
            title: 'New Evaluation Submitted',
            message: 'Alice Smith submitted a Mathematics evaluation for grading.',
            type: 'evaluation_submitted',
            isRead: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
            subject: 'Mathematics',
            studentName: 'Alice Smith'
          },
          {
            id: 'teacher_notif_002',
            title: 'Evaluation Completed',
            message: 'Physics evaluation for John Doe has been processed and results are available.',
            type: 'evaluation_completed',
            isRead: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
            subject: 'Physics',
            studentName: 'John Doe'
          },
          {
            id: 'teacher_notif_003',
            title: 'Student Performance Alert',
            message: 'Jane Wilson shows significant improvement in Chemistry. Consider advanced topics.',
            type: 'performance_alert',
            isRead: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
            subject: 'Chemistry',
            studentName: 'Jane Wilson'
          }
        ]);
        setUnreadCount(2);
      } else {
        setNotifications([
          {
            id: 'notif_001',
            title: 'New Evaluation Completed',
            message: 'Your Mathematics evaluation has been completed by teacher. Click to view your detailed results and feedback.',
            type: 'evaluation',
            isRead: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
            subject: 'Mathematics',
            evaluationId: 'eval_demo_001'
          },
          {
            id: 'notif_002',
            title: 'Performance Update Available',
            message: 'Your weekly performance analytics are now available. Check your progress and improvement areas.',
            type: 'analytics',
            isRead: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
            subject: 'Analytics'
          },
          {
            id: 'notif_003',
            title: 'Study Recommendation',
            message: 'Based on your recent performance, we recommend focusing on Physics problem-solving techniques.',
            type: 'recommendation',
            isRead: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
            subject: 'Study Tips'
          }
        ]);
        setUnreadCount(2);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await studentService.markNotificationAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, isRead: true, readAt: new Date().toISOString() }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await studentService.markAllNotificationsAsRead(user.id);
      setNotifications(prev => 
        prev.map(notif => ({ 
          ...notif, 
          isRead: true, 
          readAt: new Date().toISOString() 
        }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await studentService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      const deletedNotif = notifications.find(n => n.id === notificationId);
      if (!deletedNotif.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleViewEvaluation = (evaluationId) => {
    if (userRole === 'teacher') {
      navigate(`/teacher/results/${evaluationId}`);
    } else {
      navigate(`/student/results/${evaluationId}`);
    }
    onClose();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'evaluation_completed':
        return <BookOpen className="w-5 h-5 text-blue-400" />;
      case 'new_evaluation':
        return <Award className="w-5 h-5 text-purple-400" />;
      case 'evaluation_submitted':
        return <Upload className="w-5 h-5 text-orange-400" />;
      case 'performance_update':
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'performance_alert':
        return <TrendingUp className="w-5 h-5 text-yellow-400" />;
      case 'student_email_created':
        return <CheckCircle className="w-5 h-5 text-indigo-400" />;
      case 'email_created':
        return <CheckCircle className="w-5 h-5 text-indigo-400" />;
      case 'evaluation':
        return <BookOpen className="w-5 h-5 text-blue-400" />;
      case 'analytics':
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'recommendation':
        return <Award className="w-5 h-5 text-purple-400" />;
      default:
        return <Bell className="w-5 h-5 text-slate-400" />;
    }
  };

  const getNotificationColor = (type, isRead) => {
    if (isRead) return 'bg-slate-800/30 border-slate-700/50';
    
    switch (type) {
      case 'evaluation_completed':
        return 'bg-blue-500/10 border-blue-500/30';
      case 'new_evaluation':
        return 'bg-purple-500/10 border-purple-500/30';
      case 'evaluation_submitted':
        return 'bg-orange-500/10 border-orange-500/30';
      case 'performance_update':
        return 'bg-green-500/10 border-green-500/30';
      case 'performance_alert':
        return 'bg-yellow-500/10 border-yellow-500/30';
      case 'student_email_created':
        return 'bg-indigo-500/10 border-indigo-500/30';
      case 'email_created':
        return 'bg-indigo-500/10 border-indigo-500/30';
      case 'evaluation':
        return 'bg-blue-500/10 border-blue-500/30';
      case 'analytics':
        return 'bg-green-500/10 border-green-500/30';
      case 'recommendation':
        return 'bg-purple-500/10 border-purple-500/30';
      default:
        return 'bg-slate-800/30 border-slate-700/50';
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-16 right-4';
      case 'top-left':
        return 'top-16 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      default:
        return 'top-16 right-4';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Notification Panel */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`fixed ${getPositionClasses()} z-50 w-96 max-h-[calc(100vh-5rem)] bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 p-4 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Bell className="w-5 h-5 text-indigo-400" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900"></span>
                  )}
                </div>
                <h3 className="text-white font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full border border-red-500/30">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto max-h-96">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              </div>
            ) : (notifications || []).length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No notifications yet</p>
                <p className="text-slate-500 text-sm mt-2">You'll see updates here</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-700/50">
                {(notifications || []).map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`p-4 ${getNotificationColor(notification.type, notification.isRead)} transition-all duration-200`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className={`text-sm ${notification.isRead ? 'text-slate-400' : 'text-white'} font-medium`}>
                              {notification.title}
                            </p>
                            <p className={`text-xs ${notification.isRead ? 'text-slate-500' : 'text-slate-400'} mt-1 line-clamp-2`}>
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-xs text-slate-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTimeAgo(notification.createdAt)}
                              </span>
                              {notification.subject && (
                                <span className="text-xs px-2 py-1 bg-slate-700/50 rounded-full text-slate-300">
                                  {notification.subject}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {!notification.isRead && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="p-1 rounded hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
                                title="Mark as read"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            {notification.evaluationId && (
                              <button
                                onClick={() => handleViewEvaluation(notification.evaluationId)}
                                className="p-1 rounded hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
                                title="View evaluation"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteNotification(notification.id)}
                              className="p-1 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default NotificationCenter;
