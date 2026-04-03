import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, MapPin, Calendar, Award, BookOpen, Users, Target } from 'lucide-react';
import * as teacherService from '../../services/teacherService';

const TeacherProfile = ({ isOpen, onClose }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const controller = new AbortController();
      setLoading(true);
      setError(null);
      
      teacherService.getTeacherProfile(controller.signal)
        .then(setProfile)
        .catch((err) => {
          if (err.name !== 'AbortError' && err.name !== 'CanceledError') {
            setError(err.message);
          }
        })
        .finally(() => setLoading(false));
      
      return () => controller.abort();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-2xl glass-dark border border-slate-700/50 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 glass-dark border-b border-slate-700/50 p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Teacher Profile</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-400">{error}</p>
              </div>
            ) : profile ? (
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {profile.name?.charAt(0)?.toUpperCase() || 'T'}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white">{profile.name || 'Teacher Name'}</h3>
                    <p className="text-slate-400">{profile.subject || 'Subject Teacher'}</p>
                    <p className="text-sm text-slate-500 mt-1">ID: {profile.employeeId || 'EMP001'}</p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                    <div className="flex items-center gap-3 text-slate-400 mb-2">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm font-medium">Email</span>
                    </div>
                    <p className="text-white text-sm">{profile.email || 'teacher@school.edu'}</p>
                  </div>
                  <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                    <div className="flex items-center gap-3 text-slate-400 mb-2">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm font-medium">Phone</span>
                    </div>
                    <p className="text-white text-sm">{profile.phone || '+1 234 567 8900'}</p>
                  </div>
                  <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                    <div className="flex items-center gap-3 text-slate-400 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-medium">Department</span>
                    </div>
                    <p className="text-white text-sm">{profile.department || 'Computer Science'}</p>
                  </div>
                  <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                    <div className="flex items-center gap-3 text-slate-400 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium">Experience</span>
                    </div>
                    <p className="text-white text-sm">{profile.experience || '5+ Years'}</p>
                  </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-lg border border-blue-500/20">
                    <div className="flex items-center gap-3 text-blue-400 mb-2">
                      <Users className="w-5 h-5" />
                      <span className="text-sm font-medium">Total Students</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{profile.totalStudents || 150}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-lg border border-green-500/20">
                    <div className="flex items-center gap-3 text-green-400 mb-2">
                      <BookOpen className="w-5 h-5" />
                      <span className="text-sm font-medium">Courses</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{profile.courses || 6}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded-lg border border-purple-500/20">
                    <div className="flex items-center gap-3 text-purple-400 mb-2">
                      <Target className="w-5 h-5" />
                      <span className="text-sm font-medium">Evaluations</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{profile.evaluations || 45}</p>
                  </div>
                </div>

                {/* Qualifications */}
                <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <div className="flex items-center gap-3 text-slate-400 mb-3">
                    <Award className="w-4 h-4" />
                    <span className="text-sm font-medium">Qualifications</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-white text-sm">• {profile.qualification1 || 'M.Sc. Computer Science'}</div>
                    <div className="text-white text-sm">• {profile.qualification2 || 'B.Ed. Education'}</div>
                    <div className="text-white text-sm">• {profile.qualification3 || 'Certified AI Instructor'}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-400">No profile data available</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TeacherProfile;
