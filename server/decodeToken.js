const jwt = require('jsonwebtoken');
require('dotenv').config();

// Extract token from command line or use the one from the logs
const token = process.argv[2] || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1OGYxYjJmZDA3Y2U5Y2Q2YzE4Y2U1YyIsImlhdCI6MTcxMzY5MDAzMCwiZXhwIjoxNzE2MjgyMDMwfQ.mhuDX_sXxhjT2yAztRY4lVuSkIVir9FiQ63iFR1aOxY';

if (!token) {
  console.error('Please provide a JWT token');
  process.exit(1);
}

try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'taskmanager_secure_key_2025_!@#$%^&*()');
  console.log('Decoded token:', JSON.stringify(decoded, null, 2));
  console.log('User ID:', decoded.id);
  
  // Now check if this user exists in the database
  console.log('\nTo check if this user exists, run:');
  console.log(`node checkUser.js ${decoded.id}`);
  
} catch (error) {
  console.error('Error decoding token:', error.message);
}
