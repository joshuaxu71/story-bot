const { SlashCommandBuilder } = require("discord.js");

const { withBanCheck } = require("@auth/auth.js");
const ConfigService = require("@service/config.js");

const configService = new ConfigService();

async function execute(interaction) {
   console.log("here");
   const prefix = interaction.options.getString("prefix");

   if (await configService.setPrefixByGuildId(interaction.guildId, prefix)) {
      await interaction.reply(`Prefix has been configured successfully.`);
   }
}

module.exports = {
   data: new SlashCommandBuilder()
      .setName("prefix")
      .setDescription("Configure what the prefix is for story inputs.")
      .addStringOption((option) =>
         option.setName("prefix").setDescription("Prefix for story inputs").setRequired(true)
      ),
   execute: withBanCheck(execute),
};
