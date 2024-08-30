const ConfigRepository = require("@data/config.js");

class ConfigService {
   async setLanguageByGuildId(guildId, language) {
      const configRepository = await ConfigRepository.getInstance();
      const languages = language === "ANY" ? [] : [language];
      const update = { $set: { languages: languages } };
      return await configRepository.updateConfigByGuildId(guildId, update);
   }

   async setPrefixByGuildId(guildId, prefix) {
      const configRepository = await ConfigRepository.getInstance();
      prefix += " "; // Add space so that there's a space between prefix and input
      const update = { $set: { prefix: prefix } };
      return await configRepository.updateConfigByGuildId(guildId, update);
   }

   async deleteConfigsByGuildId(guildId) {
      const configRepository = await ConfigRepository.getInstance();
      return await configRepository.deleteConfigsByGuildId(guildId);
   }
}

module.exports = ConfigService;
