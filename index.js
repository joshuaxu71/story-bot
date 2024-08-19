require('dotenv').config();
require('module-alias/register');
const { Client, GatewayIntentBits, Events, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

const StoryService = require("@service/story.js");
const StoryInputService = require("@service/storyInput.js");

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

    const storyService = await StoryService.getInstance();
    const storyInputService = await StoryInputService.getInstance();

    const result = await storyInputService.insertStoryInput(message);
    if (result) {
        if (result === "Not using prefix, not story input") {
            return;
        }
        
        // There is an error message to be shown
        await message.reply({
            content: result,
            allowedMentions: {
                repliedUser: false
            }
        });
    } else {
        // The input is recorded properly
        const reply = await message.reply({
            content: await storyService.getOngoingStoryContent(message.guildId),
            allowedMentions: {
                repliedUser: false
            }
        });
        storyService.setStoryReplyId(client, reply.guildId, reply.id);
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
