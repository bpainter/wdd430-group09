// pages/api/products/products.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Double, MongoClient, ObjectId } from 'mongodb';
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
      const newProduct = {
        _id: new ObjectId(),
        artisan: new ObjectId(req.body.artisan),
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        images: req.body.images,
        categories: req.body.categories,
        averageRating: req.body.averageRating,
        createdAt: new Date(),
      };
      await collection.insertOne(newProduct);
      res.status(200).json(newProduct);
      break;
    case 'PUT':
        const { _id, artisan, ...updatedProduct } = req.body;
        const result = await collection.updateOne(
          { _id: new ObjectId(_id) },
          { $set: { ...updatedProduct, artisan: new ObjectId(artisan) } }
        );
      
        if (result.matchedCount === 0) {
          return res.status(404).json({ error: 'Product not found' });
        }
      
        res.status(200).json(result);
        break;
    case 'DELETE':
      const { _id: _idToDelete } = req.body;
      const deleteResult = await collection.deleteOne({ _id: new ObjectId(_idToDelete) });
    
      if (deleteResult.deletedCount === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
    
      res.status(200).json(deleteResult);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
