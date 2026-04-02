import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Debug environment variables
console.log('=== ENV DEBUG ===');
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('VITE_DEV_LOGS:', import.meta.env.VITE_DEV_LOGS);
console.log('==================');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
