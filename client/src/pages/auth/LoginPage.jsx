import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as authService from '../../services/authService';
import { useAuth } from '../../context/AuthContext';


const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const data = await authService.login(email, password, role);
      login(data.token, data.role, data.user);
      navigate(data.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard');
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Login failed. Please check your credentials and try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-amber-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-orange-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-0 right-20 w-72 h-72 bg-amber-700 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-6000"></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-full max-w-md rounded-3xl border border-gray-200 bg-white shadow-2xl p-8 hover:shadow-3xl transition-shadow duration-500"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-amber-500/10 opacity-0 hover:opacity-100 transition-opacity duration-500 blur-lg"></div>
        
        {/* Branding */}
        <div className="relative mb-8 text-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-4 shadow-lg shadow-indigo-500/25"
          >
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-900 to-amber-700 tracking-tight"
          >
            Evalora AI
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-gray-600 text-sm mt-2"
          >
            Welcome back. Sign in to continue
          </motion.p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="relative space-y-6">
          {/* Role toggle */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <label className="block text-xs font-medium text-gray-700 mb-3 uppercase tracking-wider">
              Select Your Role
            </label>
            <div className="flex rounded-xl overflow-hidden border border-gray-300 bg-gray-50 backdrop-blur-sm p-1">
              {['student', 'teacher'].map((r) => (
                <motion.button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-3 text-sm font-medium transition-all duration-300 capitalize rounded-lg
                    ${role === r
                      ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-600/25'
                      : 'text-gray-700 hover:text-amber-900 hover:bg-gray-100'
                    }`}
                  whileHover={{ scale: role === r ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {r === 'student' ? '🎓 Student' : '👨‍🏫 Teacher'}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Email */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur"></div>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                disabled={loading}
              />
            </div>
          </motion.div>

          {/* Password */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wider">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur"></div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                disabled={loading}
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle-button absolute right-3 top-1/2 transform -translate-y-1/2 w-10 h-10 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-all duration-200 flex items-center justify-center"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl opacity-20 blur"></div>
              <p className="relative text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 backdrop-blur-sm">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </span>
              </p>
            </motion.div>
          )}

          {/* Submit button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <motion.button
              type="submit"
              disabled={loading}
              className="relative w-full py-4 text-base font-semibold rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <motion.span
                      className="inline-block w-5 h-5 rounded-full border-2 border-white border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                    />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </span>
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
