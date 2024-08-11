require('dotenv').config();
require('module-alias/register');
const { Client, GatewayIntentBits, Events, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { getStoryTitles } = require('@data/mongo/story.js');
const { insertStoryInput } = require('@data/mongo/storyInput.js');
const { getStory } = require('@app/story.js');
const StoryInput = require('@model/storyInput.js');

const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'src/commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

client.on('ready', () => {
    console.log('Ready');
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return; // Ignore bot messages
    const storyInput = new StoryInput(message);
    await insertStoryInput(storyInput);

    if (message.content === "3") {
        console.log("here");
        message.reply(await getStoryTitles(message));
    }
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isCommand()) return;
    
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

client.login(process.env.CLIENT_TOKEN);
