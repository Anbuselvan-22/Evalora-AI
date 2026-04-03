import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as teacherService from '../../services/teacherService';
import Loader from '../../components/ui/Loader';
import { Mail, Phone, MapPin, Calendar, Award, BookOpen, Users, Target, ArrowLeft, Briefcase, GraduationCap, Star, TrendingUp, Clock, CheckCircle } from 'lucide-react';

const TeacherProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    
    // For now, use mock data since the API endpoint might not exist
    // In a real app, you would call: teacherService.getTeacherProfile(controller.signal)
    const mockProfileData = {
      name: user?.name || 'John Doe',
      email: user?.email || 'teacher@school.edu',
      phone: '+1 234 567 8900',
      subject: 'Computer Science',
      department: 'Computer Science Department',
      employeeId: 'EMP001',
      experience: '5+ Years',
      totalStudents: 150,
      courses: 6,
      evaluations: 45,
      qualification1: 'M.Sc. Computer Science',
      qualification2: 'B.Ed. Education',
      qualification3: 'Certified AI Instructor',
      joinDate: '2019-08-15',
      specialization: 'Artificial Intelligence & Machine Learning',
      research: 'AI in Education, Natural Language Processing'
    };

    // Simulate API call
    setTimeout(() => {
      setProfile(mockProfileData);
      setLoading(false);
    }, 1000);

    return () => controller.abort();
  }, [user]);

  if (loading) return <Loader />;
  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-red-400 text-sm">{error}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900/20 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10"
      >
        <div className="bg-slate-900/80 backdrop-blur-xl border-b border-indigo-500/20">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05, x: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/teacher/dashboard')}
                  className="group p-3 rounded-xl bg-slate-800/50 hover:bg-indigo-600/20 border border-slate-700/50 hover:border-indigo-500/30 text-slate-400 hover:text-indigo-400 transition-all duration-300 shadow-lg hover:shadow-indigo-500/10"
                >
                  <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
                </motion.button>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">Teacher Profile</h1>
                  <p className="text-slate-400 mt-1 flex items-center gap-2">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                    Professional Information & Analytics
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <motion.div className="px-4 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-xl">
                  <p className="text-xs text-indigo-300 font-medium">Status</p>
                  <p className="text-sm text-white font-semibold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Active
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Hero Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-indigo-600/20 backdrop-blur-xl rounded-3xl border border-indigo-500/30 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5"></div>
            <div className="relative p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Profile Avatar */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative"
                >
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-2xl">
                    <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center">
                      <span className="text-4xl font-bold text-white">
                        {profile?.name?.charAt(0)?.toUpperCase() || 'T'}
                      </span>
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-slate-900 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </motion.div>

                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-3xl font-bold text-white mb-2"
                  >
                    {profile?.name || 'Teacher Name'}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-xl text-indigo-300 mb-4"
                  >
                    {profile?.subject || 'Subject Teacher'}
                  </motion.p>
                  
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-slate-400">
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/50 rounded-lg border border-slate-700/50">
                      <Briefcase className="w-4 h-4 text-indigo-400" />
                      <span>{profile?.employeeId || 'EMP001'}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/50 rounded-lg border border-slate-700/50">
                      <Calendar className="w-4 h-4 text-indigo-400" />
                      <span>Since {profile?.joinDate || '2019'}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/50 rounded-lg border border-slate-700/50">
                      <Clock className="w-4 h-4 text-indigo-400" />
                      <span>{profile?.experience || '5+ Years'}</span>
                    </div>
                  </div>
                </div>

                {/* Rating Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 flex flex-col items-center justify-center">
                    <Star className="w-8 h-8 text-yellow-500 mb-1" />
                    <span className="text-lg font-bold text-white">4.9</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">Excellence Rating</p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="group relative bg-gradient-to-br from-blue-600/20 to-blue-700/20 backdrop-blur-xl rounded-2xl border border-blue-500/30 p-6 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{profile?.totalStudents || 150}</h3>
              <p className="text-blue-300 text-sm font-medium">Total Students</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-green-400">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>+12% this semester</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="group relative bg-gradient-to-br from-green-600/20 to-green-700/20 backdrop-blur-xl rounded-2xl border border-green-500/30 p-6 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500/20 rounded-xl border border-green-500/30">
                  <BookOpen className="w-6 h-6 text-green-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{profile?.courses || 6}</h3>
              <p className="text-green-300 text-sm font-medium">Active Courses</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-green-400">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>All courses rated 4.5+</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="group relative bg-gradient-to-br from-purple-600/20 to-purple-700/20 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-6 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30">
                  <Target className="w-6 h-6 text-purple-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{profile?.evaluations || 45}</h3>
              <p className="text-purple-300 text-sm font-medium">Evaluations</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-green-400">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>98% completion rate</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Detailed Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
                  <Mail className="w-5 h-5 text-indigo-400" />
                </div>
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-300">
                  <div className="flex items-center gap-3 text-slate-400 mb-2">
                    <Mail className="w-4 h-4 group-hover:text-indigo-400 transition-colors" />
                    <span className="text-sm font-medium">Email</span>
                  </div>
                  <p className="text-white text-sm font-medium">{profile?.email || 'teacher@school.edu'}</p>
                </div>
                <div className="group p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-300">
                  <div className="flex items-center gap-3 text-slate-400 mb-2">
                    <Phone className="w-4 h-4 group-hover:text-indigo-400 transition-colors" />
                    <span className="text-sm font-medium">Phone</span>
                  </div>
                  <p className="text-white text-sm font-medium">{profile?.phone || '+1 234 567 8900'}</p>
                </div>
                <div className="group p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-300">
                  <div className="flex items-center gap-3 text-slate-400 mb-2">
                    <MapPin className="w-4 h-4 group-hover:text-indigo-400 transition-colors" />
                    <span className="text-sm font-medium">Department</span>
                  </div>
                  <p className="text-white text-sm font-medium">{profile?.department || 'Computer Science'}</p>
                </div>
                <div className="group p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-300">
                  <div className="flex items-center gap-3 text-slate-400 mb-2">
                    <Briefcase className="w-4 h-4 group-hover:text-indigo-400 transition-colors" />
                    <span className="text-sm font-medium">Office</span>
                  </div>
                  <p className="text-white text-sm font-medium">Room 301, Building A</p>
                </div>
              </div>
            </motion.div>

            {/* Professional Details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
                  <GraduationCap className="w-5 h-5 text-indigo-400" />
                </div>
                Professional Details
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20">
                  <h4 className="text-sm font-semibold text-indigo-300 mb-2">Specialization</h4>
                  <p className="text-white">{profile?.specialization || 'Artificial Intelligence & Machine Learning'}</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
                  <h4 className="text-sm font-semibold text-purple-300 mb-2">Research Interests</h4>
                  <p className="text-white">{profile?.research || 'AI in Education, Natural Language Processing'}</p>
                </div>
              </div>
            </motion.div>

            {/* Qualifications */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
                  <Award className="w-5 h-5 text-indigo-400" />
                </div>
                Qualifications & Certifications
              </h3>
              <div className="space-y-3">
                <motion.div
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-300 group"
                >
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:scale-125 transition-transform"></div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{profile?.qualification1 || 'M.Sc. Computer Science'}</p>
                    <p className="text-slate-400 text-sm">Stanford University • 2015</p>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-300 group"
                >
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 group-hover:scale-125 transition-transform"></div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{profile?.qualification2 || 'B.Ed. Education'}</p>
                    <p className="text-slate-400 text-sm">MIT • 2013</p>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-all duration-300 group"
                >
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 group-hover:scale-125 transition-transform"></div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{profile?.qualification3 || 'Certified AI Instructor'}</p>
                    <p className="text-slate-400 text-sm">Google AI • 2020</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/teacher/upload')}
                  className="w-full p-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-indigo-500/25 text-left flex items-center gap-3"
                >
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Upload Evaluation</p>
                    <p className="text-xs opacity-80">Create new assessment</p>
                  </div>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/teacher/results')}
                  className="w-full p-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-all duration-300 text-left flex items-center gap-3"
                >
                  <div className="p-2 bg-slate-600 rounded-lg">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold">View Results</p>
                    <p className="text-xs opacity-80">Student performance</p>
                  </div>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full p-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-all duration-300 text-left flex items-center gap-3 border border-slate-600/50 hover:border-slate-500/50"
                >
                  <div className="p-2 bg-slate-700 rounded-lg">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Edit Profile</p>
                    <p className="text-xs opacity-80">Update information</p>
                  </div>
                </motion.button>
              </div>
            </motion.div>

            {/* Achievement Badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-xl rounded-2xl border border-yellow-500/30 p-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Excellence Award</h4>
                <p className="text-sm text-yellow-300">Top Performer 2023</p>
                <p className="text-xs text-slate-400 mt-2">Recognized for outstanding contribution to education and student success</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfilePage;
