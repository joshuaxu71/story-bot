class BanAction {
   guildId;
   actorId;
   actorUsername;
   userId;
   userUsername;
   type;
   note;
   createdDate;
   lastModifiedDate;
   lastModifiedBy;

   constructor(guildId, actorId, actorUsername, userId, userUsername, type, note) {
      this.guildId = guildId;
      this.actorId = actorId;
      this.actorUsername = actorUsername;
      this.userId = userId;
      this.userUsername = userUsername;
      this.type = type;
      this.note = note;
      this.createdDate = new Date();
      this.lastModifiedDate = new Date();
      this.lastModifiedBy = actorId;
   }
}

const BanType = Object.freeze({
   BAN: "BAN",
   UNBAN: "UNBAN",
});

module.exports = {
   BanAction,
   BanType,
};
