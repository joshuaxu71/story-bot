const {
   executeWithCatch,
   getDatabaseCollection,
} = require("@data/mongo/dbHelper.js");
const { insertConfig } = require("@data/mongo/config.js");

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
         insertConfig(story.guildId, story.channelId);

         story.guildStoryIdentifier = await generateGuildStoryIdentifier(
            story.guildId
         );
         story.createdDate = new Date();
         story.lastModifiedDate = new Date();
         const result = await this.collection.insertOne(story);
         return result.insertedId;
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

   async getOngoingStoryByGuildId(guildId) {
      return executeWithCatch("getOngoingStoryByGuildId", async () => {
         return await this.collection.findOne({
            guildId: guildId,
            archived: false,
         });
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

   async archiveStory(guildId, title) {
      return executeWithCatch("archiveStory", async () => {
         const latestStory = await this.collection
            .find({ guildId: guildId, archived: false })
            .sort({ createdDate: -1 })
            .limit(1)
            .toArray();

         if (latestStory.length) {
            await this.collection.findOneAndUpdate(
               { _id: latestStory[0]._id },
               {
                  $set: {
                     title: title,
                     archived: true,
                  },
               }
            );
            return `The ongoing story has been archived with the title \`${title}\``;
         } else {
            return `There is no ongoing story to archive.`;
         }
      });
   }

   async findFirstOngoingStoryByGuildId(guildId) {
      return executeWithCatch("findFirstOngoingStoryByGuildId", async () => {
         const document = await this.collection.findOne({
            guildId: guildId,
            archived: false,
         });
         return document;
      });
   }

   async updateStoryLastModifiedData(storyInput) {
      return executeWithCatch("updateStoryLastModifiedData", async () => {
         const document = await this.collection.findOneAndUpdate(
            { _id: storyInput.storyId },
            {
               $set: {
                  lastModifiedDate: new Date(),
                  lastModifiedBy: storyInput.userId,
               },
            }
         );
         return document;
      });
   }

   async updateStoryReplyId(storyId, messageId) {
      return executeWithCatch("updateStoryReplyId", async () => {
         return await this.collection.findOneAndUpdate(
            { _id: storyId },
            { $set: { replyId: messageId } }
         );
      });
   }

   async generateGuildStoryIdentifier(guildId) {
      return executeWithCatch("generateGuildStoryIdentifier", async () => {
         const latestStory = await this.collection
            .find({ guildId: guildId })
            .sort({ createdDate: -1 })
            .limit(1)
            .toArray();
         var guildStoryIdentifier = 1;
         if (latestStory.length) {
            guildStoryIdentifier = latestStory[0].guildStoryIdentifier + 1;
         }

         return guildStoryIdentifier;
      });
   }

   async deleteStoriesByGuildId(guildId) {
      return executeWithCatch("deleteStoriesByGuildId", async () => {
         return await this.collection.deleteMany({ guildId: guildId });
      });
   }
}

module.exports = StoryRepository;
