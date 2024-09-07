class Story {
   guildId;
   guildStoryIdentifier;
   replyId;
   replyChannelId;
   title;
   archived = false;
   createdDate;
   lastModifiedDate;
   lastModifiedBy;

   constructor(storyInput) {
      this.guildId = storyInput.guildId;
      this.lastModifiedBy = storyInput.userId;
   }
}

module.exports = Story;
