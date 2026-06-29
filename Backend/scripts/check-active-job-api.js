import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const driverId = '6a3f71c2011f64864ab9da93'; // Dheeraj
const secret = process.env.JWT_ACCESS_SECRET;

const run = async () => {
  try {
    // 1. Generate JWT token
    const tokenPayload = {
      sub: driverId,
      role: 'driver',
    };
    const token = jwt.sign(tokenPayload, secret, { expiresIn: '7d' });
    console.log('GENERATED JWT TOKEN FOR DHEERAJ:', token);

    // 2. Query DB to check ride documents for Dheeraj
    await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DB_NAME });
    const db = mongoose.connection.db;
    const rides = await db.collection('taxirides').find({
      driverId: new mongoose.Types.ObjectId(driverId),
      status: { $in: ['searching', 'accepted', 'ongoing'] }
    }).toArray();
    console.log('DRIVER ACTIVE RIDES IN DB:', JSON.stringify(rides, null, 2));

    // 3. Make HTTP request to /api/v1/deliveries/active/me and /api/v1/rides/active/me
    const headers = { Authorization: `Bearer ${token}` };
    
    try {
      const resDeliveries = await axios.get('http://localhost:5000/api/v1/deliveries/active/me', { headers });
      console.log('DELIVERIES ACTIVE ME RESPONSE:', JSON.stringify(resDeliveries.data, null, 2));
    } catch (err) {
      console.error('DELIVERIES ACTIVE ME FAILED:', err.response?.data || err.message);
    }

    try {
      const resRides = await axios.get('http://localhost:5000/api/v1/rides/active/me', { headers });
      console.log('RIDES ACTIVE ME RESPONSE:', JSON.stringify(resRides.data, null, 2));
    } catch (err) {
      console.error('RIDES ACTIVE ME FAILED:', err.response?.data || err.message);
    }

  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    await mongoose.disconnect();
  }
};

run();
