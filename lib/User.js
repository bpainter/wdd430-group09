// lib/db/models/User.js
import { connectToDatabase } from '../connect-db';

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);