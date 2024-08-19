const { MongoClient } = require("mongodb");

// Replace with your MongoDB connection string
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let db = null;

async function getDatabaseCollection(collectionName) {
   try {
      if (!db) {
         db = await connectToDatabase();
      }
      return db.collection(collectionName);
   } catch (err) {
      console.error("Error getting database collection:", err);
      throw err;
   }
}

async function executeWithCatch(context, operation) {
   try {
      return await operation();
   } catch (err) {
      console.error(`Error in ${context}:`, err);
      throw err;
   }
}

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

module.exports = {
   getDatabaseCollection,
   executeWithCatch,
};
