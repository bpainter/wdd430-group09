import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI!);
  const db = client.db();

  const user = await db.collection('users').findOne({ email });
  if (!user) {
    client.close();
    return res.status(401).json({ message: 'User not found' });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    client.close();
    return res.status(403).json({ message: 'Invalid credentials' });
  }

  // Implement JWT token generation or session creation logic here

  client.close();
  res.status(200).json({ message: 'Logged in successfully' });
}

export default handler;
