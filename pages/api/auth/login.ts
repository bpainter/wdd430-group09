import type { NextApiRequest, NextApiResponse } from 'next';
import mongoClientPromise from '../../../lib/mongodb';
import { verifyPassword } from '../../../lib/auth';
import jwt from 'jsonwebtoken';

/**
 * Handles the login API request.
 * 
 * @param req - The NextApiRequest object representing the incoming request.
 * @param res - The NextApiResponse object representing the outgoing response.
 * @returns A Promise that resolves to the response JSON object.
 */
async function loginHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const client = await mongoClientPromise;
    const db = client.db();

    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid login credentials' });
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid login credentials' });
    }

    // Ensure that JWT_SECRET environment variable is set and accessible
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Internal server error' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '36h' }    // Token expires in 36 hours
    );

    // Send the token to the client
    res.status(200).json({ message: 'Logged in successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

export default loginHandler;
