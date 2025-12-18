const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+@.+\..+/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!'
    }
  },
  passwordChangedAt: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
}, {
  timestamps: true
});

// Hash the password before saving the user
userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  try {
    // Check if password is already hashed (starts with $2a$ or $2b$)
    if (this.password && !this.password.startsWith('$2a$') && !this.password.startsWith('$2b$')) {
      console.log('Hashing password for user:', this.email);
      // Hash the password with cost of 12
      this.password = await bcrypt.hash(this.password, 12);
    }
    
    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    
    // Set passwordChangedAt if the password is being modified (not new)
    if (this.isModified('password') && !this.isNew) {
      this.passwordChangedAt = Date.now() - 1000; // 1 second in the past to ensure token is created after
    }
    
    next();
  } catch (err) {
    console.error('Error hashing password:', err);
    next(err);
  }
});

// Instance method to check if password is correct
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  try {
    return await bcrypt.compare(candidatePassword, userPassword);
  } catch (err) {
    console.error('Error comparing passwords:', err);
    return false;
  }
};

// Instance method to check if password was changed after token was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Query middleware to filter out inactive users by default
userSchema.pre(/^find/, function() {
  // This points to the current query
  this.find({ active: { $ne: false } });
  // Don't call next() as it's not needed in query middleware
});

const User = mongoose.model('User', userSchema);
module.exports = User;