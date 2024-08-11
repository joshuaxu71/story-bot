const { SlashCommandBuilder } = require('discord.js');

const { getStoriesByGuildId } = require('@data/mongo/story.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stories')
		.setDescription('List all the stories in the guild.'),
	async execute(interaction) {
        const stories = await getStoriesByGuildId(interaction.guildId);
        storyTitles = []
        if (stories.length) {
            for (const story of stories) {
                if (!story.title) {
                    story.title = "<<ongoing story>>"
                }
                storyTitles.push(`${story.guildStoryIdentifier}. ${story.title}`)
            }
        }

        if (!storyTitles.length) {
            storyTitles.push("There are no stories yet.")
        }

		await interaction.reply(storyTitles.join("\n"));
	},
};