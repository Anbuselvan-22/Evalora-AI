import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor: attach token and check expiry
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      // Decode JWT payload and check expiry
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = payload.exp && Date.now() / 1000 > payload.exp;

        if (isExpired) {
          localStorage.clear();
          window.location.href = '/login';
          // Return a rejected promise to abort the request
          return Promise.reject(new Error('Token expired'));
        }
      } catch {
        // If decoding fails, clear and redirect
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(new Error('Invalid token'));
      }

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 and dev logging
apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(response);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
