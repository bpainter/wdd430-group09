import mongoose from 'mongoose';

/**
 * Represents a user in the system.
 */
const userSchema = new mongoose.Schema({
  /**
   * The username of the user.
   */
  username: { type: String, required: true, unique: true },

  /**
   * The email address of the user.
   */
  email: { type: String, required: true, unique: true },

  /**
   * The password of the user.
   */
  password: { type: String, required: true },

  /**
   * The roles assigned to the user.
   * Possible values: 'user', 'artisan', 'admin'
   */
  roles: [{ type: String, enum: ['user', 'artisan', 'admin'] }],

  /**
   * The profile information of the user.
   */
  profile: {
    /**
     * The name of the user.
     */
    name: String,

    /**
     * The bio of the user.
     */
    bio: String,

    /**
     * The location of the user.
     */
    location: String,

    /**
     * The avatar URL of the user.
     */
    avatar: String,
  },
});

export default mongoose.models.User || mongoose.model('User', userSchema);