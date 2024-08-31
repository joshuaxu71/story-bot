const { SlashCommandBuilder } = require("discord.js");

const StoryInputService = require("@service/storyInput.js");

const storyInputService = new StoryInputService();

module.exports = {
   data: new SlashCommandBuilder()
      .setName("story_inputs")
      .setDescription("Shows the story inputs of a story.")
      .addIntegerOption((option) =>
         option
            .setName("storyid")
            .setDescription(
               "ID of the story whose story inputs are to be shown. By default, will show the ongoing story's"
            )
            .setRequired(false)
      ),
   async execute(interaction) {
      const storyId = interaction.options.getInteger("storyid");

      const storyInputs = await storyInputService.getStoryInputsByStoryGuildIdentifier(
         interaction.guildId,
         storyId
      );

      if (!storyInputs) {
         return await interaction.reply("There is no story with this ID.");
      }

      let storyInputsResponse = [];
      if (storyInputs.length) {
         for (const storyInput of storyInputs) {
            storyInputsResponse.push(
               `ID: ${storyInput._id}\nAuthor: ${storyInput.username}\nMessage: ${storyInput.message}`
            );
         }
      } else {
         storyInputsResponse.push("There are no story inputs yet.");
      }

      await interaction.reply(storyInputsResponse.join("\n\n"));
   },
};
