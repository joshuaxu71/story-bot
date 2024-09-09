const { SlashCommandBuilder } = require("discord.js");

const { withBanCheck } = require("@auth/auth.js");
const PermissionService = require("@service/permission.js");

const permissionService = new PermissionService();

async function execute(interaction) {
   const role = interaction.options.getRole("role");
   const type = interaction.options.getString("type");

   const response = await permissionService.insertPermission(interaction.guildId, role, type);
   if (response) {
      await interaction.reply({
         content: response,
         ephemeral: true,
      });
   }
}

module.exports = {
   data: new SlashCommandBuilder()
      .setName("permission")
      .setDescription("Set the permission level of a certain role.")
      .addRoleOption((option) =>
         option
            .setName("role")
            .setDescription("The role whose permission is to be set")
            .setRequired(true)
      )
      .addStringOption((option) =>
         option
            .setName("type")
            .setDescription("The permission type")
            .setRequired(true)
            .addChoices({ name: "Administrator", value: "ADMINISTRATOR" })
      ),
   execute: withBanCheck(execute),
};
