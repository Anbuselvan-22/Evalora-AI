import { motion } from 'framer-motion';

const MessageBubble = ({ role, content }) => {
  const isUser = role === 'user';

  return (
    <motion.div
      className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}
      initial={{ opacity: 0, x: isUser ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
    >
      <span className="text-xs text-slate-500 px-1">
        {isUser ? 'You' : 'AI Agent'}
      </span>
      <div
        className={`max-w-[75%] px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl rounded-br-none'
            : 'bg-slate-800 text-slate-200 rounded-2xl rounded-bl-none'
        }`}
      >
        {content}
      </div>
    </motion.div>
  );
};

export default MessageBubble;
