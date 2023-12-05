// pages/api/products/products.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../../lib/mongodb';

export default async function productsHandler(req: NextApiRequest, res: NextApiResponse) {
  const db = await connectToDatabase(); 
  const collection = db.collection('products');

  switch (req.method) {
    case 'GET':
      const products = await collection.find({}).toArray();
      res.status(200).json(products);
      break;
    case 'POST':
      const newProduct = req.body;
      const result = await collection.insertOne(newProduct);
      res.status(201).json(result);
      break;
    case 'PUT':
      const updatedProduct = req.body;
      const updatedResult = await collection.updateOne({ _id: updatedProduct._id }, { $set: updatedProduct });
      res.status(200).json(updatedResult.modifiedCount);
      break;
    case 'DELETE':
      const deletedProduct = req.body;
      const deletedResult = await collection.deleteOne({ _id: deletedProduct._id });
      res.status(200).json(deletedResult.deletedCount);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
