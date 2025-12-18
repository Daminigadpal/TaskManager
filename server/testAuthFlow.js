const axios = require('axios');

async function testAuthFlow() {
  try {
    // 1. Login
    console.log('Logging in...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@taskmanager.com',
      password: 'Test@123'
    });
    
    const token = loginResponse.data.token;
    console.log('Login successful! Token:', token.substring(0, 20) + '...');
    
    // 2. Fetch tasks
    console.log('\nFetching tasks...');
    const tasksResponse = await axios.get('http://localhost:5000/api/tasks', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('\nTasks retrieved successfully!');
    console.log('Number of tasks:', tasksResponse.data.data.tasks.length);
    console.log('First task (if any):', tasksResponse.data.data.tasks[0] || 'No tasks found');
    
    return { token, tasks: tasksResponse.data.data.tasks };
  } catch (error) {
    console.error('\nError during auth flow:', {
      status: error.response?.status,
      message: error.message,
      response: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: {
          ...error.config?.headers,
          Authorization: error.config?.headers?.Authorization ? 'Bearer [token]' : 'Not set'
        }
      }
    });
    throw error;
  }
}

testAuthFlow().catch(console.error);
