const { SlashCommandBuilder } = require("discord.js");

const { withBanCheck } = require("@auth/auth.js");
const StoryService = require("@service/story.js");

const storyService = new StoryService();

async function execute(interaction) {
   const storyId = interaction.options.getInteger("storyid");

   await interaction.reply(
      await storyService.getStoryContentByIdentifier(interaction.guildId, storyId)
   );
}

module.exports = {
   data: new SlashCommandBuilder()
      .setName("story")
      .setDescription("Shows the content of the story.")
      .addIntegerOption((option) =>
         option.setName("storyid").setDescription("ID of the story to be shown").setRequired(true)
      ),
   execute: withBanCheck(execute),
};
