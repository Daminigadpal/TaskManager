const express = require('express');
const { register, login, profile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Create a new Express router
const router = express.Router();

// Register route
router.post('/register', async (req, res, next) => {
  try {
    await register(req, res, next);
  } catch (err) {
    next(err);
  }
});

// Login route
router.post('/login', async (req, res, next) => {
  try {
    await login(req, res, next);
  } catch (err) {
    next(err);
  }
});

// Apply protect middleware to all routes below
router.use(protect);

// Profile route (protected)
router.get('/profile', async (req, res, next) => {
  try {
    await profile(req, res, next);
  } catch (err) {
    next(err);
  }
});

module.exports = router;