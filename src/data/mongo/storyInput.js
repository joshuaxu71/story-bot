const {
   executeWithCatch,
   getDatabaseCollection,
} = require("@data/mongo/dbHelper.js");

const Story = require("@model/story.js");
const StoryInput = require("@model/storyInput.js");

const {
   insertStory,
   findFirstOngoingStoryByGuildId,
   updateStoryLastModifiedData,
} = require("@data/mongo/story.js");
const { isInputValid, getConfigByGuildId } = require("@data/mongo/config.js");

class StoryInputService {
   constructor() {
      this.collectionName = "story_inputs";
   }

   async initialize() {
      this.collection = await getDatabaseCollection(this.collectionName);
   }

   async insertStoryInput(message) {
      return executeWithCatch("insertStoryInput", async () => {
         const config = await getConfigByGuildId(message.guildId);
         if (config) {
            const hasPrefix = message.content.startsWith(config.prefix);
            if (hasPrefix) {
               message.content = message.content.slice(config.prefix.length);
            } else {
               return "Not using prefix, not story input";
            }
         }

         const isValid = await isInputValid(message);
         if (!isValid) {
            return "Input is invalid. Please check the supported language.";
         }

         const storyInput = new StoryInput(message);
         const story = await findFirstOngoingStoryByGuildId(storyInput.guildId);
         if (story) {
            storyInput.storyId = story._id;
         } else {
            const storyId = await insertStory(new Story(storyInput));
            if (storyId) {
               storyInput.storyId = storyId;
            } else {
               throw new Error("New story was not successfully created.");
            }
         }

         storyInput.createdDate = new Date();
         await this.collection.insertOne(storyInput);
         await updateStoryLastModifiedData(storyInput);
      });
   }

   async getStoryInputsByStoryId(storyId) {
      return executeWithCatch("getStoryInputsByStoryId", async () => {
         return await this.collection
            .find({ storyId: storyId })
            .sort({ createdDate: 1 })
            .toArray();
      });
   }

   async deleteStoryInputsByGuildId(guildId) {
      return executeWithCatch("deleteStoryInputsByGuildId", async () => {
         return await this.collection.deleteMany({ guildId: guildId });
      });
   }
}

module.exports = StoryInputService;
