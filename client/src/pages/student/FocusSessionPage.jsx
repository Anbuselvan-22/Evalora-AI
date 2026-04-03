import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  Settings,
  Target,
  Clock,
  Flame,
  Brain,
  Coffee,
  CheckCircle,
  Plus,
  X,
  Bell,
  Volume2,
  Award,
  TrendingUp,
  Calendar,
  Zap
} from 'lucide-react';

const FocusSessionPage = () => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [sessionType, setSessionType] = useState('pomodoro'); // pomodoro, short, long
  const [completedSessions, setCompletedSessions] = useState(0);
  const [currentGoal, setCurrentGoal] = useState('');
  const [sessionGoals, setSessionGoals] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [sessionHistory, setSessionHistory] = useState([]);
  const intervalRef = useRef(null);

  const sessionTypes = {
    pomodoro: { 
      duration: 25 * 60, 
      name: 'Pomodoro', 
      icon: Brain, 
      color: 'from-red-500 to-orange-500',
      description: 'Deep focus session'
    },
    short: { 
      duration: 5 * 60, 
      name: 'Short Break', 
      icon: Coffee, 
      color: 'from-green-500 to-emerald-500',
      description: 'Quick refresh'
    },
    long: { 
      duration: 15 * 60, 
      name: 'Long Break', 
      icon: Flame, 
      color: 'from-blue-500 to-cyan-500',
      description: 'Extended rest'
    },
    custom: { 
      duration: 30 * 60, 
      name: 'Custom', 
      icon: Clock, 
      color: 'from-purple-500 to-pink-500',
      description: 'Your duration'
    }
  };

  const currentSessionData = sessionTypes[sessionType];

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft]);

  const handleSessionComplete = () => {
    setIsActive(false);
    setCompletedSessions((prev) => prev + 1);
    
    // Add to session history
    const newSession = {
      id: Date.now(),
      type: sessionType,
      duration: currentSessionData.duration,
      completedAt: new Date(),
      goalsCompleted: sessionGoals.filter(g => g.completed).length
    };
    setSessionHistory(prev => [newSession, ...prev].slice(0, 10)); // Keep last 10 sessions
    
    // Play completion sound
    if (soundEnabled) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    }

    // Show completion notification
    if (notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('Focus Session Complete! 🎉', {
        body: `Great job! You've completed ${sessionType} session. Take a break!`,
        icon: '/favicon.ico'
      });
    }
  };

  const toggleSession = () => {
    if (timeLeft === 0) {
      setTimeLeft(currentSessionData.duration);
    }
    setIsActive(!isActive);
  };

  const resetSession = () => {
    setIsActive(false);
    setTimeLeft(currentSessionData.duration);
  };

  const changeSessionType = (type) => {
    setSessionType(type);
    setTimeLeft(sessionTypes[type].duration);
    setIsActive(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addGoal = () => {
    if (currentGoal.trim()) {
      setSessionGoals([...sessionGoals, { id: Date.now(), text: currentGoal, completed: false }]);
      setCurrentGoal('');
    }
  };

  const toggleGoal = (id) => {
    setSessionGoals(sessionGoals.map(goal => 
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    ));
  };

  const deleteGoal = (id) => {
    setSessionGoals(sessionGoals.filter(goal => goal.id !== id));
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const progress = ((currentSessionData.duration - timeLeft) / currentSessionData.duration) * 100;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const totalFocusTime = sessionHistory
    .filter(s => s.type === 'pomodoro')
    .reduce((total, s) => total + s.duration, 0);

  const todayGoals = sessionHistory.filter(s => 
    new Date(s.completedAt).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 flex flex-col">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl"
          animate={{
            x: [0, 100, 0, -100, 0],
            y: [0, -100, 100, 0, -100],
            scale: [1, 1.2, 1, 0.8, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-purple-600/20 blur-3xl"
          animate={{
            x: [0, -100, 0, 100, 0],
            y: [0, 100, -100, 0, 100],
            scale: [1, 0.8, 1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-dark border-b border-indigo-500/20 backdrop-blur-xl flex-shrink-0"
        >
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="relative"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <motion.div
                    className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Focus Session
                  </h1>
                  <p className="text-slate-400 text-sm">Achieve deep concentration</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setShowStats(!showStats)}
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">{completedSessions}</span>
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Stats & History */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-80 glass-dark border-r border-indigo-500/20 backdrop-blur-xl p-6 flex-shrink-0"
          >
            {/* Session Stats */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-400" />
                Session Stats
              </h2>
              <div className="space-y-3">
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Completed Sessions</span>
                    <span className="text-2xl font-bold text-green-400">{completedSessions}</span>
                  </div>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Total Focus Time</span>
                    <span className="text-xl font-bold text-blue-400">
                      {Math.floor(totalFocusTime / 60)}m
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Today's Sessions</span>
                    <span className="text-xl font-bold text-purple-400">{todayGoals}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Sessions */}
            <div className="border-t border-slate-700/50 pt-6">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                Recent Sessions
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {sessionHistory.length === 0 ? (
                  <p className="text-slate-500 text-xs text-center py-4">No sessions yet</p>
                ) : (
                  sessionHistory.slice(0, 5).map((session) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-300 capitalize">{session.type}</span>
                        <span className="text-xs text-slate-500">
                          {new Date(session.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        <span className="text-xs text-slate-400">
                          {session.goalsCompleted} goals completed
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.aside>

          {/* Main Timer Area */}
          <main className="flex-1 flex flex-col min-h-0">
            {/* Settings Panel */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass-dark border-b border-indigo-500/20 backdrop-blur-xl p-6 flex-shrink-0"
                >
                  <h3 className="text-lg font-semibold text-white mb-4">Session Settings</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {Object.entries(sessionTypes).map(([type, data]) => (
                      <button
                        key={type}
                        onClick={() => changeSessionType(type)}
                        className={`p-4 rounded-xl border transition-all capitalize ${
                          sessionType === type
                            ? 'bg-gradient-to-r ' + data.color + ' text-white border-transparent'
                            : 'border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-700/50'
                        }`}
                      >
                        <data.icon className="w-5 h-5 mb-2 mx-auto" />
                        <div className="text-sm font-medium">{data.name}</div>
                        <div className="text-xs opacity-75">{Math.floor(data.duration / 60)}m</div>
                        <div className="text-xs opacity-60 mt-1">{data.description}</div>
                      </button>
                    ))}
                  </div>
                  
                  {/* Additional Settings */}
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={soundEnabled}
                        onChange={(e) => setSoundEnabled(e.target.checked)}
                        className="w-4 h-4 rounded text-indigo-600"
                      />
                      <Volume2 className="w-4 h-4" />
                      <span className="text-sm">Sound Effects</span>
                    </label>
                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationsEnabled}
                        onChange={(e) => setNotificationsEnabled(e.target.checked)}
                        className="w-4 h-4 rounded text-indigo-600"
                      />
                      <Bell className="w-4 h-4" />
                      <span className="text-sm">Notifications</span>
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Timer */}
            <div className="flex-1 flex items-center justify-center p-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                {/* Session Type */}
                <div className="mb-8">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r rounded-full"
                  >
                    <currentSessionData.icon className="w-5 h-5 text-white" />
                    <span className="text-white font-medium capitalize">{currentSessionData.name}</span>
                  </motion.div>
                  <p className="text-slate-400 text-sm mt-2">{currentSessionData.description}</p>
                </div>

                {/* Progress Ring */}
                <div className="relative w-64 h-64 mx-auto mb-8">
                  <svg className="w-64 h-64 transform -rotate-90">
                    <circle
                      cx="128"
                      cy="128"
                      r="120"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-slate-700"
                    />
                    <motion.circle
                      cx="128"
                      cy="128"
                      r="120"
                      stroke="url(#gradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-linear"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.div
                      key={timeLeft}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-6xl font-bold text-white tabular-nums"
                    >
                      {formatTime(timeLeft)}
                    </motion.div>
                    <div className="text-slate-400 mt-2">
                      {isActive ? 'Stay focused' : 'Ready to start'}
                    </div>
                    {isActive && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="mt-2"
                      >
                        <Zap className="w-4 h-4 text-indigo-400" />
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex justify-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleSession}
                    disabled={isActive && timeLeft === 0}
                    className={`px-8 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                      isActive
                        ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white'
                        : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white'
                    } disabled:opacity-50 disabled:cursor-not-allowed shadow-lg`}
                  >
                    {isActive ? (
                      <>
                        <Pause className="w-4 h-4" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        {timeLeft === 0 ? 'Start New Session' : 'Start'}
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetSession}
                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-all flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </motion.button>
                </div>

                {/* Progress */}
                <div className="mt-6">
                  <div className="flex items-center justify-center gap-4 text-sm">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-indigo-400 font-medium">{Math.floor(progress)}%</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Study Goals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-dark border-t border-indigo-500/20 backdrop-blur-xl p-6 flex-shrink-0"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-400" />
                Study Goals
              </h3>
              
              {/* Add Goal */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={currentGoal}
                  onChange={(e) => setCurrentGoal(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                  placeholder="Add a study goal for this session..."
                  className="flex-1 px-4 py-2 bg-slate-800/60 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addGoal}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </motion.button>
              </div>

              {/* Goals List */}
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {sessionGoals.length === 0 ? (
                  <p className="text-slate-500 text-center py-4 text-sm">No goals yet. Add some to track your progress!</p>
                ) : (
                  sessionGoals.map((goal) => (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg"
                    >
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleGoal(goal.id)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          goal.completed
                            ? 'bg-green-600 border-green-500'
                            : 'border-slate-600 hover:border-slate-500'
                        }`}
                      >
                        {goal.completed && (
                          <CheckCircle className="w-3 h-3 text-white" />
                        )}
                      </motion.button>
                      <span className={`flex-1 text-sm ${goal.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {goal.text}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteGoal(goal.id)}
                        className="text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default FocusSessionPage;
