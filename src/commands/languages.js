const { SlashCommandBuilder } = require('discord.js');

const { setLanguageByGuildId } = require('@data/mongo/config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('language')
        .setDescription('Configure what language is accepted for the story inputs.')
        .addStringOption(option => 
            option.setName('language')
                .setDescription('Choose from the available languages')
                .setRequired(true)
                .addChoices(
                    { name: 'Korean', value: 'KR' },
                    { name: 'English', value: 'EN' },
                    { name: 'Any', value: 'ANY' }
                )),
    async execute(interaction) {
        const language = interaction.options.getString('language');
		if (await setLanguageByGuildId(interaction.guildId, language)) {
			await interaction.reply(`Language has been configured successfully.`);
		}
    },
};