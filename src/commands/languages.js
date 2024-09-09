const { SlashCommandBuilder } = require("discord.js");

const { withPermissionAndBanCheck } = require("@auth/auth.js");
const ConfigService = require("@service/config.js");

const configService = new ConfigService();

async function execute(interaction) {
   const language = interaction.options.getString("language");

   if (await configService.setLanguageByGuildId(interaction.guildId, language)) {
      await interaction.reply(`Language has been configured successfully.`);
   }
}

module.exports = {
   data: new SlashCommandBuilder()
      .setName("language")
      .setDescription("Configure what language input is valid for the story inputs.")
      .addStringOption((option) =>
         option
            .setName("language")
            .setDescription("Choose from the available languages")
            .setRequired(true)
            .addChoices(
               { name: "Korean", value: "KR" },
               { name: "English", value: "EN" },
               { name: "Any", value: "ANY" }
            )
      ),
   execute: withPermissionAndBanCheck(execute),
};
