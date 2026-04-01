import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

const TypingIndicator = () => (
  <div className="flex items-start gap-1 px-4 py-3 bg-slate-800 rounded-2xl rounded-bl-none w-fit">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
        style={{ animationDelay: `${i * 0.15}s` }}
      />
    ))}
  </div>
);

const ChatBox = ({ messages, isLoading }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const isEmpty = (!messages || messages.length === 0) && !isLoading;

  return (
    <div className="flex flex-col gap-4 overflow-y-auto flex-1 px-4 py-4">
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center flex-1 text-center text-slate-500 gap-2 py-16">
          <p className="text-lg font-medium text-slate-400">Hi! I'm your AI Study Agent.</p>
          <p className="text-sm">Ask me anything!</p>
        </div>
      ) : (
        <>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} role={msg.role} content={msg.content} />
          ))}
          {isLoading && (
            <div className="flex flex-col items-start gap-1">
              <span className="text-xs text-slate-500 px-1">AI Agent</span>
              <TypingIndicator />
            </div>
          )}
        </>
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatBox;
