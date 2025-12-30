require("dotenv").config({ path: ".env" });

const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");

async function seed() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI not defined");
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB...");

    const db = client.db();
    const adminsCollection = db.collection("admins");

    const existingAdmin = await adminsCollection.findOne({
      email: "admin@rivaagro.com",
    });

    if (existingAdmin) {
      console.log("Admin already exists. Seeding skipped.");
      return;
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await adminsCollection.insertOne({
      email: "admin@rivaagro.com",
      password: hashedPassword,
      role: "admin",
      createdAt: new Date(),
    });

    console.log("✅ Admin created successfully!");
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    await client.close();
    console.log("MongoDB connection closed.");
  }
}

seed();
