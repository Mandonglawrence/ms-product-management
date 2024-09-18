import express from 'express';
import UserRoleController from '../../presentation/controllers/UserRoleController';
import { mongoIdValidationRule, userRoleValidationRules, validate } from '../../presentation/middlewares/validation';
import activityLoggerMiddleware from '../../presentation/middlewares/activityLoggerMiddileware'; 
import { activityLogRepository } from '../../infrastructure/dataSources';
import { permissions } from '../../shared/constants';
import { permissionMiddleware } from '../../presentation/middlewares/authMiddleware';

const router = express.Router();

// Apply activityLoggerMiddleware globally to all role routes
router.use(activityLoggerMiddleware(activityLogRepository)); 

// Create a new role
router.post(
  '/roles',
  permissionMiddleware([permissions.WRITE]),
  userRoleValidationRules,
  validate,
  UserRoleController.createRole
);

// Get a role by ID
router.get(
  '/roles/:id',
  mongoIdValidationRule('id'),
  validate,
  UserRoleController.getRoleById
);

// Get all roles
router.get(
  '/roles',
  UserRoleController.getAllRoles
);

// Update a role by ID
router.put(
  '/roles/:id',
  permissionMiddleware([permissions.UPDATE]),
  mongoIdValidationRule('id'),
  userRoleValidationRules,
  validate,
  UserRoleController.updateRole
);

// Delete a role by ID
router.delete(
  '/roles/:id',
  permissionMiddleware([permissions.DELETE]),
  mongoIdValidationRule('id'),
  validate,
  UserRoleController.deleteRole
);

export default router;
