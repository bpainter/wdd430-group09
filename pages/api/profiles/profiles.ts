// pages/api/profile.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { User, IUserDocument } from '../../../models/user';

export default async function profilesHandler(req: NextApiRequest, res: NextApiResponse) {
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
        const newUser: IUserDocument = new User(req.body);
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
          // if (!req.body.id || Object.keys(req.body).length === 0) {
          //   return res.status(400).json({ error: 'Missing user ID or profile data' });
          // }
        
          // Extract id from request body and create data object with the rest of the properties
          const { _id, ...data } = req.body;
          console.log("PUT");
          console.log(req.body);
          console.log(_id, data);
        
          // Update profile
          const result = await usersCollection.updateOne(
            { _id: new ObjectId(_id) },
            { $set: data }
          );
          console.log("PUT RESULT")
          console.log(result);
        
          if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'User not found' });
          }
        
          res.status(200).json(result);
          break;
      case 'DELETE':
        // Validate ID
        // if (!req.query.id) {
        //   return res.status(400).json({ error: 'Missing user ID' });
        // }

        // Delete profile
        const deletedUser = await usersCollection.deleteOne({
          _id: new ObjectId(_id),
        });

        if (deletedUser.deletedCount === 0) {
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