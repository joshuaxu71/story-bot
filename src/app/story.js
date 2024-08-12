const { getStoryByGuildIdAndIdentifier, getOngoingStoryByGuildId, updateStoryReplyId } = require('@data/mongo/story.js');
const { getStoryInputsByStoryId } = require('@data/mongo/storyInput.js');
const { getConfigByGuildId } = require('@data/mongo/config.js');

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

async function setStoryReplyId(client, guildId, messageId) {
    const story = await getOngoingStoryByGuildId(guildId);
    if (story) {
        removePreviousStoryReply(client, story.channelId, story.replyId);
        updateStoryReplyId(story._id, messageId);
    } else {
        console.warn(`Warn setStoryReplyId ongoing story for guild ${guildId} does not exist.`);
    }
}

async function removePreviousStoryReply(client, channelId, replyId) {
    try {
        const channel = await client.channels.fetch(channelId);
        const message = await channel.messages.fetch(replyId);

        if (message) {
            await message.delete();
        }
    } catch (err) {
        console.error('Error removePreviousStoryReply:', err);
    }
}

async function getStoryContentByIdentifier(guildId, guildStoryIdentifier) {
    try {
        const story = await getStoryByGuildIdAndIdentifier(guildId, guildStoryIdentifier);
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
        console.error('Error getStoryContentByIdentifier:', err);
    }
}

module.exports = {
    getStoryContentByIdentifier,
    getOngoingStory,
    setStoryReplyId
}