const {
   getDatabaseCollection,
   executeWithCatch,
} = require("@data/mongo/dbHelper.js");
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
            await this.collection.insertOne(new Config(guildId, channelId));
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

   async setLanguageByGuildId(guildId, language) {
      return executeWithCatch("setLanguageByGuildId", async () => {
         const languages = language === "ANY" ? [] : [language];
         return await this.collection.findOneAndUpdate(
            { guildId: guildId },
            { $set: { languages: languages } }
         );
      });
   }

   async setPrefixByGuildId(guildId, prefix) {
      return executeWithCatch("setPrefixByGuildId", async () => {
         return await this.collection.findOneAndUpdate(
            { guildId: guildId },
            { $set: { prefix: prefix + " " } } // Add space so that there's a space between prefix and input
         );
      });
   }

   async isInputValid(message) {
      return executeWithCatch("isInputValid", async () => {
         const config = await this.getConfigByGuildId(message.guildId);
         if (!config || !config.languages.length) {
            return true;
         }

         const allowedLanguages = config.languages[0];
         if (
            allowedLanguages === "EN" &&
            this.containsKorean(message.content)
         ) {
            return false;
         } else if (
            allowedLanguages === "KR" &&
            this.containsEnglish(message.content)
         ) {
            return false;
         }
         return true;
      });
   }

   containsKorean(str) {
      const koreanRegex = /[가-힣]/;
      return koreanRegex.test(str);
   }

   containsEnglish(str) {
      const englishRegex = /[a-zA-Z]/;
      return englishRegex.test(str);
   }
}

module.exports = ConfigRepository;
