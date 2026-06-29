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
    
    // 1. Force driver search radius to 50km
    const AdminBusinessSetting = mongoose.model('AdminBusinessSetting', new mongoose.Schema({}, { strict: false }));
    const settings = await AdminBusinessSetting.findOne({ scope: 'default' });
    if (settings) {
      if (!settings.transportRide) settings.transportRide = {};
      settings.transportRide.driver_search_radius = "50";
      settings.markModified('transportRide');
      await settings.save();
      console.log('Driver search radius updated to 50km.');
    }

    // 2. Fix Mini Truck Rental Pricing
    const RentalVehicleType = mongoose.model('TaxiRentalVehicleType', new mongoose.Schema({}, { strict: false }));
    const miniTrucks = await RentalVehicleType.find({ name: { $regex: /truck/i } });
    
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

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
};

run();
