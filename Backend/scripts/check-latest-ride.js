import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DB_NAME });
  const db = mongoose.connection.db;

  // Get the latest ride
  const latestRide = await db.collection('taxirides').find({}).sort({ createdAt: -1 }).limit(1).toArray();
  console.log('LATEST RIDE IN DB:', JSON.stringify(latestRide, null, 2));

  await mongoose.disconnect();
};

run();
