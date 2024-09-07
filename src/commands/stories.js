const { SlashCommandBuilder } = require("discord.js");

const { withBanCheck } = require("@auth/auth.js");
const StoryService = require("@service/story.js");

const storyService = new StoryService();

async function execute(interaction) {
   const stories = await storyService.getStoriesByGuildId(interaction.guildId);

   storyTitles = [];
   if (stories.length) {
      for (const story of stories) {
         if (!story.title) {
            story.title = "<<ongoing story>>";
         }
         storyTitles.push(`${story.guildStoryIdentifier}. ${story.title}`);
      }
   }

   if (!storyTitles.length) {
      storyTitles.push("There are no stories yet.");
   }

   await interaction.reply(storyTitles.join("\n"));
}

module.exports = {
   data: new SlashCommandBuilder()
      .setName("stories")
      .setDescription("Lists all the stories in the guild."),
   execute: withBanCheck(execute),
};
