import connectToDatabase from './databases/mongodb'; // Import the function to connect to MongoDB
import ProductRepository from './databases/MongoProductRepo'; // MongoDB implementation of Product repository
import UserRepository from './databases/MongoUserRepo'; // MongoDB implementation of User repository
import ActivityLogRepository from './databases/MongoActivityLogRepo'; // MongoDB implementation of ActivityLog repository
import UserRoleRepository from './databases/UserRoleRepo';

// Function to initialize data sources
const initializeDataSources = async (): Promise<void> => {
  // Connect to MongoDB
  await connectToDatabase();

  // Optionally, you can initialize other data sources here if needed
};

// Instantiate repositories
const productRepository = new ProductRepository();
const userRepository = new UserRepository();
const activityLogRepository = new ActivityLogRepository();
const userRoleRepository = new UserRoleRepository();

// Export the data sources
export { initializeDataSources, productRepository, userRepository, activityLogRepository, userRoleRepository};
