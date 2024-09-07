const { SlashCommandBuilder } = require("discord.js");

const { withBanCheck } = require("@auth/auth.js");
const StoryService = require("@service/story.js");

const storyService = new StoryService();

async function execute(interaction) {
   const storyId = interaction.options.getInteger("storyid");
   const newTitle = interaction.options.getString("newtitle");

   await interaction.reply(await storyService.renameStory(interaction.guildId, storyId, newTitle));
}

module.exports = {
   data: new SlashCommandBuilder()
      .setName("rename")
      .setDescription("Renames an archived story.")
      .addIntegerOption((option) =>
         option.setName("storyid").setDescription("ID of the story to be renamed").setRequired(true)
      )
      .addStringOption((option) =>
         option
            .setName("newtitle")
            .setDescription("New title of the story to be archived")
            .setRequired(true)
      ),
   execute: withBanCheck(execute),
};
