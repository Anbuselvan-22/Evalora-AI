import React from 'react'

const MessageBubble = ({ message }) => {
  const isUser = message.sender === 'user'
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isUser
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-200 text-gray-800'
        }`}
      >
        <p className="text-sm">{message.text}</p>
        
        {message.suggestions && message.suggestions.length > 0 && (
          <div className="mt-2 space-y-1">
            {message.suggestions.map((suggestion, index) => (
              <div key={index} className="text-xs opacity-75">
                💡 {suggestion}
              </div>
            ))}
          </div>
        )}
        
        <p className="text-xs mt-1 opacity-75">
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  )
}

export default MessageBubble
