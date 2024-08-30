const { executeWithCatch, getDatabaseCollection } = require("@data/mongo.js");

class StoryInputRepository {
   constructor() {
      if (StoryInputRepository.instance) {
         return StoryInputRepository.instance;
      }
      this.collectionName = "story_inputs";
      StoryInputRepository.instance = this;
   }

   static async getInstance() {
      if (!StoryInputRepository.instance) {
         StoryInputRepository.instance = new StoryInputRepository();
         await StoryInputRepository.instance.initialize();
      }
      return StoryInputRepository.instance;
   }

   async initialize() {
      this.collection = await getDatabaseCollection(this.collectionName);
   }

   async insertStoryInput(storyInput) {
      return executeWithCatch("insertStoryInput", async () => {
         await this.collection.insertOne(storyInput);
      });
   }

   async deleteStoryInputsByGuildId(guildId) {
      return executeWithCatch("deleteStoryInputsByGuildId", async () => {
         return await this.collection.deleteMany({ guildId: guildId });
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
}

module.exports = StoryInputRepository;
