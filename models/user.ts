import mongoose from 'mongoose';
import email from 'next-auth/providers/email';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, validate: emailValidator },
  password: { type: String, required: true },
  roles: [{ type: String, enum: ['user', 'artisan', 'admin'] }],

  /**
   * The profile information of the user.
   */
  profile: {
    name: String,
    bio: String,
    location: String,
    avatar: String,
  },
});

function emailValidator(value: string) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}]))$/;
  return re.test(value);
}

export default mongoose.model('User', userSchema);