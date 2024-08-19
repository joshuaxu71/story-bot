const { getDatabaseCollection, executeWithCatch } = require("@data/mongo.js");
const Config = require("@model/config.js");

class ConfigRepository {
   constructor() {
      if (ConfigRepository.instance) {
         return ConfigRepository.instance;
      }
      this.collectionName = "configs";
      ConfigRepository.instance = this;
   }

   static async getInstance() {
      if (!ConfigRepository.instance) {
         ConfigRepository.instance = new ConfigRepository();
         await ConfigRepository.instance.initialize();
      }
      return ConfigRepository.instance;
   }

   async initialize() {
      this.collection = await getDatabaseCollection(this.collectionName);
   }

   async insertConfig(guildId, channelId) {
      return executeWithCatch("insertConfig", async () => {
         const config = await this.getConfigByGuildId(guildId);
         if (!config) {
            return await this.collection.insertOne(
               new Config(guildId, channelId)
            );
         }
      });
   }

   async updateConfigByGuildId(guildId, update) {
      return executeWithCatch("updateConfigByGuildId", async () => {
         return await this.collection.findOneAndUpdate(
            { guildId: guildId },
            update
         );
      });
   }

   async deleteConfigsByGuildId(guildId) {
      return executeWithCatch("deleteConfigsByGuildId", async () => {
         return await this.collection.deleteMany({ guildId: guildId });
      });
   }

   async getConfigByGuildId(guildId) {
      return executeWithCatch("getConfigByGuildId", async () => {
         return await this.collection.findOne({ guildId: guildId });
      });
   }
}

module.exports = ConfigRepository;
