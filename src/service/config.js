const ConfigRepository = require("@data/mongo/config.js");

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

   async #isInputValid(message) {
      const configRepository = await ConfigRepository.getInstance();
      const config = await configRepository.getConfigByGuildId(message.guildId);

      if (!config || !config.languages.length) {
         return true;
      }

      const allowedLanguages = config.languages[0];
      if (allowedLanguages === "EN" && this.#containsKorean(message.content)) {
         return false;
      } else if (
         allowedLanguages === "KR" &&
         this.#containsEnglish(message.content)
      ) {
         return false;
      }
      return true;
   }

   #containsKorean(str) {
      const koreanRegex = /[가-힣]/;
      return koreanRegex.test(str);
   }

   #containsEnglish(str) {
      const englishRegex = /[a-zA-Z]/;
      return englishRegex.test(str);
   }
}

module.exports = ConfigService;
