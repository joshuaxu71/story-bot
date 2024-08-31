const { SlashCommandBuilder } = require("discord.js");

const StoryInputService = require("@service/storyInput.js");

const storyInputService = new StoryInputService();

module.exports = {
   data: new SlashCommandBuilder()
      .setName("delete_story_input")
      .setDescription("Deletes a story input.")
      .addStringOption((option) =>
         option
            .setName("storyinputid")
            .setDescription("ID of the story input to be deleted")
            .setRequired(true)
      ),
   async execute(interaction) {
      const storyInputId = interaction.options.getString("storyinputid");

      if (await storyInputService.deleteStoryInputById(storyInputId)) {
         await interaction.reply(`Story input been deleted successfully.`);
      }
   },
};
