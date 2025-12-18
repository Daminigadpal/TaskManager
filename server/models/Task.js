// server/models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Ensure a user can't have duplicate task titles
taskSchema.index({ title: 1, userId: 1 }, { unique: true });

// Add a method to safely update task status
taskSchema.methods.updateStatus = async function(newStatus) {
  if (this.status === 'Completed' && newStatus === 'Pending') {
    throw new Error('Cannot change status from Completed to Pending');
  }
  this.status = newStatus;
  return this.save();
};

module.exports = mongoose.model('Task', taskSchema);