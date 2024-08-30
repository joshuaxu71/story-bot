class StoryInput {
   storyId;
   guildId;
   channelId;
   userId;
   username;
   message;
   createdDate;

   constructor(message) {
      this.guildId = message.guildId;
      this.channelId = message.channelId;
      this.userId = message.author.id;
      this.username = message.author.username;
      this.message = message.content;

      const trimmedMessage = message.content.trim();
      const lastChar = trimmedMessage.charAt(trimmedMessage.length - 1);
      if (![".", "!", "?"].includes(lastChar)) {
         this.message += ".";
      }
   }
}

module.exports = StoryInput;
