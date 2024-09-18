import { IProduct } from '../../domain/entities/Product';
import ProductModel from '../../domain/entities/Product'; // Adjust the import path based on your structure
import { IProductRepository } from '../../domain/repositories/ProductRepository'; // Interface for Product repository

class ProductRepository implements IProductRepository {
  // Method to create a new product
  async create(productData: IProduct): Promise<IProduct> {
    try {
      const product = new ProductModel(productData);
      await product.save();
      return product.toObject();
    } catch (error: unknown) {
      if (error instanceof Error) {
        // If error is an instance of Error, use its message
        throw new Error(`Failed to create product: ${error.message}`);
      } else {
        // For any other types of errors, throw a generic error
        throw new Error('Failed to create product due to an unknown error');
      }
    }
  }

  // Method to find a product by ID
  async findById(id: string): Promise<IProduct | null> {
    try {
      const product = await ProductModel.findById(id).exec();
      return product ? product.toObject() : null;
    } catch (error: unknown) {
      if (error instanceof Error) {
        // If error is an instance of Error, use its message
        throw new Error(`Failed to find product by ID: ${error.message}`);
      } else {
        // For any other types of errors, throw a generic error
        throw new Error('Failed to find product by ID due to an unknown error');
      }
    }
  }

  // Method to find all products
  async findAll(): Promise<IProduct[]> {
    try {
      const products = await ProductModel.find().exec();
      return products.map(product => product.toObject());
    } catch (error: unknown) {
      if (error instanceof Error) {
        // If error is an instance of Error, use its message
        throw new Error(`Failed to list products: ${error.message}`);
      } else {
        // For any other types of errors, throw a generic error
        throw new Error('Failed to list products due to an unknown error');
      }
    }
  }

  // Method to update an existing product
  async update(id: string, productData: Partial<IProduct>): Promise<IProduct | null> {
    try {
      const product = await ProductModel.findByIdAndUpdate(id, productData, { new: true }).exec();
      return product ? product.toObject() : null;
    } catch (error: unknown) {
      if (error instanceof Error) {
        // If error is an instance of Error, use its message
        throw new Error(`Failed to update product: ${error.message}`);
      } else {
        // For any other types of errors, throw a generic error
        throw new Error('Failed to update product due to an unknown error');
      }
    }
  }

  // Method to delete a product by ID
  async delete(id: string): Promise<IProduct | null> {
    try {
      const result = await ProductModel.findByIdAndDelete(id).exec();
      return result ? result.toObject() : null;
    } catch (error: unknown) {
      if (error instanceof Error) {
        // If error is an instance of Error, use its message
        throw new Error(`Failed to delete product: ${error.message}`);
      } else {
        // For any other types of errors, throw a generic error
        throw new Error('Failed to delete product due to an unknown error');
      }
    }
  }
}

export default ProductRepository;
