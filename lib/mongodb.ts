// lib/mongodb.ts
import { MongoClient, MongoClientOptions } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}
const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

const uri = process.env.MONGODB_URI;
const options: MongoClientOptions = {};

let mongoClient;
let mongoClientPromise: Promise<MongoClient>;

if (IS_DEVELOPMENT) {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  /**
   * Represents the global object with an optional MongoDB client promise.
   */
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    mongoClient = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = mongoClient.connect();
  }
  mongoClientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  mongoClient = new MongoClient(uri, options);
  mongoClientPromise = mongoClient.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default mongoClientPromise;