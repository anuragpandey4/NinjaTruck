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

    // 1. Approve all drivers
    const Driver = mongoose.model('TaxiDriver', new mongoose.Schema({}, { strict: false }));
    const driverResult = await Driver.updateMany(
      { isApproved: { $ne: true } }, 
      { $set: { isApproved: true, status: 'active', active: true } }
    );
    console.log(`Approved ${driverResult.modifiedCount} pending drivers.`);

    // 2. Increase driver search radius
    const AdminBusinessSetting = mongoose.model('AdminBusinessSetting', new mongoose.Schema({}, { strict: false }));
    const settings = await AdminBusinessSetting.findOne({ scope: 'default' });
    if (settings && settings.transportRide) {
      settings.transportRide.driver_search_radius = 50;
      settings.markModified('transportRide');
      await settings.save();
      console.log('Increased driver search radius to 50km.');
    }

    // 3. Fix Mini Truck Rental Pricing (RentalVehicleType)
    const RentalVehicleType = mongoose.model('TaxiRentalVehicleType', new mongoose.Schema({}, { strict: false }));
    const miniTrucks = await RentalVehicleType.find({ name: /truck/i });
    
    for (const truck of miniTrucks) {
      let pricing = Array.isArray(truck.pricing) ? truck.pricing : [];
      if (pricing.length === 0) {
        truck.pricing = [{
          id: new mongoose.Types.ObjectId().toString(),
          label: "1 Hour",
          durationHours: 1,
          price: 500,
          includedKm: 10,
          extraHourPrice: 100,
          extraKmPrice: 20,
          active: true
        }];
        await truck.save();
        console.log(`Added pricing to Mini Truck: ${truck.name}`);
      }
    }

    console.log('Done!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
};

run();
