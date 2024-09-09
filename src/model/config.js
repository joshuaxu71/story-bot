class Config {
   guildId;
   prefix;
   endingSuffix;
   languages = [];
   minStoryInputCharacterCount;

   constructor(guildId) {
      this.guildId = guildId;
      this.prefix = Config.DEFAULT_PREFIX;
      this.endingSuffix = Config.DEFAULT_ENDING_SUFFIX;
   }
}

Config.DEFAULT_PREFIX = "✍️ ";
Config.DEFAULT_ENDING_SUFFIX = "📕";

module.exports = Config;
