const StoryRepository = require("@data/story.js");
const StoryInputRepository = require("@data/storyInput.js");

class StoryService {
   async archiveStory(guildId, title) {
      const storyRepository = await StoryRepository.getInstance();
      const update = {
         $set: {
            title: title,
            archived: true,
         },
      };

      const latestStory = await storyRepository.getOngoingStoryByGuildId(
         guildId
      );

      if (latestStory) {
         await storyRepository.updateStoryById(latestStory._id, update);
         return `The ongoing story has been archived with the title \`${title}\``;
      } else {
         return `There is no ongoing story to archive.`;
      }
   }

   async deleteStoriesByGuildId(guildId) {
      const storyRepository = await StoryRepository.getInstance();
      return await storyRepository.deleteStoriesByGuildId(guildId);
   }

   async getOngoingStoryContent(guildId) {
      const storyRepository = await StoryRepository.getInstance();
      const story = await storyRepository.getOngoingStoryByGuildId(guildId);
      return this.#generateStoryContent(story);
   }

   async getStoryContentByIdentifier(guildId, guildStoryIdentifier) {
      const storyRepository = await StoryRepository.getInstance();
      const story = await storyRepository.getStoryByGuildIdAndIdentifier(
         guildId,
         guildStoryIdentifier
      );

      return await this.#generateStoryContent(story);
   }

   async getStoriesByGuildId(guildId) {
      const storyRepository = await StoryRepository.getInstance();
      return await storyRepository.getStoriesByGuildId(guildId);
   }

   async setStoryReplyId(client, guildId, messageId) {
      const storyRepository = await StoryRepository.getInstance();
      const story = await storyRepository.getOngoingStoryByGuildId(guildId);
      if (story) {
         this.#removePreviousStoryReply(client, story.channelId, story.replyId);
         this.#updateStoryReplyId(story._id, messageId);
      } else {
         console.warn(
            `Warn setStoryReplyId ongoing story for guild ${guildId} does not exist.`
         );
      }
   }

   async #generateStoryContent(story) {
      var storyContent = "";
      if (story) {
         const storyInputRepository = await StoryInputRepository.getInstance();
         const storyInputs = await storyInputRepository.getStoryInputsByStoryId(
            story._id
         );
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

   async #updateStoryReplyId(storyId, messageId) {
      const storyRepository = await StoryRepository.getInstance();
      const update = { $set: { replyId: messageId } };
      return await storyRepository.updateStoryById(storyId, update);
   }

   async #removePreviousStoryReply(client, channelId, replyId) {
      try {
         const channel = await client.channels.fetch(channelId);
         const message = await channel.messages.fetch(replyId);

         if (message) {
            await message.delete();
         }
      } catch (err) {
         console.error("Error removePreviousStoryReply:", err);
      }
   }
}

module.exports = StoryService;
