import { useState } from 'react';
import { motion } from 'framer-motion';
import ChatBox from '../../components/chat/ChatBox';
import * as studyAgentService from '../../services/studyAgentService';

const QUICK_ACTIONS = [
  {
    label: 'Explain Topic',
    prompt: 'Please explain the topic I am currently studying in detail.',
  },
  {
    label: 'Generate Quiz',
    prompt: 'Generate a quiz with 5 questions based on my recent study material.',
  },
  {
    label: 'Create Study Plan',
    prompt: 'Create a personalized study plan for me based on my performance.',
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
      console.log('Study Agent: Raw result:', result);
      const reply = result?.reply || result?.data?.reply || result?.data || 'No response received.';
      console.log('Study Agent: Extracted reply:', reply);
      const agentMsg = { id: `${Date.now()}-agent`, role: 'agent', content: reply };
      setMessages((prev) => [...prev, agentMsg]);
    } catch (err) {
      console.error('Study Agent: Full error:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Unknown error occurred';
      const errMsg = {
        id: `${Date.now()}-err`,
        role: 'agent',
        content: `Sorry, something went wrong: ${errorMessage}`,
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
      transition={{ duration: 0.3 }}
      className="p-6 flex flex-col h-[calc(100vh-4rem)] gap-4"
    >
      <h1 className="text-2xl font-bold text-slate-100 flex-shrink-0">AI Study Agent</h1>

      <div className="glass rounded-xl flex flex-col flex-1 overflow-hidden">
        <ChatBox messages={messages} isLoading={isLoading} />

        <div className="border-t border-slate-700/50 p-4 space-y-3 flex-shrink-0">
          {/* Quick action buttons */}
          <div className="flex flex-wrap gap-2">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                onClick={() => sendMessage(action.prompt)}
                disabled={isLoading}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {action.label}
              </button>
            ))}
          </div>

          {/* Input area */}
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask your study agent anything..."
              disabled={isLoading}
              className="flex-1 bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default AIStudyAgentPage;
