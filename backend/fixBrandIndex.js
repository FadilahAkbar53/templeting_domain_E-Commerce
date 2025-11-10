// Script to fix Brand name index to be case-insensitive
const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce";

async function fixBrandIndex() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;
    const brandsCollection = db.collection("brands");

    console.log("\nChecking existing indexes...");
    const indexes = await brandsCollection.indexes();
    console.log("Current indexes:", JSON.stringify(indexes, null, 2));

    // Drop the old name index if it exists
    try {
      console.log("\nDropping old 'name_1' index...");
      await brandsCollection.dropIndex("name_1");
      console.log("Old index dropped successfully");
    } catch (err) {
      if (err.code === 27) {
        console.log("Index 'name_1' does not exist, skipping...");
      } else {
        throw err;
      }
    }

    // Create new case-insensitive unique index
    console.log("\nCreating new case-insensitive unique index...");
    await brandsCollection.createIndex(
      { name: 1 },
      {
        unique: true,
        collation: { locale: "en", strength: 2 },
        name: "name_1",
      }
    );
    console.log("New case-insensitive index created successfully");

    console.log("\nVerifying new indexes...");
    const newIndexes = await brandsCollection.indexes();
    console.log("Updated indexes:", JSON.stringify(newIndexes, null, 2));

    console.log("\n✅ Brand index fix completed successfully!");
  } catch (error) {
    console.error("❌ Error fixing brand index:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\nDatabase connection closed");
    process.exit();
  }
}

fixBrandIndex();
