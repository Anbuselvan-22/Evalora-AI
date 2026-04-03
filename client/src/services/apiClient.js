import axios from 'axios';

console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('Environment check:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD
});

// Try multiple API URLs for better connectivity
const API_URLS = [
  import.meta.env.VITE_API_URL,
  'http://localhost:5001/api',  // Updated to match server port
  'http://127.0.0.1:5001/api'  // Updated to match server port
];

const apiClient = axios.create({
  baseURL: API_URLS[0], // Primary URL
  timeout: 10000, // 10 second timeout
  withCredentials: true,
});

// Add retry logic for network errors
const createRetryInterceptor = () => {
  let retryCount = 0;
  const maxRetries = 3;
  
  return {
    request: (config) => {
      console.log('🚀 Making request to:', config.baseURL + config.url);
      console.log('📤 Request config:', {
        method: config.method,
        url: config.url,
        baseURL: config.baseURL,
        headers: config.headers,
        data: config.data
      });
      
      const token = localStorage.getItem('token');

      if (token) {
        // Decode JWT payload and check expiry
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const isExpired = payload.exp && Date.now() / 1000 > payload.exp;

          if (isExpired) {
            console.log('⏰ Token expired, clearing and redirecting');
            localStorage.clear();
            window.location.href = '/login';
            return Promise.reject(new Error('Token expired'));
          }
        } catch (error) {
          console.log('❌ Token decode error:', error);
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(new Error('Invalid token'));
        }

        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    
    requestError: (error) => {
      console.error('❌ Request interceptor error:', error);
      return Promise.reject(error);
    },
    
    response: (response) => {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data
      });
      retryCount = 0; // Reset retry count on success
      return response;
    },
    
    responseError: async (error) => {
      console.error('❌ API Error:', error);
      console.error('📊 Error details:', {
        message: error.message,
        code: error.code,
        config: error.config,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Retry logic for network errors
      if ((error.code === 'ECONNREFUSED' || error.code === 'NETWORK_ERROR' || !error.response) && retryCount < maxRetries) {
        retryCount++;
        console.log(`🔄 Retrying request (${retryCount}/${maxRetries}) with different URL...`);
        
        // Try next API URL
        const nextUrlIndex = retryCount % API_URLS.length;
        const nextUrl = API_URLS[nextUrlIndex];
        
        console.log(`🌐 Trying URL: ${nextUrl}`);
        
        // Create new config with updated baseURL
        const retryConfig = {
          ...error.config,
          baseURL: nextUrl,
        };
        
        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return apiClient.request(retryConfig);
      }
      
      if (error.code === 'ECONNREFUSED') {
        console.error('🔌 Connection refused - is the backend server running?');
      }
      
      if (error.code === 'NETWORK_ERROR') {
        console.error('🌐 Network error - check CORS and server status');
      }
      
      if (error.response?.status === 401) {
        console.log('🔐 401 Unauthorized - clearing credentials');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      return Promise.reject(error);
    }
  };
};

const interceptor = createRetryInterceptor();

apiClient.interceptors.request.use(interceptor.request, interceptor.requestError);
apiClient.interceptors.response.use(interceptor.response, interceptor.responseError);

export default apiClient;
