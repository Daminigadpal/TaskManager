const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Task = require('./models/Task');

// Load environment variables
dotenv.config({ path: '.env' });

// Using the first test user's ID
const TEST_USER_ID = '6943d036a5db40cfa357dbf8';

async function testTaskInsertion() {
  try {
    // Connect to MongoDB
    const connectionString = process.env.DATABASE || 'mongodb://127.0.0.1:27017/taskmanager';
    console.log('Connecting to MongoDB at:', connectionString);
    
    await mongoose.connect(connectionString);
    console.log('✅ Connected to MongoDB');

    // Create a test task
    const testTask = {
      title: 'Test Task ' + new Date().toISOString(),
      description: 'This is a test task',
      status: 'Pending',
      priority: 'Medium',
      userId: new mongoose.Types.ObjectId(TEST_USER_ID)
    };

    console.log('Attempting to insert test task:', testTask);

    // Insert the task
    const task = await Task.create(testTask);
    console.log('✅ Task inserted successfully:', task);

    // Verify the task was saved
    const foundTask = await Task.findById(task._id);
    console.log('✅ Found task in database:', foundTask);

    // Count all tasks for this user
    const taskCount = await Task.countDocuments({ userId: TEST_USER_ID });
    console.log(`✅ Total tasks for user: ${taskCount}`);

  } catch (error) {
    console.error('❌ Error:', error);
    if (error.name === 'ValidationError') {
      console.error('Validation Errors:', Object.values(error.errors).map(e => e.message));
    }
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the test
console.log('Starting test task insertion...');
testTaskInsertion();
