// server/controllers/taskController.js
const Task = require('../models/Task');
const AppError = require('../middleware/utils/appError');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res, next) => {
  try {
    console.log('=== CREATE TASK REQUEST ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Request user:', req.user ? {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    } : 'No user in request');
    
    // Check if user is authenticated
    if (!req.user || !req.user.id) {
      console.error('❌ No authenticated user found in request');
      console.error('Available request properties:', Object.keys(req));
      return next(new AppError('Authentication required', 401));
    }
    
    const { title, description, priority, status } = req.body;
    
    if (!title) {
      console.error('Title is required');
      return next(new AppError('Title is required', 400));
    }

    // Create task
    const task = await Task.create({
      title,
      description: description || '',
      priority: priority || 'Medium',
      status: status || 'Pending',
      userId: req.user.id
    });

    console.log('Task created successfully:', task);
    
    res.status(201).json({
      status: 'success',
      data: {
        task
      }
    });
  } catch (error) {
    console.error('❌ Error in createTask:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: error.code,
      keyValue: error.keyValue,
      errors: error.errors || undefined,
      requestBody: req.body,
      requestUser: req.user,
      requestHeaders: req.headers,
      requestMethod: req.method,
      requestUrl: req.originalUrl,
      timestamp: new Date().toISOString()
    });
    
    // If this is a validation error, log the full error details
    if (error.name === 'ValidationError') {
      console.error('🔍 Validation Error Details:', error);
    }
    
    // Type guard to check if error is a Mongoose validation error
    if (error.name === 'ValidationError' && 'errors' in error) {
      const messages = Object.entries(error.errors).map(([field, err]) => {
        return `${field}: ${err.message}`;
      });
      return next(new AppError(`Validation error: ${messages.join('. ')}`, 400));
    }
    
    // Check for duplicate key error
    if (error.code === 11000) {
      return next(new AppError(
        `A task with the title "${error.keyValue?.title || 'unknown'}" already exists`, 
        400
      ));
    }
    
    // Handle other types of errors
    next(new AppError(
      `Failed to create task: ${error.message || 'An unknown error occurred'}`,
      500
    ));
  }
};

// @desc    Get all tasks for logged in user
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res, next) => {
  try {
    console.log('getTasks called with user ID:', req.user?.id);
    
    const { status, search } = req.query;
    
    // Build query
    const query = { 
      userId: req.user.id,
      isDeleted: false 
    };

    console.log('Base query:', query);

    // Filter by status
    if (status) {
      query.status = status;
      console.log('Added status filter:', status);
    }

    // Search by title
    if (search) {
      query.title = { $regex: search, $options: 'i' };
      console.log('Added search filter:', search);
    }

    console.log('Final query:', JSON.stringify(query, null, 2));

    // Execute query
    const tasks = await Task.find(query)
      .sort({ 
        priority: -1, // High to Low
        createdAt: -1 // Newest first
      });

    console.log(`Found ${tasks.length} tasks`);
    
    res.status(200).json({
      status: 'success',
      results: tasks.length,
      data: {
        tasks
      }
    });
  } catch (err) {
    console.error('Error in getTasks:', {
      message: err.message,
      stack: err.stack,
      name: err.name,
      code: err.code,
      keyPattern: err.keyPattern,
      keyValue: err.keyValue,
      errors: err.errors
    });
    next(err);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user.id,
      isDeleted: false
    });

    if (!task) {
      return next(new AppError('No task found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        task
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
  try {
    const { title, description, status, priority } = req.body;

    // Check if task exists and belongs to user
    let task = await Task.findOne({
      _id: req.params.id,
      userId: req.user.id,
      isDeleted: false
    });

    if (!task) {
      return next(new AppError('No task found with that ID', 404));
    }

    // Update task
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;

    const updatedTask = await task.save();

    res.status(200).json({
      status: 'success',
      data: {
        task: updatedTask
      }
    });
  } catch (err) {
    if (err.code === 11000) {
      return next(new AppError('Task with this title already exists', 400));
    }
    next(err);
  }
};

// @desc    Delete task (soft delete)
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id
      },
      { isDeleted: true },
      { new: true }
    );

    if (!task) {
      return next(new AppError('No task found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};