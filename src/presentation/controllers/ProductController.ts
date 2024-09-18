import { Request, Response } from 'express';
import { IProduct } from '../../domain/entities/Product'; // Adjust the path if needed
import ProductRepository from '../../infrastructure/databases/MongoProductRepo';
import { IProductRepository } from '../../domain/repositories/ProductRepository';
import logger from '../../infrastructure/logging/Logger'; 

class ProductController {
  // Declare the productRepository as private
  private static productRepository: IProductRepository = new ProductRepository();

  // Create a new product (public method)
  public static createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const productData: IProduct = req.body;
      const product = await ProductController.productRepository.create(productData);
      logger.info('Product created successfully', { product });
      res.status(201).json({
        message: 'Product created successfully',
        product,
      });
    } catch (error: unknown) {
      logger.error('Failed to create product', { error });
      res.status(500).json({
        message: 'Failed to create product',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  // Get all products (public method)
  public static getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const products = await ProductController.productRepository.findAll();
      logger.info('Retrieved all products', { count: products.length });
      res.status(200).json(products);
    } catch (error: unknown) {
      logger.error('Failed to retrieve products', { error });
      res.status(500).json({
        message: 'Failed to retrieve products',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  // Get a product by ID (public method)
  public static getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
      const productId = req.params.id;
      const product = await ProductController.productRepository.findById(productId);
      if (product) {
        logger.info('Product retrieved successfully', { productId });
        res.status(200).json(product);
      } else {
        logger.warn('Product not found', { productId });
        res.status(404).json({
          message: 'Product not found',
        });
      }
    } catch (error: unknown) {
      logger.error('Failed to retrieve product', { productId: req.params.id, error });
      res.status(500).json({
        message: 'Failed to retrieve product',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  // Update a product by ID (public method)
  public static updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const productId = req.params.id;
      const productData: Partial<IProduct> = req.body;
      const updatedProduct = await ProductController.productRepository.update(productId, productData);
      if (updatedProduct) {
        logger.info('Product updated successfully', { productId, updatedProduct });
        res.status(200).json({
          message: 'Product updated successfully',
          product: updatedProduct,
        });
      } else {
        logger.warn('Product not found for update', { productId });
        res.status(404).json({
          message: 'Product not found',
        });
      }
    } catch (error: unknown) {
      logger.error('Failed to update product', { productId: req.params.id, error });
      res.status(500).json({
        message: 'Failed to update product',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  // Delete a product by ID (public method)
  public static deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const productId = req.params.id;
      const deletedProduct = await ProductController.productRepository.delete(productId);
      if (deletedProduct) {
        logger.info('Product deleted successfully', { productId });
        res.status(200).json({
          message: 'Product deleted successfully',
          product: deletedProduct,
        });
      } else {
        logger.warn('Product not found for deletion', { productId });
        res.status(404).json({
          message: 'Product not found',
        });
      }
    } catch (error: unknown) {
      logger.error('Failed to delete product', { productId: req.params.id, error });
      res.status(500).json({
        message: 'Failed to delete product',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
}

export default ProductController;
