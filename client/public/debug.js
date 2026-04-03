// Debug script to test API connection
console.log('=== API Debug Script ===');
console.log('Current origin:', window.location.origin);
console.log('API URL should be:', 'http://localhost:5001/api');

// Test basic connectivity
fetch('http://localhost:5001/api/health')
  .then(response => response.json())
  .then(data => console.log('Health check success:', data))
  .catch(error => console.error('Health check failed:', error));

// Test login
fetch('http://localhost:5001/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'teacher@example.com',
    password: 'password123',
    role: 'teacher'
  })
})
  .then(response => response.json())
  .then(data => console.log('Login success:', data))
  .catch(error => console.error('Login failed:', error));
