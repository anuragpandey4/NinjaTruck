import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import { createRideRecord } from './src/modules/taxi/services/rideService.js';
import { startDispatchFlow } from './src/modules/taxi/services/dispatchService.js';

const runTests = async () => {
  await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DB_NAME });

  const user = await mongoose.connection.collection('taxiusers').findOne({});
  const bikeVehicle = await mongoose.connection.collection('taxivehicles').findOne({ icon_types: 'bike' });
  const truckVehicle = await mongoose.connection.collection('taxivehicles').findOne({ icon_types: 'LCV' });

  const testCases = [
    {
      name: 'City Delivery',
      payload: {
        userId: user._id,
        pickupCoords: [75.8937, 22.7533],
        dropCoords: [75.9048, 22.7039],
        fare: 150,
        vehicleTypeId: bikeVehicle._id,
        vehicleTypeIds: [bikeVehicle._id],
        serviceType: 'parcel',
        parcel: {
          category: 'Parcel',
          deliveryScope: 'city',
        }
      }
    },
    {
      name: 'Courier',
      payload: {
        userId: user._id,
        pickupCoords: [75.8937, 22.7533],
        dropCoords: [75.9048, 22.7039],
        fare: 100,
        vehicleTypeId: bikeVehicle._id,
        vehicleTypeIds: [bikeVehicle._id],
        serviceType: 'parcel',
        parcel: {
          category: 'courier',
          deliveryScope: 'city',
        }
      }
    },
    {
      name: 'Outstation Delivery',
      payload: {
        userId: user._id,
        pickupCoords: [75.8937, 22.7533],
        dropCoords: [77.4126, 23.2599], // Bhopal
        fare: 3500,
        vehicleTypeId: truckVehicle._id,
        vehicleTypeIds: [truckVehicle._id],
        serviceType: 'parcel',
        parcel: {
          category: 'goods',
          deliveryScope: 'outstation',
          isOutstation: true
        }
      }
    },
    {
      name: 'Packers & Movers',
      payload: {
        userId: user._id,
        pickupCoords: [75.8937, 22.7533],
        dropCoords: [75.9048, 22.7039],
        fare: 1200,
        vehicleTypeId: truckVehicle._id,
        vehicleTypeIds: [truckVehicle._id],
        serviceType: 'parcel',
        parcel: {
          category: 'movers',
          deliveryScope: 'city',
          packersAndMovers: { houseType: '1 BHK', laborSupport: 2 }
        }
      }
    }
  ];

  for (const test of testCases) {
    console.log(`\n--- Testing ${test.name} ---`);
    try {
      const ride = await createRideRecord(test.payload);
      console.log(`Ride Created! ID: ${ride._id}`);
      
      const success = await startDispatchFlow(ride);
      console.log(`Dispatch Flow Result: ${success}`);
    } catch (e) {
      console.error(`Failed ${test.name}:`, e.message);
    }
  }

  process.exit(0);
};

runTests().catch(console.error);
