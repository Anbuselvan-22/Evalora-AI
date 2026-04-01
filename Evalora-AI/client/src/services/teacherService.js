import apiClient from './apiClient';

export const getDashboard = async (signal) => {
  const response = await apiClient.get('/teacher/dashboard', { signal });
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
