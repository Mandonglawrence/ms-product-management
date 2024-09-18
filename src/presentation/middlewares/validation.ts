import { check, validationResult, ValidationError, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import Logger from '../../infrastructure/logging/Logger'; // Your Winston logger
import { isValidObjectId } from 'mongoose';
import { roles } from '../../shared/constants';

// Validation rule for MongoDB ObjectID
export const mongoIdValidationRule = (field: string) =>
  check(field)
    .custom((value) => isValidObjectId(value))
    .withMessage(`${field} must be a valid MongoDB ObjectID`);

export const emailValidationRule = (field: string) =>
check(field)
    .isEmail()
    .withMessage(`Please provide a valid ${field} address`)
    .normalizeEmail();

// Validation rules for user registration
export const userRegistrationValidationRules: ValidationChain[] = [
  check('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .trim(),
  check('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
    check('roles')
    .isArray()
    .withMessage('roles must be an array')
    .custom((value) => {
      if (!value.every(isValidObjectId)) {
        throw new Error('roles must be a valid MongoDB ObjectID');
      }
      return true;
    })
];

export const userUpdateValidationRules: ValidationChain[] = [
  check('roles')
    .optional() // Make it optional for updates
    .isArray()
    .withMessage('roles must be an array')
    .custom((value) => {
      if (value && !value.every(isValidObjectId)) {
        throw new Error('roles must be a valid MongoDB ObjectID');
      }
      return true;
    })
];

// Validation rules for user login
export const userLoginValidationRules: ValidationChain[] = [
  check('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

// Validation rules for product creation
export const productCreationValidationRules = [
  check('name')
    .not()
    .isEmpty()
    .withMessage('Product name is required')
    .trim(),
  check('price')
    .isFloat({ gt: 0 })
    .withMessage('Product price must be a positive number'),
  check('description')
    .isLength({ max: 200 })
    .withMessage('Description must not exceed 200 characters')
    .optional()
    .trim(),
];

// Validation rules for activity log
export const activityLogValidationRules = [
  check('userId')
    .isString()
    .withMessage('User ID must be a string'),
  check('method')
    .isString()
    .withMessage('HTTP method must be a string'),
  check('route')
    .isString()
    .withMessage('Route must be a string'),
  check('statusCode')
    .isInt({ min: 100, max: 599 })
    .withMessage('Status code must be a valid HTTP status code'),
  check('responseTime')
    .isString()
    .withMessage('Response time must be a string'),
  check('timestamp')
    .isISO8601()
    .withMessage('Timestamp must be a valid ISO8601 date'),
  check('ip')
    .isIP()
    .withMessage('IP address must be a valid IP address'),
];

// Validation rules for user roles
export const userRoleValidationRules = [
    check('role')
    .not()
    .isEmpty()
    .withMessage('Role is required')
    .isIn(Object.values(roles))
    .withMessage(`Role must be one of the following values: ${Object.values(roles).join(', ')}`),
  check('permissions')
    .isArray()
    .withMessage('Permissions must be an array')
    .custom((permissions: string[]) => {
      const validPermissions = ['read', 'write', 'delete', 'update']; // Example permission values
      for (const permission of permissions) {
        if (!validPermissions.includes(permission)) {
          throw new Error(`Invalid permission: ${permission}`);
        }
      }
      return true;
    })
    .withMessage('Invalid permissions provided'),
];

// Middleware to check for validation errors
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Extract errors in a more flexible way
    const extractedErrors = errors.array().map((error: ValidationError) => {
      return {
        field: (error as any).param || 'unknown', // Use 'unknown' if 'param' is missing
        message: (error as any).msg || 'Validation error', // Use 'Validation error' if 'msg' is missing
      };
    });

    Logger.warn(`Validation failed: ${JSON.stringify(extractedErrors)}`);

    return res.status(400).json({
      errors: extractedErrors,
      message: 'Validation failed. Please check your input.',
    });
  }

  next();
};
