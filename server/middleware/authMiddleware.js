const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('./utils/appError');

/**
 * Middleware to protect routes that require authentication
 */
const protect = async (req, res, next) => {
  try {
    console.log('--- Auth Middleware Debug ---');
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    
    // 1) Get token from header
    let token;
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
      console.log('Token from header:', token);
    } else {
      console.log('No Bearer token found in Authorization header');
    }

    if (!token) {
      console.log('No token provided');
      return next(
        new AppError('You are not logged in! Please log in to get access.', 401)
      );
    }

    // 2) Verify token
    console.log('JWT Secret:', process.env.JWT_SECRET ? 'Exists' : 'Missing!');
    console.log('Verifying token...');
    
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          console.error('JWT Verification Error:', err.message);
          return reject(new AppError('Invalid token. Please log in again!', 401));
        }
        console.log('Token decoded successfully:', decoded);
        resolve(decoded);
      });
    });

    // 3) Check if user still exists
    console.log('Looking for user with ID:', decoded.id);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      console.log('User not found with ID:', decoded.id);
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      console.log('Password was changed after token was issued');
      return next(new AppError('User recently changed password! Please log in again.', 401));
    }

    // 5) GRANT ACCESS TO PROTECTED ROUTE
    console.log('Authentication successful for user:', currentUser.email);
    req.user = currentUser;
    next();
  } catch (err) {
    console.error('Auth Middleware Error:', err);
    next(err);
  }
};

/**
 * Restrict certain routes to specific roles
 * @param {...string} roles - Roles that are allowed to access the route
 * @returns {import('express').RequestHandler}
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

module.exports = { protect, restrictTo };