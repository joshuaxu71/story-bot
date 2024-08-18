const { MongoClient } = require("mongodb");

// Replace with your MongoDB connection string
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let db = null;

async function connectToDatabase() {
   if (db) return db; // Return the existing connection if already connected

   try {
      await client.connect();
      db = client.db("development"); // Replace with your database name
      console.log("Connected to MongoDB!");
      return db;
   } catch (err) {
      console.error("Error connecting to MongoDB:", err);
      throw err;
   }
}

module.exports = { connectToDatabase };
