import type { NextApiRequest, NextApiResponse } from 'next';
import { createUser } from 'next-auth/adapters';
import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';

/**
 * Handles the signup API request.
 * 
 * @param req - The NextApiRequest object representing the incoming request.
 * @param res - The NextApiResponse object representing the outgoing response.
 * @returns A Promise that resolves to void.
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, email, password } = req.body;

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
  const existingUsername = await db.collection('users').findOne({ username });
  if (existingUsername) {
    client.close();
    return res.status(422).json({ message: 'Username already exists' });
  }
  
  const hashedPassword = await bcrypt.hash(password, 12);

  const result = await db.collection('users').insertOne({
    username,
    email,
    password: hashedPassword,
    roles: ['user'], // default role
  });

  // Create a user in the NextAuth session database
  await createUser({ email, username, password: hashedPassword });

  client.close();
  res.status(201).json({ message: 'User created', userId: result.insertedId });
}

export default handler;
