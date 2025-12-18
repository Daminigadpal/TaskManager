const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createTestUser() {
  try {
    await mongoose.connect(process.env.DATABASE);
    console.log('Connected to MongoDB');

    // Delete existing test user if any
    await User.deleteOne({ email: 'test@taskmanager.com' });

    // Create new test user
    const password = 'Test@123';
    const user = new User({
      name: 'Test User',
      email: 'test@taskmanager.com',
      password: password,
      passwordConfirm: password
    });
    
    // Manually hash the password since we're not using the pre-save hook
    await user.createPasswordHash();
    await user.save({ validateBeforeSave: false });

    console.log('Test user created successfully:');
    console.log({
      id: user._id,
      name: user.name,
      email: user.email,
      password: 'Test@123' // Only for testing!
    });

    return user;
  } catch (error) {
    console.error('Error creating test user:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
  }
}

createTestUser();
