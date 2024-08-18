const { SlashCommandBuilder } = require('discord.js');

const { deleteStoriesByGuildId } = require('@data/mongo/story.js');
const { deleteStoryInputsByGuildId } = require('@data/mongo/storyInput.js');
const ConfigService = require('@service/config.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reset')
		.setDescription('Removes all data related to the guild.'),
	async execute(interaction) {
		const configService = await ConfigService.getInstance();
		// await deleteStoriesByGuildId(interaction.guildId);
		// await deleteStoryInputsByGuildId(interaction.guildId);
		await configService.deleteConfigsByGuildId(interaction.guildId);
		await interaction.reply('All data related to the guild has been deleted.');
	},
};