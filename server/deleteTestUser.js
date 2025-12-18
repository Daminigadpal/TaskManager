const mongoose = require('mongoose');
const User = require('./models/User');

async function deleteTestUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DATABASE || 'mongodb://127.0.0.1:27017/taskmanager');
    console.log('Connected to MongoDB');

    // Delete the test user
    const result = await User.deleteOne({ email: "test@example.com" });
    
    if (result.deletedCount > 0) {
      console.log('Successfully deleted test user');
    } else {
      console.log('No test user found to delete');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

deleteTestUser();
