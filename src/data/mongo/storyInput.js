const { connectToDatabase } = require('@data/mongo.js');

const collection_name = 'story_inputs';

async function insertDocument(storyInput) {
    try {
        const db = await connectToDatabase();
        const collection = db.collection(collection_name);

        storyInput.createdDate = new Date();
        storyInput.lastModifiedDate = new Date();
        const result = await collection.insertOne(storyInput);
        console.log('Document inserted with _id:', result.insertedId);
    } catch (err) {
        console.error('Error inserting document:', err);
    }
}

module.exports = {
    insertDocument
}