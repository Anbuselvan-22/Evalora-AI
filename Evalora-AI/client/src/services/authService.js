import apiClient from './apiClient';

export const login = async (email, password, role) => {
  const response = await apiClient.post('/auth/login', { email, password, role });
  return response.data.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('user');
};
