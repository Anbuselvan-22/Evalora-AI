import apiClient from './apiClient';

export const submitEvaluation = async (formData) => {
  const response = await apiClient.post('/evaluate', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
};

export const getResults = async (signal) => {
  const response = await apiClient.get('/teacher/results', { signal });
  return response.data.data;
};

export const getResultById = async (id, signal) => {
  const response = await apiClient.get(`/teacher/results/${id}`, { signal });
  return response.data.data;
};
