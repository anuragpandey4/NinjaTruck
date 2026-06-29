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

  const driver = await db.collection('taxidrivers').findOne({ _id: new mongoose.Types.ObjectId("6a3f71c2011f64864ab9da93") });
  console.log('DRIVER IN DB:', driver);

  await mongoose.disconnect();
};

run();
