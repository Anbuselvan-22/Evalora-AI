import apiClient from './apiClient';

export const sendMessage = async (message, signal) => {
  const response = await apiClient.post('/study-agent', { message }, { signal });
  return response.data.data;
};
