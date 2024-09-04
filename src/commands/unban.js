const { SlashCommandBuilder } = require("discord.js");

const BanActionService = require("@service/banAction.js");
const { BanAction, BanType } = require("@model/banAction.js");

const banActionService = new BanActionService();

module.exports = {
   data: new SlashCommandBuilder()
      .setName("unban")
      .setDescription("Unban a user and allow them to interact with the bot.")
      .addUserOption((option) =>
         option.setName("user").setDescription("The user to unban").setRequired(true)
      )
      .addStringOption((option) =>
         option.setName("reason").setDescription("The reason for the unban").setRequired(false)
      ),
   async execute(interaction) {
      const actor = interaction.user;
      const user = interaction.options.getUser("user");
      const reason = interaction.options.getUser("reason");

      const banAction = new BanAction(
         interaction.guildId,
         actor.id,
         actor.username,
         user.id,
         user.username,
         BanType.UNBAN,
         reason
      );

      const response = await banActionService.insertBanAction(banAction);
      if (response) {
         await interaction.reply({
            content: response,
            ephemeral: true,
         });
      }
   },
};
