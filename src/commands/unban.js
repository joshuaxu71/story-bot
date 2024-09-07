const { SlashCommandBuilder } = require("discord.js");

const { withBanCheck, invalidateBanCache } = require("@auth/auth.js");
const BanActionService = require("@service/banAction.js");
const { BanAction, BanType } = require("@model/banAction.js");

const banActionService = new BanActionService();

async function execute(interaction) {
   const actor = interaction.user;
   const user = interaction.options.getUser("user");
   const note = interaction.options.getUser("note");

   const banAction = new BanAction(
      interaction.guildId,
      actor.id,
      actor.username,
      user.id,
      user.username,
      BanType.UNBAN,
      note
   );

   const response = await banActionService.insertBanAction(banAction);
   if (response) {
      await interaction.reply({
         content: response,
         ephemeral: true,
      });
   }
   invalidateBanCache(interaction.guildId, user.id);
}

module.exports = {
   data: new SlashCommandBuilder()
      .setName("unban")
      .setDescription("Unban a user and allow them to interact with the bot.")
      .addUserOption((option) =>
         option.setName("user").setDescription("The user to unban").setRequired(true)
      )
      .addStringOption((option) =>
         option.setName("note").setDescription("The note for the unban").setRequired(false)
      ),
   execute: withBanCheck(execute),
};
