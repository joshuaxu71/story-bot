const { SlashCommandBuilder } = require("discord.js");

const { withPermissionAndBanCheck } = require("@auth/auth.js");
const PermissionService = require("@service/permission.js");

const permissionService = new PermissionService();

async function execute(interaction) {
   const permissions = await permissionService.getPermissionsByGuildId(interaction.guildId);

   const permissionMap = new Map();
   if (permissions.length) {
      permissionMap.set("ADMINISTRATOR", []);
      for (const permission of permissions) {
         permissionMap.get(permission.type).push(`${permission.roleName} (${permission.roleId})`);
      }
   }

   let response = "";
   if (permissionMap.size === 0) {
      response = "There are no configured permissions yet.";
   }

   for (const [type, roles] of permissionMap) {
      if (roles.length) {
         response += `## ${type}\n`;
         for (const role of roles) {
            response += `${role}\n`;
         }
      }
   }

   await interaction.reply({
      content: response,
      ephemeral: true,
   });
}

module.exports = {
   data: new SlashCommandBuilder()
      .setName("permissions")
      .setDescription("View the permissions configuration in the guild."),
   execute: withPermissionAndBanCheck(execute),
};
