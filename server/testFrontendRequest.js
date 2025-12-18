const axios = require('axios');
require('dotenv').config();

async function testTaskCreation() {
  try {
    // First, log in to get a token
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@taskmanager.com',
      password: 'Test@123'
    });

    const token = loginResponse.data.token;
    console.log('Login successful. Token:', token.substring(0, 20) + '...');

    // Now create a task
    const taskData = {
      title: 'Test Task from Frontend',
      description: 'This is a test task from the frontend',
      priority: 'Medium',
      status: 'Pending'
    };

    console.log('Creating task with data:', taskData);
    
    const response = await axios.post('http://localhost:5000/api/tasks', taskData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Task created successfully:', response.data);
  } catch (error) {
    console.error('Error:', {
      message: error.message,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      } : 'No response',
      stack: error.stack
    });
  }
}

testTaskCreation();
