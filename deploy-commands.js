require('dotenv').config();
require('module-alias/register');
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const rest = new REST({ version: '10' }).setToken(process.env.CLIENT_TOKEN);

const commands = [];
const commandsPath = path.join(__dirname, 'src/commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command) {
        commands.push(command.data.toJSON());
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" property.`);
    }
}

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );

        console.log(`Successfully reloaded ${commands.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();
