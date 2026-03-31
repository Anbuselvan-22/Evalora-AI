import api from './authService.js'

export const evaluationService = {
  submitEvaluation: async (evaluationId, formData) => {
    const response = await api.post(`/evaluations/${evaluationId}/submit`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  getEvaluation: async (evaluationId) => {
    const response = await api.get(`/evaluations/${evaluationId}`)
    return response.data
  },
}

export default evaluationService
