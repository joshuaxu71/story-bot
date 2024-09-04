const ConfigRepository = require("@data/config.js");
const StoryRepository = require("@data/story.js");
const StoryInputRepository = require("@data/storyInput.js");

class StoryService {
   async renameStory(guildId, guildStoryIdentifier, newTitle) {
      const storyRepository = await StoryRepository.getInstance();
      const update = {
         $set: {
            title: newTitle,
         },
      };

      const story = await storyRepository.getStoryByGuildIdAndIdentifier(
         guildId,
         guildStoryIdentifier
      );

      if (story) {
         await storyRepository.updateStoryById(story._id, update);
         return `The story has been renamed to \`${newTitle}\` successfully.`;
      } else {
         return `There is no story with that ID.`;
      }
   }

   async deleteStoriesByGuildId(guildId) {
      const storyRepository = await StoryRepository.getInstance();
      return await storyRepository.deleteStoriesByGuildId(guildId);
   }

   async getOngoingStory(guildId) {
      const storyRepository = await StoryRepository.getInstance();
      return await storyRepository.getOngoingStoryByGuildId(guildId);
   }

   async getStoryContentByIdentifier(guildId, guildStoryIdentifier) {
      const storyRepository = await StoryRepository.getInstance();
      const story = await storyRepository.getStoryByGuildIdAndIdentifier(
         guildId,
         guildStoryIdentifier
      );

      return await generateStoryContent(story);
   }

   async getStoriesByGuildId(guildId) {
      const storyRepository = await StoryRepository.getInstance();
      return await storyRepository.getStoriesByGuildId(guildId);
   }

   async setStoryReplyId(client, story, messageId) {
      await this.#removePreviousStoryReply(client, story.channelId, story.replyId);
      await this.#updateStoryReplyId(story._id, messageId);
   }

   async endStory(message, story) {
      const configRepository = await ConfigRepository.getInstance();

      const config = await configRepository.getConfigByGuildId(message.guildId);
      if (message.content.endsWith(config.endingSuffix)) {
         return await this.#archiveStory(story);
      }
   }

   async generateStoryContent(story) {
      var storyContent = "";
      if (story) {
         const storyInputRepository = await StoryInputRepository.getInstance();
         const storyInputs = await storyInputRepository.getStoryInputsByStoryId(story._id);
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
   }

   async #archiveStory(story) {
      const storyRepository = await StoryRepository.getInstance();

      const title = `Archived Story ${story.guildStoryIdentifier}`;
      const update = {
         $set: {
            title: title,
            archived: true,
         },
      };

      await storyRepository.updateStoryById(story._id, update);
      return `The ongoing story has been archived with the title \`${title}\``;
   }

   async #updateStoryReplyId(storyId, messageId) {
      const storyRepository = await StoryRepository.getInstance();
      const update = { $set: { replyId: messageId } };
      return await storyRepository.updateStoryById(storyId, update);
   }

   async #removePreviousStoryReply(client, channelId, replyId) {
      try {
         const channel = await client.channels.fetch(channelId);
         const message = await channel.messages.fetch(replyId);
         await message.delete();
      } catch (err) {
         if (err.code === 10008) {
            console.warn(`Message with ID ${replyId} is not found or already deleted`);
         } else {
            console.error("Error removePreviousStoryReply:", err);
         }
      }
   }
}

module.exports = StoryService;
