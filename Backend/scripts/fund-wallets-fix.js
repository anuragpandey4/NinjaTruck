import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const uri = process.env.MONGODB_URI;

const run = async () => {
  try {
    await mongoose.connect(uri, { dbName: process.env.MONGODB_DB_NAME });

    // Fix Drivers
    const Driver = mongoose.model('TaxiDriver', new mongoose.Schema({}, { strict: false }));
    const driverResult = await Driver.updateMany(
      {}, 
      { $set: { 'wallet.balance': 5000 } }
    );
    console.log(`Funded ${driverResult.modifiedCount} drivers correctly with ₹5000.`);

    // Fix Users
    const User = mongoose.model('TaxiUser', new mongoose.Schema({}, { strict: false }));
    const userResult = await User.updateMany(
      {}, 
      { $set: { 'wallet.balance': 5000 } }
    );
    console.log(`Funded ${userResult.modifiedCount} users correctly with ₹5000.`);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
};

run();
