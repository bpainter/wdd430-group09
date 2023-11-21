// pages/api/products/products.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';

export default async function productsHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const client = await clientPromise;
    const db = client.db();

    const products = await db.collection('products').find({}).toArray();
    res.status(200).json(products);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
