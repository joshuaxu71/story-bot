const { SlashCommandBuilder } = require('discord.js');

const { archiveStory } = require('@data/mongo/story.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('archive')
		.setDescription('Archives the current ongoing story story and start a new one.')
        .addStringOption(option => 
            option.setName('title')
                .setDescription('Title of the story to be archived')
                .setRequired(true)),
	async execute(interaction) {
        const title = interaction.options.getString('title');
		await interaction.reply(await archiveStory(interaction.guildId, title));
	},
};