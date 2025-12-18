const express = require('express');
const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

// Create a test app
const app = express();
app.use(express.json());

// Import the auth routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Test user data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  passwordConfirm: 'password123'
};

// Test the registration and login flow
describe('Authentication Flow', () => {
  beforeAll(async () => {
    // Connect to the test database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskmanager_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear the test database
    await User.deleteMany({});
  });

  afterAll(async () => {
    // Disconnect from the test database
    await mongoose.connection.close();
  });

  test('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('success');
    expect(res.body.data.user.email).toBe(testUser.email);
  });

  test('should login the user and return a token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.token).toBeDefined();
  });

  test('should get the user profile with a valid token', async () => {
    // First, login to get a token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    const token = loginRes.body.token;

    // Then, use the token to access the profile
    const profileRes = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(profileRes.statusCode).toBe(200);
    expect(profileRes.body.status).toBe('success');
    expect(profileRes.body.data.user.email).toBe(testUser.email);
  });
});
