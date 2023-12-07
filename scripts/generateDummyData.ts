// generateDummyData.ts
// To use:
// npm install ts-node -g
// npm run generate-dummy-data
import mongoose, { ConnectOptions } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import { User } from '../models/user';
import Product from '../models/product';
import Review from '../models/review';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const MONGODB_URI     = process.env.MONGODB_URI as string;
const ADMIN_USERNAME  = process.env.ADMIN_USERNAME as string;
const ADMIN_EMAIL     = process.env.ADMIN_EMAIL as string;
const ADMIN_SECRET    = process.env.ADMIN_SECRET as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const generateDummyData = async (numUsers: number, numProducts: number, numReviews: number): Promise<void> => {
  await mongoose.connect(MONGODB_URI)
                .then(() => console.log('MongoDB connected'))
                .catch((err: any) => console.error('MongoDB connection error:', err));

    for (let i = 0; i < numUsers; i++) {
      let username, email, password, roles;

      if (i === 0) {
        // Create an admin user
        username = ADMIN_USERNAME;
        email = ADMIN_EMAIL;
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
          name: faker.person.fullName(),
          bio: faker.lorem.sentence(),
          location: faker.location.city(),
          avatar: faker.image.avatar(),
        },
      });

      await user.save();

      for (let j = 0; j < numProducts; j++) {
        const product = new Product({
          artisan: user._id,
          title: faker.commerce.productName(),
          description: faker.lorem.paragraph(),
          price: parseFloat(faker.commerce.price()),
          images: [faker.image.url()],
          categories: [faker.commerce.department()],
        });

        await product.save();

        for (let k = 0; k < numReviews; k++) {
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

    await mongoose.disconnect();
  };

  generateDummyData(20, 30, 10).catch(console.error);
