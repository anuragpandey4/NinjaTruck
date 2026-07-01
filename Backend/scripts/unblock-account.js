import 'dotenv/config';
import mongoose from 'mongoose';
import { env } from '../src/config/env.js';
import { User } from '../src/modules/taxi/user/models/User.js';
import { Driver } from '../src/modules/taxi/driver/models/Driver.js';

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DB_NAME });
    console.log('Connected to MongoDB');

    const phoneRegex = /9340562242/;

    const user = await User.findOne({ phone: /9340562242/ });
    console.log('User Record:', user);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
};

run();
