import api from './authService.js'

export const studentService = {
  getDashboardStats: async () => {
    const response = await api.get('/student/dashboard')
    return response.data
  },

  getResults: async () => {
    const response = await api.get('/student/results')
    return response.data
  },

  getResultDetail: async (resultId) => {
    const response = await api.get(`/student/results/${resultId}`)
    return response.data
  },

  getAnalytics: async () => {
    const response = await api.get('/student/analytics')
    return response.data
  },
}

export default studentService
