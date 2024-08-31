const { SlashCommandBuilder } = require("discord.js");

const ConfigService = require("@service/config.js");

const configService = new ConfigService();

module.exports = {
   data: new SlashCommandBuilder()
      .setName("minimum_story_input_length")
      .setDescription("Configure the minimum character count for story inputs.")
      .addIntegerOption((option) =>
         option
            .setName("count")
            .setDescription("Minimum character count for story inputs")
            .setRequired(true)
      ),
   async execute(interaction) {
      const minStoryInputCharacterCount = interaction.options.getInteger("count");

      if (
         await configService.setMinStoryInputCharacterCountByGuildId(
            interaction.guildId,
            minStoryInputCharacterCount
         )
      ) {
         await interaction.reply(`Minimum character count has been configured successfully.`);
      }
   },
};
