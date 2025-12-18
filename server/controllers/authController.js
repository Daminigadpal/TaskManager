// @ts-nocheck
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const AppError = require('../middleware/utils/appError');

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('Email already in use', 400));
    }

    // Create user with plain passwords (hashing will be handled by the model)
    const user = await User.create({
      name,
      email: email.trim().toLowerCase(),
      password,
      passwordConfirm
    });

    // Remove sensitive data from output
    user.password = undefined;
    user.passwordConfirm = undefined;

    res.status(201).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    next(err);
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    // 1) Check if email and password exist
    if (!email || !password) {
      console.log('Missing email or password');
      return next(new AppError('Please provide email and password!', 400));
    }

    // 2) Check if user exists
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
    
    if (!user) {
      console.log('No user found with that email');
      return next(new AppError('Incorrect email or password', 401));
    }

    console.log('User found, checking password...');
    
    // 3) Check if password is correct
    const isPasswordCorrect = await user.correctPassword(password, user.password);
    
    if (!isPasswordCorrect) {
      console.log('Incorrect password');
      return next(new AppError('Incorrect email or password', 401));
    }

    console.log('Password correct, generating token...');
    
    // 4) If everything ok, generate token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is not defined in environment variables');
      return next(new AppError('Internal server error', 500));
    }

    const token = jwt.sign(
      { id: user._id },
      jwtSecret,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '90d',
      }
    );

    console.log('Generated token for user:', user._id);
    console.log('Token:', token); // For debugging - remove in production

    // 5) Remove sensitive data from output
    user.password = undefined;
    user.passwordConfirm = undefined;
    user.active = undefined;

    // 6) Send response with token
    const response = {
      status: 'success',
      token: token, // Send token without Bearer prefix
      data: {
        user,
      },
    };
    
    console.log('Login successful for user:', user._id);
    console.log('Token being sent:', token); // For debugging
    
    res.status(200).json(response);
    
  } catch (err) {
    console.error('Login error:', err);
    next(err);
  }
};

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
exports.profile = async (req, res, next) => {
  try {
    // User is already attached to req by the protect middleware
    if (!req.user) {
      return next(new AppError('User not found', 404));
    }

    // Remove sensitive data
    req.user.password = undefined;
    req.user.passwordConfirm = undefined;
    req.user.passwordChangedAt = undefined;
    req.user.active = undefined;

    res.status(200).json({
      status: 'success',
      data: {
        user: req.user
      }
    });
  } catch (err) {
    console.error('Profile error:', err);
    next(err);
  }
};