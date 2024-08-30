const { SlashCommandBuilder } = require("discord.js");

const StoryService = require("@service/story.js");

const storyService = new StoryService();

module.exports = {
   data: new SlashCommandBuilder()
      .setName("archive")
      .setDescription(
         "Archives the current ongoing story story and start a new one."
      )
      .addStringOption((option) =>
         option
            .setName("title")
            .setDescription("Title of the story to be archived")
            .setRequired(true)
      ),
   async execute(interaction) {
      const title = interaction.options.getString("title");

      await interaction.reply(
         await storyService.archiveStory(interaction.guildId, title)
      );
   },
};
