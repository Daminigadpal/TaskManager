import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { ITask } from '../types/models';
import Task from '../models/Task';
import AppError from '../middleware/utils/appError';

interface CustomRequest extends Request {
  user?: {
    id: Types.ObjectId;
  };
  params: {
    id?: string;
  };
}

interface TaskInput {
  title?: string;
  description?: string;
  status?: 'Pending' | 'In Progress' | 'Completed';
  priority?: 'Low' | 'Medium' | 'High';
}

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { title, description, priority, status } = req.body as TaskInput;
    
    if (!title) {
      return next(new AppError('Title is required', 400));
    }

    // Create task
    const task = await Task.create({
      title,
      description,
      priority: priority || 'Medium',
      status: status || 'Pending',
      userId: req.user?.id
    });

    res.status(201).json({
      status: 'success',
      data: {
        task
      }
    });
  } catch (err: any) {
    if (err.code === 11000) {
      return next(new AppError('Task with this title already exists', 400));
    }
    next(err);
  }
};

// @desc    Get all tasks for logged in user
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { status, search } = req.query as { status?: string; search?: string };
    
    // Build query
    const query: any = { 
      userId: req.user?.id,
      isDeleted: false 
    };

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Search by title
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Execute query
    const tasks = await Task.find(query)
      .sort({ 
        priority: -1, // High to Low
        createdAt: -1 // Newest first
      });

    res.status(200).json({
      status: 'success',
      results: tasks.length,
      data: {
        tasks
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
export const getTask = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.params.id) {
      return next(new AppError('Task ID is required', 400));
    }

    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user?.id,
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
export const updateTask = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.params.id) {
      return next(new AppError('Task ID is required', 400));
    }

    const { title, description, status, priority } = req.body as TaskInput;

    // Check if task exists and belongs to user
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user?.id,
      isDeleted: false
    });

    if (!task) {
      return next(new AppError('No task found with that ID', 404));
    }

    // Update task
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;

    const updatedTask = await task.save();

    res.status(200).json({
      status: 'success',
      data: {
        task: updatedTask
      }
    });
  } catch (err: any) {
    if (err.code === 11000) {
      return next(new AppError('Task with this title already exists', 400));
    }
    next(err);
  }
};

// @desc    Delete task (soft delete)
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.params.id) {
      return next(new AppError('Task ID is required', 400));
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user?.id
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

export default {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask
};
