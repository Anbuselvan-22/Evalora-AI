import apiClient from './apiClient';

export const sendMessage = async (message, signal) => {
  console.log('Study Agent: Sending message:', message);
  try {
    const response = await apiClient.post('/agents/study-agent', { message }, { signal });
    console.log('Study Agent: Response:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Study Agent: Error:', error);
    throw error;
  }
};
