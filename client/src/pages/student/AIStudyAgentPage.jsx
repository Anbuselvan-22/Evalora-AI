import React, { useState, useEffect } from 'react'
import studyAgentService from '../../services/studyAgentService.js'
import ChatBox from '../../components/chat/ChatBox.jsx'

const AIStudyAgentPage = () => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const history = await studyAgentService.getChatHistory()
        setMessages(history)
      } catch (error) {
        console.error('Failed to fetch chat history:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchChatHistory()
  }, [])

  const handleSendMessage = async (message) => {
    const userMessage = { text: message, sender: 'user', timestamp: new Date() }
    setMessages(prev => [...prev, userMessage])

    try {
      const response = await studyAgentService.sendMessage(message)
      const botMessage = { 
        text: response.message, 
        sender: 'bot', 
        timestamp: new Date(),
        suggestions: response.suggestions || []
      }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      const errorMessage = { 
        text: 'Sorry, I encountered an error. Please try again.', 
        sender: 'bot', 
        timestamp: new Date() 
      }
      setMessages(prev => [...prev, errorMessage])
    }
  }

  if (loading) {
    return <div className="p-6">Loading AI Study Agent...</div>
  }

  return (
    <div className="p-6 h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">AI Study Agent</h1>
        <p className="text-gray-600">Your personal AI tutor for learning assistance</p>
      </div>
      
      <div className="bg-white rounded-lg shadow h-[calc(100vh-200px)]">
        <ChatBox 
          messages={messages} 
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  )
}

export default AIStudyAgentPage
