const StoryRepository = require("@data/story.js");

class StoryService {
   async insertStory(story) {
      const storyRepository = await StoryRepository.getInstance();

      story.guildStoryIdentifier = await this.#generateGuildStoryIdentifier(
         story.guildId
      );
      story.createdDate = new Date();
      story.lastModifiedDate = new Date();
      const result = await storyRepository.insertStory(story);
      return result.insertedId;
   }

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
      const story = storyRepository.getOngoingStoryByGuildId(guildId);
      return this.#generateStoryContent(story);
   }

   async getStoryContentByIdentifier(guildId, guildStoryIdentifier) {
      const storyRepository = await StoryRepository.getInstance();
      const story = storyRepository.getStoryByGuildIdAndIdentifier(
         guildId,
         guildStoryIdentifier
      );

      return this.#generateStoryContent(story);
   }

   async getStoriesByGuildId(guildId) {
      const storyRepository = await StoryRepository.getInstance();
      return await storyRepository.getStoriesByGuildId(guildId);
   }

   async setStoryReplyId(client, guildId, messageId) {
      const storyRepository = await StoryRepository.getInstance();
      const story = storyRepository.getOngoingStoryByGuildId(guildId);
      if (story) {
         this.#removePreviousStoryReply(client, story.channelId, story.replyId);
         this.#updateStoryReplyId(story._id, messageId);
      } else {
         console.warn(
            `Warn setStoryReplyId ongoing story for guild ${guildId} does not exist.`
         );
      }
   }

   async #generateGuildStoryIdentifier(guildId) {
      const storyRepository = await StoryRepository.getInstance();
      const latestStory = storyRepository.getLatestStoryByGuildId(guildId);

      if (latestStory) {
         return latestStory.guildStoryIdentifier + 1;
      }
      return 1;
   }

   async #generateStoryContent(story) {
      var storyContent = "";
      if (story) {
         // const storyInputs = await getStoryInputsByStoryId(story._id);
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
