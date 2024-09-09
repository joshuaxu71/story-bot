const { SlashCommandBuilder } = require("discord.js");

const { withPermissionAndBanCheck } = require("@auth/auth.js");
const BanActionService = require("@service/banAction.js");

const banActionService = new BanActionService();

async function execute(interaction) {
   const user = interaction.options.getUser("user");
   const banActions = await banActionService.getBanActionsByGuildIdAndUserId(
      interaction.guildId,
      user.id
   );

   let banHistory = [];
   if (banActions.length) {
      for (const banAction of banActions) {
         banHistory.push(
            `Date: ${banAction.createdDate}\nActor ID: ${banAction.actorId}\nActor Username: ${banAction.actorUsername}\nNote: ${banAction.note}`
         );
      }
   }

   if (!banActions.length) {
      banHistory.push("There are no ban actions taken against this user yet.");
   }

   await interaction.reply({
      content: banHistory.join("\n\n"),
      ephemeral: true,
   });
}

module.exports = {
   data: new SlashCommandBuilder()
      .setName("ban_history")
      .setDescription("Lists the ban history of a specific user.")
      .addUserOption((option) =>
         option
            .setName("user")
            .setDescription("The user whose ban history you want to view")
            .setRequired(true)
      ),
   execute: withPermissionAndBanCheck(execute),
};
