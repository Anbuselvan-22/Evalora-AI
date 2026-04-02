import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const FocusSessionPage = () => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [sessionType, setSessionType] = useState('pomodoro'); // pomodoro, short, long
  const [completedSessions, setCompletedSessions] = useState(0);
  const [currentGoal, setCurrentGoal] = useState('');
  const [sessionGoals, setSessionGoals] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef(null);

  const sessionDurations = {
    pomodoro: 25 * 60,    // 25 minutes
    short: 5 * 60,        // 5 minutes
    long: 15 * 60,        // 15 minutes
    custom: 30 * 60       // 30 minutes
  };

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
    
    // Play completion sound (using Web Audio API)
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

    // Show completion notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Focus Session Complete! 🎉', {
        body: `Great job! You've completed ${sessionType} session. Take a break!`,
        icon: '/favicon.ico'
      });
    }
  };

  const toggleSession = () => {
    if (timeLeft === 0) {
      // Reset timer for new session
      setTimeLeft(sessionDurations[sessionType]);
    }
    setIsActive(!isActive);
  };

  const resetSession = () => {
    setIsActive(false);
    setTimeLeft(sessionDurations[sessionType]);
  };

  const changeSessionType = (type) => {
    setSessionType(type);
    setTimeLeft(sessionDurations[type]);
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

  const progress = ((sessionDurations[sessionType] - timeLeft) / sessionDurations[sessionType]) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 space-y-8"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-100">Focus Session</h1>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 glass rounded-lg hover:bg-slate-700/50 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="glass rounded-xl p-6 space-y-4"
        >
          <h3 className="text-lg font-semibold text-slate-200">Session Settings</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(sessionDurations).map(([type, duration]) => (
              <button
                key={type}
                onClick={() => changeSessionType(type)}
                className={`p-3 rounded-lg border transition-all capitalize ${
                  sessionType === type
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-700/50'
                }`}
              >
                <div className="text-sm font-medium">{type}</div>
                <div className="text-xs opacity-75">{Math.floor(duration / 60)}m</div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Main Timer */}
      <div className="glass rounded-xl p-8 text-center">
        <div className="mb-6">
          <div className="text-sm text-slate-400 mb-2">Current Session</div>
          <div className="text-2xl font-bold text-indigo-400 capitalize">{sessionType}</div>
        </div>

        {/* Progress Ring */}
        <div className="relative w-48 h-48 mx-auto mb-6">
          <svg className="w-48 h-48 transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-slate-700"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 88}`}
              strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
              className="text-indigo-500 transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-5xl font-bold text-slate-100">{formatTime(timeLeft)}</div>
            <div className="text-sm text-slate-400 mt-1">
              {isActive ? 'Focus Time' : 'Ready to Start'}
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={toggleSession}
            disabled={isActive && timeLeft === 0}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              isActive
                ? 'bg-red-600 hover:bg-red-500 text-white'
                : 'bg-green-600 hover:bg-green-500 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isActive ? 'Pause' : timeLeft === 0 ? 'Start New Session' : 'Start'}
          </button>
          <button
            onClick={resetSession}
            className="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white rounded-xl font-medium transition-all"
          >
            Reset
          </button>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{completedSessions}</div>
            <div className="text-xs text-slate-400">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{Math.floor(progress)}%</div>
            <div className="text-xs text-slate-400">Progress</div>
          </div>
        </div>
      </div>

      {/* Study Goals */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">Study Goals</h3>
        
        {/* Add Goal */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={currentGoal}
            onChange={(e) => setCurrentGoal(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addGoal()}
            placeholder="Add a study goal..."
            className="flex-1 px-4 py-2 bg-slate-800/60 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
          <button
            onClick={addGoal}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-all"
          >
            Add
          </button>
        </div>

        {/* Goals List */}
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {sessionGoals.length === 0 ? (
            <p className="text-slate-400 text-center py-4">No goals yet. Add some to track your progress!</p>
          ) : (
            sessionGoals.map((goal) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg"
              >
                <button
                  onClick={() => toggleGoal(goal.id)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    goal.completed
                      ? 'bg-green-600 border-green-500'
                      : 'border-slate-600 hover:border-slate-500'
                  }`}
                >
                  {goal.completed && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                <span className={`flex-1 ${goal.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                  {goal.text}
                </span>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="text-slate-400 hover:text-red-400 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Motivational Quote */}
      <div className="glass rounded-xl p-6 text-center">
        <div className="text-lg text-indigo-300 italic">
          "Focus on being productive instead of busy."
        </div>
        <div className="text-sm text-slate-400 mt-2">— Tim Ferriss</div>
      </div>
    </motion.div>
  );
};

export default FocusSessionPage;
