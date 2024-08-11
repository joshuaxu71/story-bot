const { connectToDatabase } = require('@data/mongo.js');

const collection_name = 'stories';

async function insertStory(story) {
    try {
        const db = await connectToDatabase();
        const collection = db.collection(collection_name);

        story.guildStoryIdentifier = await generateGuildStoryIdentifier(story.guildId);
        story.createdDate = new Date();
        story.lastModifiedDate = new Date();
        const result = await collection.insertOne(story);
        return result.insertedId;
    } catch (err) {
        console.error('Error insertStory:', err);
    }
}

async function getStoriesByGuildId(guildId) {
    try {
        const db = await connectToDatabase();
        const collection = db.collection(collection_name);

        const stories = await collection.find({guildId: guildId})
            .sort({createdDate: 1})
            .toArray();
        return stories;
    } catch (err) {
        console.error('Error getStoriesByGuildId:', err);
    }
}

async function getStoryByGuildIdAndIdentifier(message) {
    try {
        const db = await connectToDatabase();
        const collection = db.collection(collection_name);

        return await collection.findOne({guildId: message.guildId, guildStoryIdentifier: parseInt(message.content)});
    } catch (err) {
        console.error('Error getStoryByGuildIdAndIdentifier:', err);
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
                    title: message.content,
                    archived: true,
                }
            },
        );
    } catch (err) {
        console.error('Error archiveStory:', err);
    }
}

async function findFirstOngoingStoryByGuildId(guildId) {
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

async function generateGuildStoryIdentifier(guildId) {
    try {
        const db = await connectToDatabase();
        const collection = db.collection(collection_name);

        const latestStory = await collection.find({guildId: guildId})
            .sort({createdDate: -1})
            .limit(1)
            .toArray();
        var guildStoryIdentifier = 1
        if (latestStory.length) {
            guildStoryIdentifier = latestStory[0].guildStoryIdentifier + 1
        }
        
        return guildStoryIdentifier;
    } catch (err) {
        console.error('Error insertStory:', err);
    }
}

module.exports = {
    insertStory,
    getStoryByGuildIdAndIdentifier,
    archiveStory,
    findFirstOngoingStoryByGuildId,
    updateStoryLastModifiedData,
    getStoriesByGuildId
}