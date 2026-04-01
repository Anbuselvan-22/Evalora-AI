import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const TEACHER_LINKS = [
  { label: 'Dashboard', to: '/teacher/dashboard' },
  { label: 'Upload Evaluation', to: '/teacher/upload' },
  { label: 'Results', to: '/teacher/results' },
  { label: 'Trainer Agent', to: '/agents/trainer' },
  { label: 'Parent Agent', to: '/agents/parent' },
  { label: 'Memory Agent', to: '/agents/memory' },
];

const STUDENT_LINKS = [
  { label: 'Dashboard', to: '/student/dashboard' },
  { label: 'Results', to: '/student/results' },
  { label: 'Analytics', to: '/student/analytics' },
  { label: 'Study Agent', to: '/student/study-agent' },
  { label: 'Trainer Agent', to: '/agents/trainer' },
  { label: 'Parent Agent', to: '/agents/parent' },
  { label: 'Memory Agent', to: '/agents/memory' },
];

const navLinkClass = ({ isActive }) =>
  `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
    isActive
      ? 'bg-indigo-600 text-white'
      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
  }`;

const SidebarContent = ({ onClose }) => {
  const { role } = useAuth();
  const links = role === 'teacher' ? TEACHER_LINKS : STUDENT_LINKS;

  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-indigo-500/20">
        <span className="text-xl font-bold text-white tracking-tight">
          Evalora <span className="text-indigo-400">AI</span>
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden text-slate-400 hover:text-white transition-colors"
            aria-label="Close sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className={navLinkClass} onClick={onClose}>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Desktop sidebar — always visible */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 glass-dark z-40">
        <SidebarContent />
      </aside>

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
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={onClose}
            />

            {/* Drawer */}
            <motion.aside
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed left-0 top-0 h-full w-64 glass-dark z-50 md:hidden flex flex-col"
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
