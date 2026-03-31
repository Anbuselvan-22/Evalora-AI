import api from './authService.js'

export const studyAgentService = {
  sendMessage: async (message) => {
    const response = await api.post('/student/chat', { message })
    return response.data
  },

  getChatHistory: async () => {
    const response = await api.get('/student/chat/history')
    return response.data
  },
}

export default studyAgentService
