const { SlashCommandBuilder } = require("discord.js");

const StoryService = require("@service/story.js");

module.exports = {
   data: new SlashCommandBuilder()
      .setName("story")
      .setDescription("Shows the content of the story ID.")
      .addIntegerOption((option) =>
         option
            .setName("storyid")
            .setDescription("ID of the story to be shown")
            .setRequired(true)
      ),
   async execute(interaction) {
      const storyService = await StoryService.getInstance();
      const storyId = interaction.options.getInteger("storyid");

      await interaction.reply(
         await storyService.getStoryContentByIdentifier(
            interaction.guildId,
            storyId
         )
      );
   },
};
