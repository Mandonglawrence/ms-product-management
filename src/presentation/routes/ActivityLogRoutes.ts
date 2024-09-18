import express from 'express';
import ActivityLogController from '../controllers/ActivityLogController';
import activityLoggerMiddleware from '../../presentation/middlewares/activityLoggerMiddileware'; // Ensure this path is correct
import { permissions } from '../../shared/constants';
import { permissionMiddleware } from '../../presentation/middlewares/authMiddleware';

const router = express.Router();
const activityLogController = new ActivityLogController();

// Create a new activity log
router.post(
  '/',
  activityLoggerMiddleware, // Log the activity
  activityLogController.createActivityLog
);

// Get activity logs by user ID
router.get(
  '/user/:userId',
  activityLoggerMiddleware, // Log the activity
  activityLogController.getActivityLogsByUserId
);

// Get an activity log by ID
router.get(
  '/:id',
  activityLoggerMiddleware, // Log the activity
  activityLogController.getActivityLogById
);

// Delete an activity log by ID
router.delete(
  '/:id',
  permissionMiddleware([permissions.DELETE]),
  activityLoggerMiddleware, // Log the activity
  activityLogController.deleteActivityLog
);

export default router;
