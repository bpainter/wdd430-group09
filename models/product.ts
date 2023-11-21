import mongoose from 'mongoose';

/**
 * Represents a product in the system.
 */
const productSchema = new mongoose.Schema({
  /**
   * The ID of the artisan who created the product.
   */
  artisan: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  /**
   * The title of the product.
   */
  title: { type: String, required: true },

  /**
   * The description of the product.
   */
  description: String,

  /**
   * The price of the product.
   */
  price: { type: Number, required: true },

  /**
   * The images associated with the product.
   */
  images: [String],

  /**
   * The categories that the product belongs to.
   */
  categories: [String],

  /**
   * The average rating of the product based on reviews.
   */
  averageRating: { type: Number, default: 0 },

  /**
   * The date and time when the product was created.
   */
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Product || mongoose.model('Product', productSchema);