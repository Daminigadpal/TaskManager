const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env' });

// Get email and new password from command line arguments
const email = process.argv[2];
const newPassword = process.argv[3];

if (!email || !newPassword) {
  console.error('Please provide an email and new password');
  console.log('Usage: node updateUserPassword.js <email> <newPassword>');
  process.exit(1);
}

const updatePassword = async () => {
  try {
    // Connect to MongoDB
    const db = process.env.DATABASE || 'mongodb://127.0.0.1:27017/taskmanager';
    await mongoose.connect(db, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000
    });

    console.log('✅ Connected to MongoDB');

    // Find the user by email
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    
    if (!user) {
      console.error('❌ User not found with email:', email);
    } else {
      console.log('✅ User found, updating password...');
      
      // Hash the password directly
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      
      // Update the user's password directly in the database
      await User.updateOne(
        { _id: user._id },
        { 
          $set: { 
            password: hashedPassword,
            passwordChangedAt: new Date()
          } 
        }
      );
      
      console.log('✅ Password updated successfully for user:', email);
    }
  } catch (error) {
    console.error('❌ Error updating password:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
    process.exit(0);
  }
};

updatePassword();
