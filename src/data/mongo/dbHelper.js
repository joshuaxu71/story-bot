const { connectToDatabase } = require("@data/mongo.js");

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

module.exports = {
   getDatabaseCollection,
   executeWithCatch,
};
