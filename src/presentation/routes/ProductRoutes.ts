import { Router } from 'express';
import ProductController from '../controllers/ProductController'; // Adjust the path if needed
import { mongoIdValidationRule, validate } from '../middlewares/validation'; // Adjust the path if needed
import { productCreationValidationRules } from '../middlewares/validation'; // Validation rules for product creation
import activityLoggerMiddleware from '../../presentation/middlewares/activityLoggerMiddileware'; // Adjust the path if needed
import { activityLogRepository } from '../../infrastructure/dataSources'; // Adjust the path if needed
import { permissions } from '../../shared/constants';
import { permissionMiddleware } from '../../presentation/middlewares/authMiddleware';

const router = Router();

// Apply activity logger middleware
router.use(activityLoggerMiddleware(activityLogRepository));

// Create a new product
router.post(
  '/',
  permissionMiddleware([permissions.WRITE]),
  productCreationValidationRules, // Validation middleware
  validate, // Custom validation handler
  ProductController.createProduct
);

// Get all products
router.get('/products', ProductController.getAllProducts);

// Get a single product by ID
router.get('/products/:id',
  mongoIdValidationRule('id'),
  validate,
  ProductController.getProductById);

// Update a product by ID
router.put(
  '/products/:id',
  permissionMiddleware([permissions.UPDATE]),
  mongoIdValidationRule('id'),
  productCreationValidationRules, // Validation middleware
  validate, // Custom validation handler
  ProductController.updateProduct
);

// Delete a product by ID
router.delete('/products/:id',
  permissionMiddleware([permissions.DELETE]),
  mongoIdValidationRule('id'),
  validate,
  ProductController.deleteProduct);

export default router;
