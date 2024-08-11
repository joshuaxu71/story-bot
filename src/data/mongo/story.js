const { connectToDatabase } = require('@data/mongo.js');

const collection_name = 'stories';

async function insertStory(story) {
    try {
        const db = await connectToDatabase();
        const collection = db.collection(collection_name);

        story.createdDate = new Date();
        story.lastModifiedDate = new Date();
        const result = await collection.insertOne(story);
        return result.insertedId;
    } catch (err) {
        console.error('Error inserting document:', err);
    }
}

async function findFirstStoryByGuildId(guildId) {
    try {
        const db = await connectToDatabase();
        const collection = db.collection(collection_name);

        const document = await collection.findOne({guildId: guildId, archived: false});
        return document;
    } catch (err) {
        console.error('Error finding document:', err);
        return null;
    }
}

async function updateStoryLastModifiedData(storyInput) {
    try {
        const db = await connectToDatabase();
        const collection = db.collection(collection_name);

        const document = await collection.findOneAndUpdate(
            {_id: storyInput.storyId},
            {
                $set: {
                    lastModifiedDate: new Date(),
                    lastModifiedBy: storyInput.userId
                }
            },
        );
        return document;
    } catch (err) {
        console.error('Error finding document:', err);
        return null;
    }
}

module.exports = {
    insertStory,
    findFirstStoryByGuildId,
    updateStoryLastModifiedData
}