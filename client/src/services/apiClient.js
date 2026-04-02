import axios from 'axios';

console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor: attach token and check expiry
apiClient.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.baseURL + config.url);
    console.log('Request config:', config);
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
      console.log('✅ API Response:', response);
    }
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      config: error.config,
      response: error.response
    });
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
