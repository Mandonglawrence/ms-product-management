import express from 'express';
import UserController from '../controllers/UserController';
import { validate, userRegistrationValidationRules, userLoginValidationRules, mongoIdValidationRule, userUpdateValidationRules, emailValidationRule } from '../../presentation/middlewares/validation';
import activityLoggerMiddleware from '../../presentation/middlewares/activityLoggerMiddileware'; // Ensure this path is correct
import { activityLogRepository } from '../../infrastructure/dataSources';
import { permissions } from '../../shared/constants';
import { permissionMiddleware } from '../../presentation/middlewares/authMiddleware';

const router = express.Router();

// Apply activityLoggerMiddleware globally to all role routes
router.use(activityLoggerMiddleware(activityLogRepository)); 
// User Registration Route
router.post(
  '/register',
  permissionMiddleware([permissions.WRITE]),
  userRegistrationValidationRules, // Apply registration validation rules
  validate, // Apply validation middleware
  UserController.createUser
);

// Get User by ID Route
router.get(
  '/:id',
  mongoIdValidationRule('id'),
  validate,
  UserController.getUserById
);

// Get User by Email Route
router.get(
  '/email/:email',
  emailValidationRule('email'),
  validate,
  UserController.getUserByEmail
);

// Update User by ID Route
router.put(
  '/:id',
  permissionMiddleware([permissions.UPDATE]),
  mongoIdValidationRule('id'),
  userUpdateValidationRules, // Use appropriate validation rules if necessary
  validate, // Apply validation middleware
  UserController.updateUser
);

// Delete User by ID Route
router.delete(
  '/:id',
  permissionMiddleware([permissions.DELETE]),
  UserController.deleteUser
);

export default router;
