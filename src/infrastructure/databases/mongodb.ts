import mongoose from 'mongoose';
import config from '../../config/config';

const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(config.dbUri);
    console.log('Successfully connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit process with failure code
  }
};

export default connectToDatabase;
