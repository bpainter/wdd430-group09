// pages/api/profile.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import User from '../../../models/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await connectToDatabase();
  const usersCollection = client.collection('users');

  try {
    switch (req.method) {
      case 'POST':
        // Validate request body
        if (!req.body || Object.keys(req.body).length === 0) {
          return res.status(400).json({ error: 'Missing profile data' });
        }

        // Create profile
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
        break;
      case 'GET':
        // Validate ID
        if (!req.query.id) {
          return res.status(400).json({ error: 'Missing user ID' });
        }

        // Read profile
        const user = await User.findById(req.query.id as string);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
        break;
      case 'PUT':
        // Validate ID and request body
        if (!req.query.id || !req.body || Object.keys(req.body).length === 0) {
          return res.status(400).json({ error: 'Missing user ID or profile data' });
        }

        // Update profile
        const updatedUser = await User.findByIdAndUpdate(req.query.id as string, req.body, { new: true });
        if (!updatedUser) {
          return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(updatedUser);
        break;
      case 'DELETE':
        // Validate ID
        if (!req.query.id) {
          return res.status(400).json({ error: 'Missing user ID' });
        }

        // Delete profile
        const deletedUser = await User.findByIdAndDelete(req.query.id as string);
        if (!deletedUser) {
          return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(deletedUser);
        break;
      default:
        res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
}