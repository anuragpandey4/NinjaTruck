import 'dotenv/config';
import mongoose from 'mongoose';

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DB_NAME });
  const admins = await mongoose.connection.db.collection('taxiadmins').find({}, { projection: { name: 1, email: 1, role: 1 } }).limit(10).toArray();
  console.log('Admins:', JSON.stringify(admins, null, 2));
  await mongoose.disconnect();
};
run().catch(console.error);
