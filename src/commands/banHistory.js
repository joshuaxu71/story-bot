const { SlashCommandBuilder } = require("discord.js");

const BanActionService = require("@service/banAction.js");

const banActionService = new BanActionService();

module.exports = {
   data: new SlashCommandBuilder()
      .setName("ban_history")
      .setDescription("Lists the ban history of a specific user or the server.")
      .addUserOption((option) =>
         option
            .setName("user")
            .setDescription("The user whose ban history you want to view")
            .setRequired(false)
      ),
   async execute(interaction) {
      const user = interaction.options.getUser("user");
      let banActions;
      if (user) {
         banActions = await banActionService.getBanActionsByGuildIdAndUserId(
            interaction.guildId,
            user.id
         );
      } else {
         banActions = await banActionService.getBanActionsByGuildId(interaction.guildId);
      }

      let banHistory = [];
      if (banActions.length) {
         for (const banAction of banActions) {
            banHistory.push(
               `actor ID: ${banAction.actorId}\nactor username: ${banAction.actorUsername}\nuser ID: ${banAction.userId}\nuser username: ${banAction.userUsername}\nnote: ${banAction.note}`
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
   },
};
