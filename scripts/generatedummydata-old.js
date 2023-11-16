// Run with ts-node scripts/populateDummyData.ts
import mongoose, { ConnectOptions } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import User from '../models/user';
import Product from '../models/product';
import Review from '../models/review';

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_SECRET = process.env.ADMIN_SECRET;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


const createDummyData = async () => {
  for (let i = 0; i < 10; i++) {
    let username, email, password, roles;

    if (i === 0) {
      // Create an admin user
      username = ADMIN_USERNAME;
      email = 'admin@group09.com';
      password = await bcrypt.hash(ADMIN_SECRET, 12);
      roles = ['admin'];
    } else {
      // Create regular users with faker
      username = faker.internet.userName();
      email = faker.internet.email();
      password = await bcrypt.hash(faker.internet.password(), 12);
      roles = ['user'];
    }

    const user = new User({
      username,
      email,
      password,
      roles,
      profile: {
        name: faker.name.fullName(),
        bio: faker.lorem.sentence(),
        location: faker.address.city(),
        avatar: faker.image.avatar(),
      },
    });

    await user.save();

    for (let j = 0; j < 10; j++) {
      const product = new Product({
        artisan: user._id,
        title: faker.commerce.productName(),
        description: faker.lorem.paragraph(),
        price: parseFloat(faker.commerce.price()),
        images: [faker.image.imageUrl()],
        categories: [faker.commerce.department()],
      });

      await product.save();

      for (let k = 0; k < 10; k++) {
        const review = new Review({
          product: product._id,
          user: user._id,
          rating: Math.floor(Math.random() * 5) + 1,
          comment: faker.lorem.sentence(),
        });

        await review.save();
      }
    }
  }
};
 
createDummyData().then(() => {
  console.log('Dummy data created');
  mongoose.disconnect();
});