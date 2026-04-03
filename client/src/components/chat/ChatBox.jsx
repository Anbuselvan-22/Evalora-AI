import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBubble from './MessageBubble';
import { Bot, User, Sparkles } from 'lucide-react';

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-start gap-3"
  >
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0">
      <Bot className="w-4 h-4 text-white" />
    </div>
    <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl rounded-tl-none px-4 py-3 border border-slate-700/50 shadow-lg">
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-indigo-400"
            animate={{
              y: [0, -4, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  </motion.div>
);

const WelcomeMessage = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="flex flex-col items-center justify-center h-full text-center py-16"
  >
    <motion.div
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/25"
    >
      <Bot className="w-8 h-8 text-white" />
    </motion.div>
    
    <motion.h2
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-2xl font-bold text-white mb-3 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
    >
      Hi! I'm your AI Study Agent
    </motion.h2>
    
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="text-slate-400 text-sm mb-8 max-w-md"
    >
      I'm here to help you learn, explain concepts, create quizzes, and design personalized study plans. Ask me anything!
    </motion.p>
    
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="flex flex-wrap gap-3 justify-center max-w-lg"
    >
      {[
        { icon: "💡", text: "Explain concepts" },
        { icon: "📝", text: "Generate quizzes" },
        { icon: "📚", text: "Create study plans" },
        { icon: "🎯", text: "Practice problems" }
      ].map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 + index * 0.1 }}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-full text-slate-300 text-sm"
        >
          <span>{item.icon}</span>
          <span>{item.text}</span>
        </motion.div>
      ))}
    </motion.div>
    
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
      className="mt-8 flex items-center gap-2 text-slate-500 text-xs"
    >
      <Sparkles className="w-3 h-3" />
      <span>Powered by advanced AI • Personalized to your learning style</span>
    </motion.div>
  </motion.div>
);

const ChatBox = ({ messages, isLoading, isTyping }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isTyping]);

  const isEmpty = (!messages || messages.length === 0) && !isLoading;

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-transparent to-slate-950/20">
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {isEmpty ? (
          <WelcomeMessage />
        ) : (
          <>
            <AnimatePresence>
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ 
                    duration: 0.4,
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                >
                  <MessageBubble 
                    role={msg.role} 
                    content={msg.content} 
                    timestamp={msg.timestamp}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            
            <AnimatePresence>
              {(isLoading || isTyping) && (
                <TypingIndicator />
              )}
            </AnimatePresence>
          </>
        )}
        <div ref={bottomRef} />
      </div>
      
      {/* Date separator for today */}
      {messages.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-6 py-2"
        >
          <div className="flex items-center justify-center">
            <div className="px-3 py-1 bg-slate-800/50 border border-slate-700/50 rounded-full">
              <span className="text-xs text-slate-500">Today</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ChatBox;
