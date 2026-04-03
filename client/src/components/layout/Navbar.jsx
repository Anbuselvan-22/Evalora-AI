import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import NotificationCenter from '../ui/NotificationCenter';
import * as studentService from '../../services/studentService';
import {
  Menu,
  X,
  Bell,
  Settings,
  LogOut,
  User,
  GraduationCap,
  ChevronDown,
  Sun,
  Moon,
  HelpCircle,
} from 'lucide-react';

const Navbar = ({ onMenuToggle }) => {
  const { user, logout, role } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread count for both students and teachers
  useEffect(() => {
    if (user) {
      fetchUnreadCount();
    }
  }, [role, user, showNotificationCenter]); // Refresh when notification center opens

  const fetchUnreadCount = async () => {
    try {
      // Try to get real unread count
      const count = await studentService.getUnreadNotificationCount(user.id);
      setUnreadCount(count || 0);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
      // Set demo unread count based on role
      setUnreadCount(role === 'teacher' ? 3 : 2);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    
    // Apply theme to document root
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save preference
    localStorage.setItem('evalora-theme-mode', newTheme);
  };

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('evalora-theme-mode');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  return (
    <>
      {/* Main Navbar */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="sticky top-0 z-30 glass-dark border-b border-indigo-500/20 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between px-6 h-16">
          {/* Left: hamburger + logo */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onMenuToggle}
              className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50 hover:bg-slate-700/80 transition-all duration-200"
            >
              <Menu className="w-5 h-5" />
            </motion.button>
            
            {/* Logo */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="flex items-center gap-2"
              onClick={() => navigate('/')}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white hidden md:block">Evalora AI</span>
            </motion.div>
          </div>

          {/* Right: notifications + theme + profile */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Theme Toggle */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-700/50"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>

            {/* Notifications */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowNotificationCenter(!showNotificationCenter);
                  if (!showNotificationCenter) {
                    fetchUnreadCount(); // Refresh count when opening
                  }
                }}
                className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-700/50 relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {(role === 'student' ? unreadCount : notifications) > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                  >
                    {role === 'student' ? unreadCount : notifications}
                  </motion.span>
                )}
              </motion.button>
            </motion.div>

            {/* User Profile Dropdown */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="relative"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:bg-slate-700/80 transition-all duration-200"
              >
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500">
                  <span className="text-white text-xs font-bold">
                    {user?.name?.[0] || user?.email?.[0] || 'U'}
                  </span>
                </div>
                <span className="hidden md:block text-sm text-white font-medium">
                  {user?.name || user?.email}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </motion.button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-12 w-56 glass-dark border border-slate-700/50 rounded-xl shadow-2xl z-40"
                  >
                    <div className="p-2 space-y-1">
                      {/* Profile Header */}
                      <div className="px-3 py-2 border-b border-slate-700/50">
                        <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
                        <p className="text-xs text-slate-400">{user?.email}</p>
                      </div>
                      
                      {/* Menu Items */}
                      <button 
                        onClick={() => {
                          setIsProfileOpen(false);
                          if (role === 'teacher') {
                            navigate('/teacher/profile');
                          } else if (role === 'student') {
                            navigate('/student/profile');
                          }
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200">
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200">
                        <HelpCircle className="w-4 h-4" />
                        <span>Help & Support</span>
                      </button>
                      
                      {/* Logout */}
                      <div className="border-t border-slate-700/50 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Click outside to close dropdown */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-35"
          onClick={() => setIsProfileOpen(false)}
        />
      )}

      {/* Notification Center - Available for both teachers and students */}
      <NotificationCenter
        isOpen={showNotificationCenter}
        onClose={() => setShowNotificationCenter(false)}
        position="top-right"
        userRole={role}
      />
    </>
  );
};

export default Navbar;
