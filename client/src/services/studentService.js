import apiClient from './apiClient';

export const getDashboard = async (signal) => {
  const response = await apiClient.get('/student/dashboard', { signal });
  return response.data.data;
};

export const getResults = async (signal) => {
  const response = await apiClient.get('/student/results', { signal });
  return response.data.data;
};

export const getResultById = async (id, signal) => {
  const response = await apiClient.get(`/student/results/${id}`, { signal });
  return response.data.data;
};

export const getAnalytics = async (signal) => {
  const response = await apiClient.get('/student/analytics', { signal });
  return response.data.data;
};
