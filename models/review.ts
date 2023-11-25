import mongoose from 'mongoose';

/**
 * Represents a review for a product.
 */
const reviewSchema = new mongoose.Schema({
  /**
   * The product being reviewed.
   */
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  /**
   * The user who wrote the review.
   */
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  /**
   * The rating given in the review.
   * Must be a number between 1 and 5 (inclusive).
   */
  rating: { type: Number, required: true, min: 1, max: 5 },
  /**
   * The comment provided in the review.
   */
  comment: String,
  /**
   * Indicates whether the review has been moderated.
   */
  moderated: { type: Boolean, default: false },
  /**
   * The date and time when the review was created.
   */
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Review || mongoose.model('Review', reviewSchema);