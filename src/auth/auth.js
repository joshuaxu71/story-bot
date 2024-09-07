const BanActionRepository = require("@data/banAction.js");
const { BanType } = require("@model/banAction.js");

function withBanCheck(handler) {
   return async function (interaction) {
      if (await isUserBanned(interaction.guildId, interaction.user.id)) {
         return await interaction.reply({
            content: "You are banned from interacting with the bot.",
            ephemeral: true,
         });
      }

      // Proceed with the original handler if not banned
      return handler(interaction);
   };
}

async function isUserBanned(guildId, userId) {
   const banActionRepository = await BanActionRepository.getInstance();

   const latestBanAction = await banActionRepository.getLatestBanActionByGuildIdAndUserId(
      guildId,
      userId
   );

   if (latestBanAction) {
      if (latestBanAction.type === BanType.BAN) {
         return true;
      }
   }
   return false;
}

module.exports = {
   withBanCheck,
   isUserBanned,
};
