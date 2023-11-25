// lib/mongodb.ts
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }

  await client.connect();
  return client.db();
}

export default connectToDatabase;