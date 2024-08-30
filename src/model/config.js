class Config {
   guildId;
   channelId;
   prefix;
   languages = [];
   endingText;
   minStoryInputLength;

   constructor(guildId, channelId) {
      this.guildId = guildId;
      this.channelId = channelId;
      this.prefix = Config.DEFAULT_PREFIX;
   }
}

Config.DEFAULT_PREFIX = "✍️ ";

module.exports = Config;
