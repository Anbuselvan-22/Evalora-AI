import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as authService from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { Eye, EyeOff, Mail, Lock, User, BookOpen, Sparkles, AlertCircle, CheckCircle, Globe, Code, Wifi, WifiOff } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isOnline, apiStatus } = useNetworkStatus();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  // Check for saved credentials on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedRole = localStorage.getItem('rememberedRole');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
    if (savedRole) {
      setRole(savedRole);
    }
    setIsFirstVisit(false);
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEmailError('');
    setPasswordError('');

    // Enhanced validation
    let hasError = false;
    
    if (!email.trim()) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      hasError = true;
    } else if (!validatePassword(password)) {
      setPasswordError('Password must be at least 6 characters');
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);
    try {
      const data = await authService.login(email, password, role);
      
      // Save credentials if remember me is checked
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedRole', role);
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedRole');
      }
      
      login(data.token, data.role, data.user);
      
      // Add success animation
      setLoginAttempts(0);
      
      // Navigate with a slight delay for animation
      setTimeout(() => {
        navigate(data.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard');
      }, 300);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Login failed. Please check your credentials and try again.';
      
      // Better error handling for network issues
      if (err.code === 'ECONNREFUSED' || err.code === 'NETWORK_ERROR') {
        setError('Network connection failed. Please check if the server is running and try again.');
      } else if (!isOnline) {
        setError('You appear to be offline. Please check your internet connection.');
      } else if (apiStatus !== 'online') {
        setError('Server is currently unavailable. Please try again in a few moments.');
      } else {
        setError(message);
      }
      
      setLoginAttempts(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  const getQuickLogin = (userRole, userEmail, userPassword) => {
    setEmail(userEmail);
    setPassword(userPassword);
    setRole(userRole);
    setEmailError('');
    setPasswordError('');
    setError('');
  };

  const handleSocialLogin = (provider) => {
    // Placeholder for social login functionality
    console.log(`Logging in with ${provider}`);
    // This would integrate with OAuth providers
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 px-4 relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl"
          animate={{
            x: [0, 100, 0, -100, 0],
            y: [0, -100, 100, 0, -100],
            scale: [1, 1.2, 1, 0.8, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ top: '10%', left: '10%' }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-purple-600/20 blur-3xl"
          animate={{
            x: [0, -100, 0, 100, 0],
            y: [0, 100, -100, 0, 100],
            scale: [1, 0.8, 1.2, 1, 0.9],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ bottom: '10%', right: '10%' }}
        />
        <motion.div
          className="absolute w-64 h-64 rounded-full bg-pink-600/10 blur-2xl"
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -50, 50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        />
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 100 - 50, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${10 + Math.random() * 80}%`,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Main login card with enhanced glassmorphism */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl p-8 relative overflow-hidden">
            {/* Animated border effect */}
            <motion.div
              className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 opacity-0"
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ filter: 'blur(20px)' }}
            />
            
            {/* Branding with enhanced animation */}
            <div className="mb-8 text-center relative z-10">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 mb-6 shadow-2xl shadow-purple-500/25"
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent tracking-tight"
              >
                Evalora AI
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-slate-400 text-sm mt-3"
              >
                {isFirstVisit ? 'Welcome to the future of education!' : 'Welcome back! Sign in to continue'}
              </motion.p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-6 relative z-10">
              {/* Enhanced role selector */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-4 uppercase tracking-wider">
                  Select Your Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['student', 'teacher'].map((r) => (
                    <motion.button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative py-4 px-4 rounded-2xl text-sm font-medium transition-all duration-300 capitalize overflow-hidden group
                        ${role === r
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/30 border border-indigo-400/30'
                          : 'bg-slate-800/40 text-slate-400 hover:bg-slate-700/40 border border-slate-600/50 hover:border-slate-500/50'
                        }`}
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <motion.div
                          animate={{ rotate: role === r ? 360 : 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          {r === 'student' ? (
                            <BookOpen className="w-5 h-5" />
                          ) : (
                            <User className="w-5 h-5" />
                          )}
                        </motion.div>
                        <span className="font-semibold">{r === 'student' ? 'Student' : 'Teacher'}</span>
                      </div>
                      {role === r && (
                        <motion.div
                          layoutId="roleIndicator"
                          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 -z-10"
                          initial={false}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      {/* Hover effect */}
                      <motion.div
                        className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                      />
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Enhanced email field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2 uppercase tracking-wider">
                  Email Address
                </label>
                <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'transform scale-105' : ''}`}>
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className={`w-5 h-5 transition-colors duration-200 ${
                      emailError ? 'text-red-400' : focusedField === 'email' ? 'text-indigo-400' : 'text-slate-400'
                    }`} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError('');
                      if (error) setError('');
                    }}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full pl-12 pr-4 py-4 bg-slate-800/40 border rounded-2xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      emailError 
                        ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500' 
                        : focusedField === 'email'
                        ? 'border-indigo-500/50 focus:ring-indigo-500/50 focus:border-indigo-500 bg-slate-800/60'
                        : 'border-slate-600/50 focus:border-slate-500'
                    }`}
                    disabled={loading}
                  />
                  {email && !emailError && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    >
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </motion.div>
                  )}
                </div>
                <AnimatePresence>
                  {emailError && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-2 text-sm text-red-400 flex items-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {emailError}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Enhanced password field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'transform scale-105' : ''}`}>
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className={`w-5 h-5 transition-colors duration-200 ${
                      passwordError ? 'text-red-400' : focusedField === 'password' ? 'text-indigo-400' : 'text-slate-400'
                    }`} />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError('');
                      if (error) setError('');
                    }}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full pl-12 pr-14 py-4 bg-slate-800/40 border rounded-2xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      passwordError 
                        ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500' 
                        : focusedField === 'password'
                        ? 'border-indigo-500/50 focus:ring-indigo-500/50 focus:border-indigo-500 bg-slate-800/60'
                        : 'border-slate-600/50 focus:border-slate-500'
                    }`}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    disabled={loading}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-slate-400 hover:text-slate-200 transition-colors duration-200"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </motion.div>
                  </button>
                </div>
                <AnimatePresence>
                  {passwordError && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-2 text-sm text-red-400 flex items-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {passwordError}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Remember me checkbox */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.65 }}
                className="flex items-center"
              >
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 bg-slate-800/40 border-slate-600 rounded focus:ring-indigo-500 focus:ring-2"
                  disabled={loading}
                />
                <label htmlFor="remember" className="ml-2 text-sm text-slate-300 cursor-pointer">
                  Remember my credentials
                </label>
              </motion.div>

              {/* Enhanced error message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 backdrop-blur-sm"
                  >
                    <div className="flex items-start gap-3">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                      >
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      </motion.div>
                      <div className="flex-1">
                        <p className="text-sm text-red-400 font-medium">{error}</p>
                        {loginAttempts > 2 && (
                          <p className="text-xs text-red-300 mt-1">
                            Having trouble? Try the demo accounts below.
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Enhanced submit button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12"
                  animate={{ x: loading ? '0%' : '-100%', opacity: loading ? 0 : 1 }}
                  transition={{ duration: 1.5, repeat: loading ? 0 : Infinity, ease: 'linear' }}
                />
                {loading ? (
                  <span className="flex items-center justify-center gap-3 relative z-10">
                    <motion.span
                      className="inline-block w-6 h-6 rounded-full border-2 border-white border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                    />
                    <span className="font-semibold">Authenticating...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3 relative z-10">
                    <Sparkles className="w-5 h-5" />
                    <span className="font-semibold">Sign In</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </motion.div>
                  </span>
                )}
              </motion.button>
            </form>

            {/* Enhanced quick login options */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="text-center mb-6">
                <p className="text-sm text-slate-300 uppercase tracking-wider font-medium">Quick Access</p>
                <p className="text-xs text-slate-400 mt-1">Demo accounts for testing</p>
              </div>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => getQuickLogin('teacher', 'teacher@example.com', 'password123')}
                  className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 border border-indigo-500/30 hover:border-indigo-500/50 rounded-2xl text-sm text-indigo-300 hover:text-indigo-200 transition-all duration-300 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Teacher Account</p>
                      <p className="text-xs opacity-70">Full access to all features</p>
                    </div>
                  </div>
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => getQuickLogin('student', 'alexjohnson@example.com', 'temp123')}
                  className="w-full py-3 px-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-500/30 hover:border-green-500/50 rounded-2xl text-sm text-green-300 hover:text-green-200 transition-all duration-300 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Student Account</p>
                      <p className="text-xs opacity-70">View evaluations and results</p>
                    </div>
                  </div>
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </div>
              
              {/* Social login options */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-transparent text-slate-400">Or continue with</span>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSocialLogin('Google')}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800/40 hover:bg-slate-700/40 border border-slate-600/50 hover:border-slate-500/50 rounded-xl text-slate-300 hover:text-white transition-all duration-300"
                  >
                    <Globe className="w-4 h-4" />
                    <span className="text-sm font-medium">Google</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSocialLogin('GitHub')}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800/40 hover:bg-slate-700/40 border border-slate-600/50 hover:border-slate-500/50 rounded-xl text-slate-300 hover:text-white transition-all duration-300"
                  >
                    <Code className="w-4 h-4" />
                    <span className="text-sm font-medium">GitHub</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center space-y-3"
          >
            <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
              <span>© 2024 Evalora AI</span>
              <span>•</span>
              <span>Powered by Advanced AI</span>
            </div>
            <div className="flex items-center justify-center gap-6 text-xs">
              <Link to="/privacy" className="text-slate-400 hover:text-slate-300 transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-slate-400 hover:text-slate-300 transition-colors duration-200">
                Terms of Service
              </Link>
              <Link to="/support" className="text-slate-400 hover:text-slate-300 transition-colors duration-200">
                Support
              </Link>
            </div>
          </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
