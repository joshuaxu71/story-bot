const { executeWithCatch, getDatabaseCollection } = require("@data/mongo.js");

class StoryRepository {
   constructor() {
      if (StoryRepository.instance) {
         return StoryRepository.instance;
      }
      this.collectionName = "stories";
      StoryRepository.instance = this;
   }

   static async getInstance() {
      if (!StoryRepository.instance) {
         StoryRepository.instance = new StoryRepository();
         await StoryRepository.instance.initialize();
      }
      return StoryRepository.instance;
   }

   async initialize() {
      this.collection = await getDatabaseCollection(this.collectionName);
   }

   async insertStory(story) {
      return executeWithCatch("insertStory", async () => {
         const latestStory = await this.getLatestStoryByGuildId(story.guildId);

         let guildStoryIdentifier = 1;
         if (latestStory) {
            guildStoryIdentifier = latestStory.guildStoryIdentifier + 1;
         }

         story.guildStoryIdentifier = guildStoryIdentifier;
         story.createdDate = new Date();
         story.lastModifiedDate = new Date();
         const result = await this.collection.insertOne(story);
         return result.insertedId;
      });
   }

   async updateStoryById(id, update) {
      return executeWithCatch("updateStoryById", async () => {
         return await this.collection.findOneAndUpdate({ _id: id }, update);
      });
   }

   async deleteStoriesByGuildId(guildId) {
      return executeWithCatch("deleteStoriesByGuildId", async () => {
         return await this.collection.deleteMany({ guildId: guildId });
      });
   }

   async getStoryByGuildIdAndIdentifier(guildId, guildStoryIdentifier) {
      return executeWithCatch("getStoryByGuildIdAndIdentifier", async () => {
         return await this.collection.findOne({
            guildId: guildId,
            guildStoryIdentifier: guildStoryIdentifier,
         });
      });
   }

   async getOngoingStoryByGuildId(guildId) {
      return executeWithCatch("getOngoingStoryByGuildId", async () => {
         return await this.collection.findOne({
            guildId: guildId,
            archived: false,
         });
      });
   }

   async getLatestStoryByGuildId(guildId) {
      return executeWithCatch("getLatestStoryByGuildId", async () => {
         const latestStory = await this.collection
            .find({ guildId: guildId })
            .sort({ createdDate: -1 })
            .limit(1)
            .toArray();
         if (latestStory.length) {
            return latestStory[0];
         }
      });
   }

   async getStoriesByGuildId(guildId) {
      return executeWithCatch("getStoriesByGuildId", async () => {
         const stories = await this.collection
            .find({ guildId: guildId })
            .sort({ createdDate: 1 })
            .toArray();
         return stories;
      });
   }
}

module.exports = StoryRepository;
