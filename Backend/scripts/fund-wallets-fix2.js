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

    // Unblock all driver wallets
    const Driver = mongoose.model('TaxiDriver', new mongoose.Schema({}, { strict: false }));
    const driverResult = await Driver.updateMany(
      {}, 
      { $set: { 'wallet.isBlocked': false } }
    );
    console.log(`Unblocked ${driverResult.modifiedCount} drivers.`);

    // Fix the setting name for minimum balance
    const AdminBusinessSetting = mongoose.model('AdminBusinessSetting', new mongoose.Schema({}, { strict: false }));
    const settings = await AdminBusinessSetting.findOne({ scope: 'default' });
    if (settings) {
      if (!settings.transportRide) settings.transportRide = {};
      settings.transportRide.driver_wallet_minimum_amount_to_get_an_order = 0;
      settings.markModified('transportRide');
      await settings.save();
      console.log('Fixed driver_wallet_minimum_amount_to_get_an_order to 0');
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
};

run();
