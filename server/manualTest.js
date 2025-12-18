const axios = require('axios');

// Test user credentials
const TEST_EMAIL = 'testprofile@example.com';
const TEST_PASSWORD = 'test123';
const API_BASE_URL = 'http://localhost:5000/api/auth';

async function testProfile() {
  try {
    // 1. Login to get token
    console.log('Logging in...');
    const loginRes = await axios.post(`${API_BASE_URL}/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    const token = loginRes.data.token;
    console.log('✅ Login successful. Token:', token.substring(0, 20) + '...');

    // 2. Test GET /profile with token
    console.log('\nTesting GET /profile...');
    const profileRes = await axios.get(`${API_BASE_URL}/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Profile response:', {
      status: profileRes.status,
      data: profileRes.data
    });
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testProfile();
