const { getStoryByGuildIdAndIdentifier, getOngoingStoryByGuildId } = require('@data/mongo/story.js');
const { getStoryInputsByStoryId } = require('@data/mongo/storyInput.js');

async function getOngoingStory(guildId) {
    try {
        const story = await getOngoingStoryByGuildId(guildId);
        var storyContent = "";
        if (story) {
            const storyInputs = await getStoryInputsByStoryId(story._id);
            if (storyInputs.length) {
                for (const storyInput of storyInputs) {
                    storyContent += " " + storyInput.message;
                }
            }
        }

        if (storyContent === "") {
            storyContent = "There is no story with this ID.";
        }
        return storyContent;
    } catch (err) {
        console.error('Error getOngoingStory:', err);
    }
}

async function getStory(message) {
    try {
        const story = await getStoryByGuildIdAndIdentifier(message);
        var storyContent = "";
        if (story) {
            const storyInputs = await getStoryInputsByStoryId(story._id);
            if (storyInputs.length) {
                for (const storyInput of storyInputs) {
                    storyContent += " " + storyInput.message;
                }
            }
        }

        if (storyContent === "") {
            storyContent = "There is no story with this ID.";
        }
        return storyContent;
    } catch (err) {
        console.error('Error getStory:', err);
    }
}

module.exports = {
    getStory,
    getOngoingStory
}