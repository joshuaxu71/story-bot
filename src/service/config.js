const ConfigRepository = require("@data/config.js");

class ConfigService {
   async setLanguageByGuildId(guildId, language) {
      const configRepository = await ConfigRepository.getInstance();
      const config = await this.#getConfigByGuildId(configRepository, guildId);

      const languages = language === "ANY" ? [] : [language];
      const update = { $set: { languages: languages } };
      return await configRepository.updateConfigById(config._id, update);
   }

   async setPrefixByGuildId(guildId, prefix) {
      const configRepository = await ConfigRepository.getInstance();
      const config = await this.#getConfigByGuildId(configRepository, guildId);

      prefix += " "; // Add space so that there's a space between prefix and input
      const update = { $set: { prefix: prefix } };
      return await configRepository.updateConfigById(config._id, update);
   }

   async setEndingSuffixByGuildId(guildId, suffix) {
      const configRepository = await ConfigRepository.getInstance();
      const config = await this.#getConfigByGuildId(configRepository, guildId);

      const update = { $set: { endingSuffix: suffix } };
      return await configRepository.updateConfigById(config._id, update);
   }

   async setMinStoryInputCharacterCountByGuildId(guildId, minStoryInputCharacterCount) {
      const configRepository = await ConfigRepository.getInstance();
      const config = await this.#getConfigByGuildId(configRepository, guildId);

      const update = {
         $set: { minStoryInputCharacterCount: minStoryInputCharacterCount },
      };
      return await configRepository.updateConfigById(config._id, update);
   }

   async deleteConfigsByGuildId(guildId) {
      const configRepository = await ConfigRepository.getInstance();
      return await configRepository.deleteConfigsByGuildId(guildId);
   }

   async #getConfigByGuildId(configRepository, guildId) {
      const config = await configRepository.getConfigByGuildId(guildId);
      if (config) {
         return config;
      }
      return await configRepository.insertConfig(guildId);
   }
}

module.exports = ConfigService;
