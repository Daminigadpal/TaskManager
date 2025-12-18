const request = require('supertest');
const app = require('./server');
const User = require('./models/User');
const jwt = require('jsonwebtoken');

// Test user credentials
const TEST_EMAIL = 'testprofile@example.com';
const TEST_PASSWORD = 'test123';

async function testGetProfile() {
  try {
    // 1. Create a test user if it doesn't exist
    let user = await User.findOne({ email: TEST_EMAIL });
    
    if (!user) {
      user = await User.create({
        name: 'Test Profile User',
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        passwordConfirm: TEST_PASSWORD
      });
      console.log('Created test user:', user.email);
    }

    // 2. Login to get a token
    console.log('\nLogging in...');
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      });

    if (loginRes.status !== 200) {
      throw new Error(`Login failed: ${JSON.stringify(loginRes.body)}`);
    }

    const token = loginRes.body.token;
    console.log('Login successful. Token received.');

    // 3. Test GET /api/auth/profile
    console.log('\nTesting GET /api/auth/profile...');
    const profileRes = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`);

    console.log('Profile response status:', profileRes.status);
    console.log('Profile data:', {
      status: profileRes.body.status,
      user: profileRes.body.data?.user?.email || 'No user data'
    });

    if (profileRes.status !== 200) {
      throw new Error(`Profile request failed: ${JSON.stringify(profileRes.body)}`);
    }

    console.log('\n✅ GET /api/auth/profile test passed!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response body:', error.response.body);
    }
    process.exit(1);
  }
}

// Run the test
testGetProfile();
