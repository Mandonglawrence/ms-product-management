import { Document, Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUserRole } from './UserRole';

// Define the TypeScript interface for the User entity
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  roles: IUserRole[];
  createdAt?: Date;
  updatedAt?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date; // Ensure this is of type Date
  comparePassword(candidatePassword: string): Promise<boolean>; // Custom method
}

// Define the Mongoose schema for the User entity
const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    unique: true // Ensure uniqueness
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    unique: true, // Ensure uniqueness
    validate: {
      validator: function (v: string) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  roles: [{
    type: Schema.Types.ObjectId,
    ref: 'UserRole', 
    required: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  }
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});

// Pre-save hook to hash the password before saving to the database
userSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Custom method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create the Mongoose model for the User entity
const UserModel = model<IUser>('User', userSchema);

export default UserModel;
