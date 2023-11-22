// mongodb.d.ts
import { MongoClient } from "mongodb";

declare const clientPromise: Promise<MongoClient>;

export default clientPromise;
