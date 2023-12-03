import mongoose, { Document, Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import email from 'next-auth/providers/email';

interface IUser {
  username: string;
  email: string;
  password: string;
  roles: string[];
  profile: {
    name: string;
    bio: string;
    location: string;
    avatar: string;
  };
}

interface IUserDocument extends IUser, Document {}

const userSchema = new mongoose.Schema<IUserDocument>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, validate: emailValidator },
  password: { type: String, required: true },
  roles: [{ type: String, enum: ['user', 'artisan', 'admin'] }],
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

let User: mongoose.Model<IUserDocument, {}>;

if (mongoose.models.User) {
  User = mongoose.model('User') as mongoose.Model<IUserDocument, {}>;
} else {
  User = mongoose.model('User', userSchema) as mongoose.Model<IUserDocument, {}>;
}

export type { IUserDocument };
export { User };