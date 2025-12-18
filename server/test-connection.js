const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcryptjs');

console.log('Environment Variables:', {
  NODE_ENV: process.env.NODE_ENV,
  DATABASE: process.env.DATABASE ? 'Set' : 'Not set'
});

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(process.env.DATABASE);
    console.log('MongoDB Connected!');

    // Get the users collection
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));

    // Create a test user directly in the database
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: await bcrypt.hash('test123', 12),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('Inserting test user...');
    const result = await usersCollection.insertOne(testUser);
    console.log('Test user inserted with _id:', result.insertedId);

    // Find the test user
    const foundUser = await usersCollection.findOne({ email: 'test@example.com' });
    console.log('Found user in database:', foundUser ? 'Yes' : 'No');
    if (foundUser) {
      console.log('User details:', {
        id: foundUser._id,
        name: foundUser.name,
        email: foundUser.email
      });
    }

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

connectDB();