const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env' });

// Get email from command line argument
const email = process.argv[2];
const passwordToCheck = process.argv[3] || 'password123';

if (!email) {
  console.error('Please provide an email as an argument');
  console.log('Usage: node checkUser.js <email> [password]');
  process.exit(1);
}

const checkUser = async () => {
  try {
    // Connect to MongoDB
    const db = process.env.DATABASE || 'mongodb://127.0.0.1:27017/taskmanager';
    await mongoose.connect(db, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000
    });

    console.log('✅ Connected to MongoDB');

    // Find the user by email with password
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
    
    if (!user) {
      console.error('❌ User not found with email:', email);
    } else {
      console.log('✅ User found:', {
        id: user._id,
        name: user.name,
        email: user.email,
        active: user.active,
        passwordHash: user.password,
        passwordConfirm: user.passwordConfirm
      });

      // Check password
      const isMatch = await bcrypt.compare(passwordToCheck, user.password);
      console.log(`\nPassword check for '${passwordToCheck}': ${isMatch ? '✅ MATCH' : '❌ NO MATCH'}`);
      
      if (!isMatch) {
        console.log('\nTroubleshooting:');
        console.log('1. Make sure you entered the correct password');
        console.log('2. The password in the database might be hashed with a different salt');
        console.log('3. Try registering a new user with the same password to see if it works');
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
    process.exit(0);
  }
};

checkUser();
