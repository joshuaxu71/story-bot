class Config {
   guildId;
   channelId;
   prefix = ":writing_hand: ";
   languages = [];
   endingText;
   minStoryInputLength;

   constructor(guildId, channelId) {
      this.guildId = guildId;
      this.channelId = channelId;
   }
}

module.exports = Config;
