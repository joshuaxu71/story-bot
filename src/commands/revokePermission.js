const { SlashCommandBuilder } = require("discord.js");

const { withPermissionAndBanCheck, invalidatePermissionCache } = require("@auth/auth.js");
const PermissionService = require("@service/permission.js");

const permissionService = new PermissionService();

async function execute(interaction) {
   const role = interaction.options.getRole("role");

   const response = await permissionService.revokePermissionByGuildIdAndRoleId(
      interaction.guildId,
      role.id
   );

   if (response) {
      await interaction.reply({
         content: response,
         ephemeral: true,
      });
   }
   invalidatePermissionCache(interaction.guildId, role.id);
}

module.exports = {
   data: new SlashCommandBuilder()
      .setName("revoke_permission")
      .setDescription("Revoke the permission given to a certain role.")
      .addRoleOption((option) =>
         option
            .setName("role")
            .setDescription("The role whose permission is to be revoked")
            .setRequired(true)
      ),
   execute: withPermissionAndBanCheck(execute),
};
