import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, email, password, isArtisan } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI!);
  const db = client.db();

  const existingUser = await db.collection('users').findOne({ email });
  if (existingUser) {
    client.close();
    return res.status(422).json({ message: 'User already exists' });
  }
  
  const hashedPassword = await bcrypt.hash(password, 12);

  const result = await db.collection('users').insertOne({
    username,
    email,
    password: hashedPassword,
    roles: [isArtisan ? 'artisan' : 'user'],
  });

  client.close();
  res.status(201).json({ message: 'User created', userId: result.insertedId });
}

export default handler;