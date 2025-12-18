import { Document, Types } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: Types.ObjectId;
        // Add other user properties here if needed
      };
    }
  }
}

export interface ITask extends Document {
  title: string;
  description?: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  isDeleted: boolean;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  isActive: boolean;
  isDeleted: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
  changedPasswordAfter(JWTTimestamp: number): boolean;
  createPasswordResetToken(): string;
}
