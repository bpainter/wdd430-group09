// pages/api/artisans/artisans.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function artisansHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const db = await connectToDatabase();
    const id = req.query.id;

    console.log('ArtisanHandler Req', req);
    console.log('ArtisanHandler ID:', id);

    if (!id || typeof id !== 'string' || !ObjectId.isValid(id)) {
      console.log('Invalid id:', id);
      res.status(400).json({ error: 'Invalid id' });
      return;
    }

    const artisan = await db.collection('users').findOne({ _id: new ObjectId(id) });

    console.log('Artisan:', artisan);

    if (!artisan) {
      console.log('Artisan not found');
      res.status(404).json({ error: 'Artisan not found' });
      return;
    }

    res.status(200).json(artisan);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}