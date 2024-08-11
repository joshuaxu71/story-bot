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
        console.error('Error insertStory:', err);
    }
}

async function archiveStory(message) {
    try {
        const db = await connectToDatabase();
        const collection = db.collection(collection_name);

        await collection.findOneAndUpdate(
            {guildId: message.guildId},
            {
                $set: {
                    archived: true,
                }
            },
        );
    } catch (err) {
        console.error('Error archiveStory:', err);
    }
}

async function findFirstStoryByGuildId(guildId) {
    try {
        const db = await connectToDatabase();
        const collection = db.collection(collection_name);

        const document = await collection.findOne({guildId: guildId, archived: false});
        return document;
    } catch (err) {
        console.error('Error findFirstStoryByGuildId:', err);
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
        console.error("Error updateStoryLastModifiedData:", err);
        return null;
    }
}

module.exports = {
    insertStory,
    archiveStory,
    findFirstStoryByGuildId,
    updateStoryLastModifiedData
}