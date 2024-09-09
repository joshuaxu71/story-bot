const BanActionRepository = require("@data/banAction.js");
const { BanType } = require("@model/banAction.js");

class BanActionService {
   async insertBanAction(banAction) {
      const banActionRepository = await BanActionRepository.getInstance();

      const latestBanAction = await banActionRepository.getLatestBanActionByGuildIdAndUserId(
         banAction.guildId,
         banAction.userId
      );
      if (latestBanAction) {
         if (latestBanAction.type === banAction.type) {
            if (banAction.type === BanType.BAN) {
               return "User is already banned.";
            } else {
               return "User is already unbanned.";
            }
         }
      } else if (banAction.type === BanType.UNBAN) {
         return "User cannot be unbanned because they have never been banned.";
      }

      await banActionRepository.insertBanAction(banAction);

      if (banAction.type === BanType.BAN) {
         return `The user \`${banAction.userUsername}\` has been banned successfully.`;
      } else {
         return `The user \`${banAction.userUsername}\` has been unbanned successfully.`;
      }
   }

   async getLatestBanActionByGuildIdAndUserId(guildId, userId) {
      const banActionRepository = await BanActionRepository.getInstance();
      return await banActionRepository.getLatestBanActionByGuildIdAndUserId(guildId, userId);
   }

   async getCurrentBansByGuildId(guildId) {
      const banActionRepository = await BanActionRepository.getInstance();
      return await banActionRepository.getCurrentBansByGuildId(guildId);
   }

   async getBanActionsByGuildId(guildId) {
      const banActionRepository = await BanActionRepository.getInstance();
      return await banActionRepository.getBanActionsByGuildId(guildId);
   }

   async getBanActionsByGuildIdAndUserId(guildId, userId) {
      const banActionRepository = await BanActionRepository.getInstance();
      return await banActionRepository.getBanActionsByGuildIdAndUserId(guildId, userId);
   }
}

module.exports = BanActionService;
