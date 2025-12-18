const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function checkTestUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskmanager', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Find the test user
    const testUser = await User.findOne({ email: 'testall@example.com' }).select('+password');
    
    if (!testUser) {
      console.log('Test user not found. Creating test user...');
      
      // Create test user if not exists
      const hashedPassword = await bcrypt.hash('password123', 12);
      const newUser = await User.create({
        name: 'Test User',
        email: 'testall@example.com',
        password: hashedPassword,
        passwordConfirm: hashedPassword,
        active: true
      });
      
      console.log('Test user created:', {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name
      });
    } else {
      console.log('Test user found:', {
        id: testUser._id,
        email: testUser.email,
        name: testUser.name,
        active: testUser.active
      });
      
      // Verify password
      const isPasswordCorrect = await bcrypt.compare('password123', testUser.password);
      console.log('Is password correct?', isPasswordCorrect);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkTestUser();
