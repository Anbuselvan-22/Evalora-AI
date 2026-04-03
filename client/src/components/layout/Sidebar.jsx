import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Upload,
  FileText,
  TrendingUp,
  BarChart3,
  Brain,
  Users,
  Database,
  BookOpen,
  Target,
  Bot,
  GraduationCap,
  Award,
  Activity,
  Menu,
  X,
  Home,
  Settings,
  LogOut,
  AlertTriangle,
} from 'lucide-react';

const TEACHER_LINKS = [
  { 
    label: 'Dashboard', 
    to: '/teacher/dashboard',
    icon: LayoutDashboard,
    description: 'Overview & Stats'
  },
  { 
    label: 'Upload Evaluation', 
    to: '/teacher/upload',
    icon: Upload,
    description: 'Submit New Evaluation'
  },
  { 
    label: 'Results', 
    to: '/teacher/results',
    icon: FileText,
    description: 'View All Results'
  },
];

const STUDENT_LINKS = [
  { 
    label: 'Dashboard', 
    to: '/student/dashboard',
    icon: LayoutDashboard,
    description: 'Performance Overview'
  },
  { 
    label: 'Results', 
    to: '/student/results',
    icon: FileText,
    description: 'Your Results'
  },
  { 
    label: 'Analytics', 
    to: '/student/analytics',
    icon: BarChart3,
    description: 'Performance Analytics'
  },
  { 
    label: 'Focus Session', 
    to: '/student/focus-session',
    icon: Target,
    description: 'Study Sessions'
  },
  { 
    label: 'Study Agent', 
    to: '/student/study-agent',
    icon: Bot,
    description: 'AI Study Helper'
  },
  { 
    label: 'Trainer Agent', 
    to: '/agents/trainer',
    icon: Brain,
    description: 'AI Training'
  },
  { 
    label: 'Parent Agent', 
    to: '/agents/parent',
    icon: Users,
    description: 'Parent Reports'
  },
  { 
    label: 'Memory Agent', 
    to: '/agents/memory',
    icon: Database,
    description: 'Memory Management'
  },
];

const SidebarContent = ({ onClose }) => {
  const { role, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const links = role === 'teacher' ? TEACHER_LINKS : STUDENT_LINKS;

  const handleLogout = () => {
    logout();
    if (onClose) onClose();
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-indigo-500/20">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex items-center gap-3"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-white tracking-tight">
              Evalora <span className="text-indigo-400">AI</span>
            </span>
            <p className="text-xs text-slate-400 mt-0.5">
              {role === 'teacher' ? 'Teacher Portal' : 'Student Portal'}
            </p>
          </div>
        </motion.div>
        {onClose && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            onClick={onClose}
            className="md:hidden text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-700/50"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </motion.button>
        )}
      </div>

      {/* User Profile Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="px-6 py-4 border-b border-slate-700/50"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500">
            <span className="text-white text-sm font-bold">
              {role === 'teacher' ? 'T' : 'S'}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">
              {role === 'teacher' ? 'Teacher' : 'Student'}
            </p>
            <p className="text-xs text-slate-400">Active Now</p>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-green-400">Online</span>
          </div>
        </div>
      </motion.div>

      {/* Nav links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {links.map((link, index) => (
          <motion.div
            key={link.to}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index + 0.4 }}
          >
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                }`
              }
              onClick={onClose}
            >
              <link.icon className="w-5 h-5" />
              <div className="flex-1">
                <p className="font-medium">{link.label}</p>
                <p className="text-xs opacity-70">{link.description}</p>
              </div>
              {link.label === 'Dashboard' && (
                <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* Bottom Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.8 }}
        className="px-4 py-4 border-t border-slate-700/50 space-y-2"
      >
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
        <button 
          onClick={handleLogoutClick}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </motion.div>

      {/* Logout Confirmation Dialog */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setShowLogoutConfirm(false)}
            />
            
            {/* Confirmation Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 glass-dark border border-slate-700/50 rounded-2xl shadow-2xl z-50 p-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                  <LogOut className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Confirm Logout</h3>
                <p className="text-slate-400 mb-6">
                  Are you sure you want to logout? You'll need to sign in again to access your account.
                </p>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-medium transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-all duration-200"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Desktop sidebar — visible by default, hidden when isOpen is false */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside 
            key="desktop-sidebar"
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            exit={{ x: -100 }}
            transition={{ type: 'tween', duration: 0.2, ease: 'easeOut' }}
            className="hidden md:flex flex-col fixed left-0 top-0 h-full w-72 glass-dark z-40 border-r border-indigo-500/20"
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={onClose}
            />

            {/* Drawer */}
            <motion.aside
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.2, ease: 'easeOut' }}
              className="fixed left-0 top-0 h-full w-72 glass-dark z-50 md:hidden flex flex-col border-r border-indigo-500/20"
            >
              <SidebarContent onClose={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
