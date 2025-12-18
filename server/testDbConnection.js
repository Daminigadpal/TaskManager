const mongoose = require('mongoose');
const Task = require('./models/Task');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

const testConnection = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.DATABASE || 'mongodb://127.0.0.1:27017/taskmanager', {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000
    });
    
    console.log('✅ MongoDB Connected');
    
    // Test Task model
    console.log('\nTesting Task model...');
    const testTask = new Task({
      title: 'Test Task',
      description: 'This is a test task',
      status: 'Pending',
      priority: 'Medium',
      userId: new mongoose.Types.ObjectId() // Random user ID for testing
    });
    
    await testTask.validate();
    console.log('✅ Task model is valid');
    
    // Try to save a test task
    try {
      await testTask.save();
      console.log('✅ Successfully saved test task to database');
      console.log('Test task ID:', testTask._id);
    } catch (saveError) {
      console.error('❌ Error saving test task:', saveError.message);
      if (saveError.errors) {
        console.error('Validation errors:', Object.values(saveError.errors).map(e => e.message));
      }
    }
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
  }
};

testConnection();
