const request = require('supertest');
const app = require('./server');

const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  passwordConfirm: 'password123'
};

async function testAuthFlow() {
  try {
    // Test registration
    console.log('Testing registration...');
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    console.log('Registration response:', registerRes.body);
    
    // Test login
    console.log('\nTesting login...');
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });
    
    console.log('Login response:', {
      status: loginRes.status,
      token: loginRes.body.token ? 'Token received' : 'No token',
      user: loginRes.body.data?.user?.email || 'No user data'
    });
    
    if (!loginRes.body.token) {
      throw new Error('No token received');
    }
    
    // Test protected route
    console.log('\nTesting protected route...');
    const profileRes = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${loginRes.body.token}`);
    
    console.log('Profile response:', {
      status: profileRes.status,
      user: profileRes.body.data?.user?.email || 'No user data'
    });
    
    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('\nTest failed:', error.message);
    if (error.response) {
      console.error('Response body:', error.response.body);
    }
    process.exit(1);
  }
}

testAuthFlow();
