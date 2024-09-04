class BanAction {
   guildId;
   actorId;
   actorUsername;
   userId;
   userUsername;
   type;
   reason;
   createdDate;
   lastModifiedDate;
   lastModifiedBy;

   constructor(guildId, actorId, actorUsername, userId, userUsername, type, reason) {
      this.guildId = guildId;
      this.actorId = actorId;
      this.actorUsername = actorUsername;
      this.userId = userId;
      this.userUsername = userUsername;
      this.type = type;
      this.reason = reason;
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
