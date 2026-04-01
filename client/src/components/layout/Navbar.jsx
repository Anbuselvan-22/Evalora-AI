import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 glass-dark border-b border-indigo-500/20">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Left: hamburger (mobile) + title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="md:hidden text-slate-400 hover:text-white transition-colors p-1"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-lg font-bold text-white tracking-tight">
            Evalora <span className="text-indigo-400">AI</span>
          </span>
        </div>

        {/* Right: user info + logout */}
        <div className="flex items-center gap-4">
          {user && (
            <span className="hidden md:block text-sm text-slate-300 truncate max-w-[200px]">
              {user.name || user.email}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="text-sm px-3 py-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/40 hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
