import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Make sure this is correct
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
API.interceptors.request.use(
  (config) => {
    console.log('Request:', config);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
API.interceptors.response.use(
  (response) => {
    console.log('Response:', response);
    return response;
  },
  (error) => {
    console.error('Response Error:', error);
    return Promise.reject(error);
  }
);

export default API;