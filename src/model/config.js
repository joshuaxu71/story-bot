class Config {
   guildId;
   channelId;
   prefix;
   endingSuffix;
   languages = [];
   minStoryInputCharacterCount;

   constructor(guildId, channelId) {
      this.guildId = guildId;
      this.channelId = channelId;
      this.prefix = Config.DEFAULT_PREFIX;
      this.endingSuffix = Config.DEFAULT_ENDING_SUFFIX;
   }
}

Config.DEFAULT_PREFIX = "✍️ ";
Config.DEFAULT_ENDING_SUFFIX = "📕";

module.exports = Config;
