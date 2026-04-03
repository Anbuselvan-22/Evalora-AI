import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bot, Copy, Check, Clock } from 'lucide-react';

const MessageBubble = ({ role, content, timestamp }) => {
  const [copied, setCopied] = useState(false);
  const isUser = role === 'user';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    const date = new Date(ts);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <motion.div
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.4,
        ease: "easeOut"
      }}
    >
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-gradient-to-br from-indigo-600 to-purple-600' 
          : 'bg-gradient-to-br from-green-600 to-emerald-600'
      }`}>
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex flex-col gap-1 max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Message Header */}
        <div className="flex items-center gap-2 px-1">
          <span className={`text-xs font-medium ${
            isUser ? 'text-indigo-400' : 'text-green-400'
          }`}>
            {isUser ? 'You' : 'AI Study Agent'}
          </span>
          {timestamp && (
            <div className="flex items-center gap-1 text-slate-500">
              <Clock className="w-3 h-3" />
              <span className="text-xs">{formatTime(timestamp)}</span>
            </div>
          )}
        </div>

        {/* Message Bubble */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`relative group px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl rounded-br-none shadow-lg shadow-indigo-500/25'
              : 'bg-slate-800/80 backdrop-blur-sm text-slate-200 rounded-2xl rounded-bl-none border border-slate-700/50 shadow-lg'
          }`}
        >
          {/* Copy Button */}
          <motion.button
            initial={{ opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            onClick={copyToClipboard}
            className={`absolute top-2 ${
              isUser ? 'left-2' : 'right-2'
            } p-1.5 rounded-lg transition-all duration-200 ${
              isUser
                ? 'bg-white/20 hover:bg-white/30 text-white'
                : 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-400'
            } opacity-0 group-hover:opacity-100`}
            title="Copy message"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Check className="w-3 h-3" />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Copy className="w-3 h-3" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Message Content */}
          <div className="whitespace-pre-wrap break-words">
            {content}
          </div>

          {/* Typing Indicator Effect for AI Messages */}
          {!isUser && (
            <motion.div
              className="absolute inset-0 rounded-2xl rounded-bl-none border border-indigo-500/20 pointer-events-none"
              animate={{
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </motion.div>

        {/* Message Status for User Messages */}
        {isUser && (
          <div className="flex items-center gap-1 px-1">
            <div className="w-2 h-2 rounded-full bg-indigo-400" />
            <span className="text-xs text-slate-500">Sent</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MessageBubble;
