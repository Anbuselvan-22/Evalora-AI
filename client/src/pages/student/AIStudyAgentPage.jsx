import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatBox from '../../components/chat/ChatBox';
import * as studyAgentService from '../../services/studyAgentService';
import {
  Bot,
  Send,
  Sparkles,
  Brain,
  BookOpen,
  Target,
  Lightbulb,
  Zap,
  MessageSquare,
  TrendingUp,
  Clock,
  Star,
  ChevronDown,
  Mic,
  MicOff,
  Paperclip,
  Smile,
  Hash
} from 'lucide-react';

const QUICK_ACTIONS = [
  {
    label: 'Explain Topic',
    prompt: 'Can you explain quantum physics in simple terms? I want to understand the basics.',
    icon: Lightbulb,
    color: 'from-yellow-500 to-orange-500',
    description: 'Get clear explanations'
  },
  {
    label: 'Generate Quiz',
    prompt: 'Create a 5-question quiz about algebra with varying difficulty levels.',
    icon: Target,
    color: 'from-blue-500 to-indigo-500',
    description: 'Test your knowledge'
  },
  {
    label: 'Study Plan',
    prompt: 'Help me create a 4-week study plan for my upcoming mathematics exam.',
    icon: BookOpen,
    color: 'from-green-500 to-emerald-500',
    description: 'Organize your learning'
  },
  {
    label: 'Practice Problems',
    prompt: 'Give me 3 practice problems for calculus with step-by-step solutions.',
    icon: Brain,
    color: 'from-purple-500 to-pink-500',
    description: 'Improve your skills'
  },
  {
    label: 'Exam Tips',
    prompt: 'What are the best strategies for preparing for final exams?',
    icon: TrendingUp,
    color: 'from-red-500 to-rose-500',
    description: 'Ace your tests'
  },
  {
    label: 'Concept Review',
    prompt: 'Can you review the main concepts of cellular biology for me?',
    icon: Hash,
    color: 'from-cyan-500 to-teal-500',
    description: 'Quick refresher'
  },
];

const SUGGESTED_PROMPTS = [
  "Explain this like I'm 5 years old",
  "Give me real-world examples",
  "What should I focus on first?",
  "How can I remember this better?",
  "Common mistakes to avoid?",
  "Practice problems for beginners"
];

const AIStudyAgentPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedQuickAction, setSelectedQuickAction] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    questionsAsked: 0,
    conceptsLearned: 0,
    studyTime: 0
  });
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update session stats
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionStats(prev => ({
        ...prev,
        studyTime: prev.studyTime + 1
      }));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg = { 
      id: `${Date.now()}-user`, 
      role: 'user', 
      content: trimmed,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setShowSuggestions(false);
    setIsLoading(true);
    setSelectedQuickAction(null);

    // Update stats
    setSessionStats(prev => ({
      ...prev,
      questionsAsked: prev.questionsAsked + 1
    }));

    try {
      const result = await studyAgentService.sendMessage(trimmed);
      console.log('Study Agent: Raw result:', result);
      const reply = result?.reply || result?.data?.reply || result?.data || 'No response received.';
      console.log('Study Agent: Extracted reply:', reply);
      
      const agentMsg = { 
        id: `${Date.now()}-agent`, 
        role: 'agent', 
        content: reply,
        timestamp: new Date()
      };
      
      // Simulate typing effect
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, agentMsg]);
        
        // Update concepts learned
        setSessionStats(prev => ({
          ...prev,
          conceptsLearned: prev.conceptsLearned + 1
        }));
      }, 1000);
      
    } catch (err) {
      console.error('Study Agent: Full error:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Unknown error occurred';
      const errMsg = {
        id: `${Date.now()}-err`,
        role: 'agent',
        content: `Sorry, something went wrong: ${errorMessage}`,
        timestamp: new Date()
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const handleQuickAction = (action) => {
    setSelectedQuickAction(action.label);
    sendMessage(action.prompt);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Voice recording functionality would go here
  };

  const formatStudyTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

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
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <motion.div
                    className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    AI Study Agent
                  </h1>
                  <p className="text-slate-400 text-sm">Your intelligent learning companion</p>
                </div>
              </div>

              {/* Session Stats */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-slate-400">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm">{sessionStats.questionsAsked}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Star className="w-4 h-4" />
                  <span className="text-sm">{sessionStats.conceptsLearned}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{formatStudyTime(sessionStats.studyTime)}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Sidebar - Quick Actions */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-80 glass-dark border-r border-indigo-500/20 backdrop-blur-xl p-6 overflow-y-auto flex-shrink-0"
          >
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                Quick Actions
              </h2>
              <div className="space-y-3">
                {QUICK_ACTIONS.map((action, index) => (
                  <motion.button
                    key={action.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleQuickAction(action)}
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-4 rounded-xl border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300 ${
                      selectedQuickAction === action.label 
                        ? 'bg-gradient-to-r ' + action.color + ' text-white border-transparent' 
                        : 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-300'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        selectedQuickAction === action.label
                          ? 'bg-white/20'
                          : 'bg-gradient-to-r ' + action.color
                      }`}>
                        <action.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-medium text-sm">{action.label}</h3>
                        <p className="text-xs opacity-70 mt-1">{action.description}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Study Tips */}
            <div className="border-t border-slate-700/50 pt-6">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                Study Tips
              </h3>
              <div className="space-y-2">
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <p className="text-xs text-slate-300">
                    💡 Use specific questions for better answers
                  </p>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <p className="text-xs text-slate-300">
                    🎯 Set clear learning goals
                  </p>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <p className="text-xs text-slate-300">
                    ⏰ Take regular breaks for better retention
                  </p>
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Chat Area */}
          <main className="flex-1 flex flex-col min-h-0">
            {/* Chat Messages */}
            <div className="flex-1 overflow-hidden">
              <ChatBox messages={messages} isLoading={isLoading} isTyping={isTyping} />
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-dark border-t border-indigo-500/20 backdrop-blur-xl p-6 flex-shrink-0"
            >
              {/* Suggestions */}
              <AnimatePresence>
                {showSuggestions && !inputValue && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mb-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50"
                  >
                    <p className="text-sm text-slate-400 mb-3">Try asking:</p>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTED_PROMPTS.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-3 py-1.5 text-xs bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-full transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Quick Actions Bar */}
                <div className="flex items-center gap-2">
                  {QUICK_ACTIONS.slice(0, 4).map((action) => (
                    <button
                      key={action.label}
                      type="button"
                      onClick={() => handleQuickAction(action)}
                      disabled={isLoading}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        selectedQuickAction === action.label
                          ? 'bg-gradient-to-r ' + action.color + ' text-white'
                          : 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      title={action.label}
                    >
                      <action.icon className="w-4 h-4" />
                    </button>
                  ))}
                  
                  <div className="h-6 w-px bg-slate-700/50" />
                  
                  {/* Additional Controls */}
                  <button
                    type="button"
                    onClick={toggleRecording}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      isRecording 
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                        : 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white'
                    }`}
                    title={isRecording ? "Stop recording" : "Start voice recording"}
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                  
                  <button
                    type="button"
                    className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all duration-200"
                    title="Attach file"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all duration-200"
                    title="Add emoji"
                  >
                    <Smile className="w-4 h-4" />
                  </button>
                </div>

                {/* Main Input */}
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => {
                        setInputValue(e.target.value);
                        setShowSuggestions(!e.target.value && messages.length > 0);
                      }}
                      onKeyDown={handleKeyDown}
                      onFocus={() => setShowSuggestions(!inputValue && messages.length > 0)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      placeholder="Ask your study agent anything..."
                      disabled={isLoading}
                      className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 pr-12 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 disabled:opacity-50 transition-all duration-200"
                    />
                    {inputValue && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                      </motion.div>
                    )}
                  </div>
                  
                  <motion.button
                    type="submit"
                    disabled={isLoading || !inputValue.trim()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-indigo-500/25"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Send className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {isLoading ? 'Thinking...' : 'Send'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AIStudyAgentPage;
