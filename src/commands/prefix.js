const { SlashCommandBuilder } = require("discord.js");

const ConfigService = require("@service/config.js");

module.exports = {
   data: new SlashCommandBuilder()
      .setName("prefix")
      .setDescription("Configure what the prefix should be for story inputs.")
      .addStringOption((option) =>
         option
            .setName("prefix")
            .setDescription("Prefix for story inputs")
            .setRequired(true)
      ),
   async execute(interaction) {
      const configService = new ConfigService();
      const prefix = interaction.options.getString("prefix");

      if (await configService.setPrefixByGuildId(interaction.guildId, prefix)) {
         await interaction.reply(`Prefix has been configured successfully.`);
      }
   },
};
