const axios = require('axios');
require('dotenv').config();

async function testLogin() {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'goadeanuj@gmail.com',
      password: 'Anuj@123'
    });
    
    console.log('Login successful!');
    console.log('Token:', response.data.token);
    console.log('User:', response.data.data.user);
    
    return response.data.token;
  } catch (error) {
    console.error('Login failed:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
}

testLogin();
