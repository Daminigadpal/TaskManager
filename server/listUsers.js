const mongoose = require('mongoose');
const User = require('./models/User');

async function listUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DATABASE || 'mongodb://127.0.0.1:27017/taskmanager');
    console.log('Connected to MongoDB');

    // Find all users
    const users = await User.find({}).select('-password');
    console.log('Found users:', JSON.stringify(users, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

listUsers();
