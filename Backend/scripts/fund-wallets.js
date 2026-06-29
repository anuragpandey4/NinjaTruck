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
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri, { dbName: process.env.MONGODB_DB_NAME });
    console.log('Connected.');

    // 1. Add 5000 to all Drivers
    const Driver = mongoose.model('TaxiDriver', new mongoose.Schema({}, { strict: false }));
    const driverResult = await Driver.updateMany(
      {}, 
      { $set: { walletBalance: 5000 } }
    );
    console.log(`Funded ${driverResult.modifiedCount} drivers with ₹5000.`);

    // 2. Add 5000 to all Users
    const User = mongoose.model('TaxiUser', new mongoose.Schema({}, { strict: false }));
    const userResult = await User.updateMany(
      {}, 
      { $set: { walletBalance: 5000 } }
    );
    console.log(`Funded ${userResult.modifiedCount} users with ₹5000.`);

    // 3. Disable the driver minimum balance check in settings to be safe
    const AdminBusinessSetting = mongoose.model('AdminBusinessSetting', new mongoose.Schema({}, { strict: false }));
    const settings = await AdminBusinessSetting.findOne({ scope: 'default' });
    if (settings) {
      if (!settings.transportRide) settings.transportRide = {};
      // Set driver minimum balance to 0
      settings.transportRide.driver_minimum_balance = 0;
      settings.markModified('transportRide');
      await settings.save();
      console.log('Set driver minimum balance required to 0.');
    }

    console.log('Done!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
};

run();
