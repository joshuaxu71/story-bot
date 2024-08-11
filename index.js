require('dotenv').config(); //initialize dotenv
require('module-alias/register');

const { Client, GatewayIntentBits } = require('discord.js');

const { insertStoryInput } = require('@data/mongo/storyInput.js');
const StoryInput = require('@model/storyInput.js');

const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
] });

client.on('ready', () => {
    console.log('Ready');
});

client.on('messageCreate', (message) => {
    if (message.author.bot) return; // Ignore bot messages
    const storyInput = new StoryInput(message)
    insertStoryInput(storyInput);
});

client.login(process.env.CLIENT_TOKEN);