const { connectToDatabase } = require('@data/mongo.js');

async function insertDocument() {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('story_inputs'); // Replace with your collection name

        const document = {
            name: 'Jane Doe',
            age: 25,
            email: 'jane.doe@example.com'
        };

        const result = await collection.insertOne(document);
        console.log('Document inserted with _id:', result.insertedId);
    } catch (err) {
        console.error('Error inserting document:', err);
    }
}

module.exports = {
    insertDocument
}