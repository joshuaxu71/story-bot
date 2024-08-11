const { connectToDatabase } = require('@data/mongo.js');

const Story = require('@model/story.js');

const { insertStory, findFirstStoryByGuildId, updateStoryLastModifiedData } = require('@data/mongo/story.js');

const collection_name = 'story_inputs';

async function insertStoryInput(storyInput) {
    try {
        const db = await connectToDatabase();
        const collection = db.collection(collection_name);

        const story = await findFirstStoryByGuildId(storyInput.guildId)
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

module.exports = {
    insertStoryInput
}