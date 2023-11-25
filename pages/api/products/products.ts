// pages/api/products/products.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import mongoClientPromise from '../../../lib/mongodb';

/**
 * Handles the request for retrieving products.
 * 
 * @param req - The NextApiRequest object representing the incoming request.
 * @param res - The NextApiResponse object representing the outgoing response.
 * @returns A Promise that resolves to void.
 */
export default async function productsHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const client = await mongoClientPromise;
    const db = client.db();

    const products = await db.collection('products').find({}).toArray();
    res.status(200).json(products);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}