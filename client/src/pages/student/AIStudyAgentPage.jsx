import { useState } from 'react';
import { motion } from 'framer-motion';
import ChatBox from '../../components/chat/ChatBox';
import * as studyAgentService from '../../services/studyAgentService';

const QUICK_ACTIONS = [
  {
    label: 'Explain Topic',
    prompt: 'Please explain the topic I am currently studying in detail.',
    icon: '📚',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    label: 'Generate Quiz',
    prompt: 'Generate a quiz with 5 questions based on my recent study material.',
    icon: '📝',
    color: 'from-green-500 to-emerald-500'
  },
  {
    label: 'Create Study Plan',
    prompt: 'Create a personalized study plan for me based on my performance.',
    icon: '📅',
    color: 'from-purple-500 to-pink-500'
  },
];

const AIStudyAgentPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg = { id: `${Date.now()}-user`, role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const result = await studyAgentService.sendMessage(trimmed);
      const reply = result?.reply ?? result ?? 'No response received.';
      const agentMsg = { id: `${Date.now()}-agent`, role: 'agent', content: reply };
      setMessages((prev) => [...prev, agentMsg]);
    } catch (err) {
      const errMsg = {
        id: `${Date.now()}-err`,
        role: 'agent',
        content: `Sorry, something went wrong: ${err.message}`,
      };
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="page-wrapper h-[calc(100vh-4rem)] flex flex-col"
    >
      <div className="dashboard-header">
        <h1 className="dashboard-title">AI Study Agent</h1>
        <p className="text-slate-400 mt-2">Your personal AI tutor for learning and exam preparation</p>
      </div>

      <div className="chat-container flex-1 overflow-hidden">
        <ChatBox messages={messages} isLoading={isLoading} />

        <div className="chat-input-container">
          {/* Quick action buttons */}
          <div className="flex flex-wrap gap-3">
            {QUICK_ACTIONS.map((action, index) => (
              <motion.button
                key={action.label}
                onClick={() => sendMessage(action.prompt)}
                disabled={isLoading}
                className="quick-action-btn"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-2 text-lg">{action.icon}</span>
                {action.label}
              </motion.button>
            ))}
          </div>

          {/* Input area */}
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask your study agent anything..."
                disabled={isLoading}
                className="chat-input pr-12"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <span className="text-2xl animate-pulse opacity-50">✨</span>
              </div>
            </div>
            <motion.button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="chat-send-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Thinking...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Send</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
              )}
            </motion.button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default AIStudyAgentPage;
