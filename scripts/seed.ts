require('dotenv').config({ path: '.env' });
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable inside .env');
  process.exit(1);
}

async function seed() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB...');
    const db = client.db();

    const usersCollection = db.collection('users');

    // Check if admin user already exists
    const existingAdmin = await usersCollection.findOne({ email: 'admin@example.com' });

    if (existingAdmin) {
      console.log('Admin user already exists. Seeding skipped.');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin', 10);

    // Create admin user
    await usersCollection.insertOne({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'Admin',
    });

    console.log('✅ Admin user created successfully!');

  } catch (error) {
    console.error('Error during database seeding:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed.');
  }
}

seed();
