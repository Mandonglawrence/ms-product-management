


import { IProduct } from '../entities/Product';

// Define the interface for the product repository
export interface IProductRepository {
  create(product: IProduct): Promise<IProduct>;
  findById(id: string): Promise<IProduct | null>;
  findAll(): Promise<IProduct[]>;
  update(id: string, product: Partial<IProduct>): Promise<IProduct | null>;
  delete(id: string): Promise<IProduct | null>;
}