const { SlashCommandBuilder } = require("discord.js");

const BanActionService = require("@service/banAction.js");
const { BanAction, BanType } = require("@model/banAction.js");

const banActionService = new BanActionService();

module.exports = {
   data: new SlashCommandBuilder()
      .setName("ban")
      .setDescription("Ban a user and prevent them from interacting with the bot.")
      .addUserOption((option) =>
         option.setName("user").setDescription("The user to ban").setRequired(true)
      )
      .addStringOption((option) =>
         option
            .setName("note")
            .setDescription("The note for the ban, could write the reason here")
            .setRequired(false)
      ),
   async execute(interaction) {
      const actor = interaction.user;
      const user = interaction.options.getUser("user");
      const note = interaction.options.getString("note");

      const banAction = new BanAction(
         interaction.guildId,
         actor.id,
         actor.username,
         user.id,
         user.username,
         BanType.BAN,
         note
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
