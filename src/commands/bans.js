const { SlashCommandBuilder } = require("discord.js");

const { withPermissionAndBanCheck } = require("@auth/auth.js");
const BanActionService = require("@service/banAction.js");

const banActionService = new BanActionService();

async function execute(interaction) {
   const banActions = await banActionService.getCurrentBansByGuildId(interaction.guildId);

   let banHistory = [];
   if (banActions.length) {
      for (const banAction of banActions) {
         banHistory.push(
            `Date: ${banAction.createdDate}\nActor ID: ${banAction.actorId}\nActor Username: ${banAction.actorUsername}\nUser ID: ${banAction.userId}\nUser Username: ${banAction.userUsername}\nNote: ${banAction.note}`
         );
      }
   }

   if (!banActions.length) {
      banHistory.push("There are no banned users.");
   }

   await interaction.reply({
      content: banHistory.join("\n\n"),
      ephemeral: true,
   });
}

module.exports = {
   data: new SlashCommandBuilder()
      .setName("bans")
      .setDescription("Lists the banned users and related information."),
   execute: withPermissionAndBanCheck(execute),
};
