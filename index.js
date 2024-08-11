require('dotenv').config(); //initialize dotenv
require('module-alias/register');

const { Client, GatewayIntentBits } = require('discord.js');

// const { getStory } = require('@data/mongo/story.js');
const { insertStoryInput } = require('@data/mongo/storyInput.js');
const { getStory } = require('@app/story.js');
const StoryInput = require('@model/storyInput.js');

const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
] });

client.on('ready', () => {
    console.log('Ready');
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return; // Ignore bot messages
    const storyInput = new StoryInput(message)
    insertStoryInput(storyInput);
    message.reply(await getStory(message));
});

client.login(process.env.CLIENT_TOKEN);