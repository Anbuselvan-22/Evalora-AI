import api from './authService.js'

export const teacherService = {
  getDashboardStats: async () => {
    const response = await api.get('/teacher/dashboard')
    return response.data
  },

  getEvaluations: async () => {
    const response = await api.get('/teacher/evaluations')
    return response.data
  },

  uploadEvaluation: async (formData) => {
    const response = await api.post('/teacher/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  getEvaluationResults: async (evaluationId) => {
    const response = await api.get(`/teacher/evaluations/${evaluationId}/results`)
    return response.data
  },
}

export default teacherService
