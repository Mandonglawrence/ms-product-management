import { Document, Schema, model } from 'mongoose';

// Define the TypeScript interface for the Product entity
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the Mongoose schema for the Product entity
const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [3, 'Product name must be at least 3 characters long'],
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    minlength: [10, 'Product description must be at least 10 characters long'],
    maxlength: [500, 'Product description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Product price must be a positive number']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    trim: true,
    minlength: [3, 'Product category must be at least 3 characters long'],
    maxlength: [50, 'Product category cannot exceed 50 characters']
  },
  stock: {
    type: Number,
    required: [true, 'Product stock is required'],
    min: [0, 'Product stock must be a non-negative number']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});

// Compound unique index for unique product name per category
productSchema.index({ name: 1, category: 1 }, { unique: true });

// Virtual field for formatted price
productSchema.virtual('formattedPrice').get(function() {
  return `$${this.price.toFixed(2)}`;
});

// Custom methods
productSchema.methods.isInStock = function() {
  return this.stock > 0;
};

// Create the Mongoose model for the Product entity
const ProductModel = model<IProduct>('Product', productSchema);
export default ProductModel;
