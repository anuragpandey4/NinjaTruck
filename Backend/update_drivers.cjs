const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DB_NAME }).then(async () => {
  try {
    const db = mongoose.connection.collection('taxidrivers');
    
    // Add "Packers & Movers 14ft" and "Mini Truck" and "With Driver" to driver
    const result = await db.updateMany(
      { isOnline: true },
      { 
        $set: { 
          vehicleTypeId: new mongoose.Types.ObjectId('6a3f6d36011f64864ab9da8d') // Mini Truck
        },
        $addToSet: {
          vehicleTypeKeys: { $each: ['delivery', 'packers', 'movers', 'LCV', 'HCV', 'taxi'] }
        }
      }
    );
    console.log('Updated drivers:', result.modifiedCount);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
});
