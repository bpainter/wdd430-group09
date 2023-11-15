import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: [{ type: String, enum: ['user', 'artisan', 'admin'] }], // User roles
  profile: {
    name: String,
    bio: String,
    location: String,
    avatar: String,
  },
});

export default mongoose.models.User || mongoose.model('User', userSchema);