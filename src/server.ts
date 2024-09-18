import app from './app';
import { initializeDataSources } from './infrastructure/dataSources'; // Import the function to initialize data sources
import logger from './infrastructure/logging/Logger';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Initialize data sources
    await initializeDataSources();
    
    // Start the server
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Error starting the server:', error);
    process.exit(1);
  }
};

startServer();
