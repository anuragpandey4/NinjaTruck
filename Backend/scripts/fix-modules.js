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

  // Disable POOLING CAB
  const result = await db.collection('taxiappmodules').updateOne(
    { name: 'POOLING CAB' },
    { $set: { active: 0 } }
  );
  console.log('POOLING CAB disabled:', result.modifiedCount, 'document(s) updated');

  await mongoose.disconnect();
};

run();
