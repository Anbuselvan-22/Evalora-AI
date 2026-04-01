import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const FloatingNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { label: 'Features', to: '/features' },
    { label: 'Developer', to: '/developer' },
    { label: 'Card', to: '/card' },
  ];

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 px-8 py-4 min-w-[700px]">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Evalora</h1>
            <p className="text-xs text-gray-500 font-medium">AI Education Platform</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-semibold transition-all duration-200 px-4 py-2 rounded-lg ${
                  isActive
                    ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          
          {/* Conditional links based on user role */}
          {user && (
            <>
              <NavLink
                to={user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'}
                className={({ isActive }) =>
                  `text-sm font-semibold transition-all duration-200 px-4 py-2 rounded-lg ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`
                }
              >
                Dashboard
              </NavLink>
              
              <NavLink
                to={user.role === 'teacher' ? '/teacher/results' : '/student/results'}
                className={({ isActive }) =>
                  `text-sm font-semibold transition-all duration-200 px-4 py-2 rounded-lg ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`
                }
              >
                Results
              </NavLink>
              
              {user.role === 'student' && (
                <NavLink
                  to="/student/study-agent"
                  className={({ isActive }) =>
                    `text-sm font-semibold transition-all duration-200 px-4 py-2 rounded-lg ${
                      isActive
                        ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`
                  }
                >
                  Study Agent
                </NavLink>
              )}
            </>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* User Info */}
          {user && (
            <div className="hidden lg:block">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{user.name || user.email}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
          )}

          {/* Connect Button */}
          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors px-4 py-2 rounded-lg border border-gray-200 hover:border-red-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4 4m4-4H3m6 4h9" />
              </svg>
              Logout
            </button>
          ) : (
            <button className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              Connect Wallet
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 lg:hidden">
          <div className="space-y-2">
            <div className="pb-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Evalora</h2>
                  <p className="text-xs text-gray-500">AI Education Platform</p>
                </div>
              </div>
            </div>
            
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `block text-sm font-medium transition-colors px-4 py-3 rounded-lg ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            
            {user && (
              <>
                <NavLink
                  to={user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `block text-sm font-medium transition-colors px-4 py-3 rounded-lg ${
                      isActive
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`
                  }
                >
                  Dashboard
                </NavLink>
                
                <NavLink
                  to={user.role === 'teacher' ? '/teacher/results' : '/student/results'}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `block text-sm font-medium transition-colors px-4 py-3 rounded-lg ${
                      isActive
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`
                  }
                >
                  Results
                </NavLink>
                
                {user.role === 'student' && (
                  <NavLink
                    to="/student/study-agent"
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `block text-sm font-medium transition-colors px-4 py-3 rounded-lg ${
                        isActive
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`
                    }
                  >
                    Study Agent
                  </NavLink>
                )}
                
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors px-4 py-3 rounded-lg text-left w-full"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4 4m4-4H3m6 4h9" />
                  </svg>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default FloatingNavbar;
