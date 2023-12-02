import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../../lib/mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { product, user, rating, comment } = req.body;

    // Validate the input
    if (!product || !user || !rating || !comment) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Connect to the database
    const db = await connectToDatabase();
    console.log('Connected to database to post a review');

    // Create a new review
    const review = {
      product,
      user,
      rating,
      comment,
      moderated: false,
      createdAt: new Date(),
    };

    // Save the review
    const result = await db.collection('reviews').insertOne(review);
    console.log('Insert review', result);

    // Fetch the inserted review
    const insertedReview = await db.collection('reviews').findOne({ _id: result.insertedId });
    console.log('Inserted review completed', insertedReview);

    // Send the review back in the response
    return res.status(201).json(insertedReview);
  }

  // Handle any other HTTP methods
  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}