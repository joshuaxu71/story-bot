const { SlashCommandBuilder } = require('discord.js');

const ConfigService = require('@service/config.js');
const StoryService = require("@service/story.js");
const StoryInputService = require("@service/storyInput.js");

const configService = new ConfigService();
const storyService = new StoryService();
const storyInputService = new StoryInputService();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reset')
		.setDescription('Removes all data related to the guild.'),
	async execute(interaction) {
		await configService.deleteConfigsByGuildId(interaction.guildId);
		await storyService.deleteStoriesByGuildId(interaction.guildId);
		await storyInputService.deleteStoryInputsByGuildId(interaction.guildId);
		await interaction.reply('All data related to the guild has been deleted.');
	},
};