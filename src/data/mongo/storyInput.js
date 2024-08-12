const { connectToDatabase } = require('@data/mongo.js');

const Story = require('@model/story.js');
const StoryInput = require('@model/storyInput.js');

const { insertStory, findFirstOngoingStoryByGuildId, updateStoryLastModifiedData } = require('@data/mongo/story.js');
const { isInputValid } = require('@data/mongo/config.js');

const collection_name = 'story_inputs';

async function insertStoryInput(message) {
    try {
        const db = await connectToDatabase();
        const collection = db.collection(collection_name);

        const isValid = await isInputValid(message);
        if (!isValid) {
            return "Input is invalid. Please check the supported language."
        }

        const storyInput = new StoryInput(message);
        const story = await findFirstOngoingStoryByGuildId(storyInput.guildId)
        if (story) {
            storyInput.storyId = story._id
        } else {
            const storyId = await insertStory(new Story(storyInput))
            if (storyId) {
                storyInput.storyId = storyId
            } else {
                throw new Error('New story was not successfully created.');
            }
        }

        storyInput.createdDate = new Date();
        await collection.insertOne(storyInput);    
        await updateStoryLastModifiedData(storyInput);
    } catch (err) {
        console.error('Error insertStoryInput:', err);
    }
}

async function getStoryInputsByStoryId(storyId) {
    try {
        const db = await connectToDatabase();
        const collection = db.collection(collection_name);

        return await collection.find({storyId: storyId})
            .sort({createdDate: 1})
            .toArray();
    } catch (err) {
        console.error('Error getStoryContentByStoryId:', err);
    }
}

async function deleteStoryInputsByGuildId(guildId) {
    try {
        const db = await connectToDatabase();
        const collection = db.collection(collection_name);

        return await collection.deleteMany({ guildId: guildId })
    } catch (err) {
        console.error('Error deleteStoryInputsByGuildId:', err);
    }
}

module.exports = {
    insertStoryInput,
    getStoryInputsByStoryId,
    deleteStoryInputsByGuildId
}