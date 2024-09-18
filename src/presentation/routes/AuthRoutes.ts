import { Router } from 'express';
import AuthController from '../../presentation/controllers/AuthCrontrollers';
import { userRegistrationValidationRules, userLoginValidationRules, validate } from '../../presentation/middlewares/validation';
import activityLoggerMiddleware from '../../presentation/middlewares/activityLoggerMiddileware';
import { activityLogRepository } from '../../infrastructure/dataSources';

const router = Router();
const authController = new AuthController();

router.use(activityLoggerMiddleware(activityLogRepository)); 
// Register user
router.post('/register', 
userRegistrationValidationRules, 
validate, 
authController.registerUser);

// Login user
router.post('/login', 
userLoginValidationRules, validate, 
authController.loginUser);

// Verify token
router.post('/verify', 
validate, 
authController.verifyToken);

// Refresh token
router.post('/refresh', 
validate, 
authController.refreshToken);

// Change password
router.post('/change-password', 
validate, 
authController.changePassword);

// Forgot password
router.post('/forgot-password', validate, authController.forgotPassword);

// Reset password
router.post('/reset-password', 
validate, 
authController.resetPassword);

export default router;
