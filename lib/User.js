// lib/db/models/User.js
/**
 * @typedef {Object} User
 * @property {string} email - The email of the user.
 * @property {string} password - The password of the user.
 */
const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);