require("dotenv").config();
require("module-alias/register");
const { Client, GatewayIntentBits, Events, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");

const { isUserBanned } = require("@auth/auth.js");
const { connectToDatabase } = require("@data/mongo.js");
const StoryService = require("@service/story.js");
const StoryInputService = require("@service/storyInput.js");

const storyService = new StoryService();
const storyInputService = new StoryInputService();

const client = new Client({
   intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
   ],
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, "src/commands");
const commandFiles = fs
   .readdirSync(commandsPath)
   .filter((file) => !file.startsWith("deprecated_") && file.endsWith(".js"));

for (const file of commandFiles) {
   const filePath = path.join(commandsPath, file);
   const command = require(filePath);
   if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
   } else {
      console.log(
         `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
   }
}

client.on("ready", () => {
   console.log("Ready");
   connectToDatabase();
});

client.on("messageCreate", async (message) => {
   if (message.author.bot) return; // Ignore bot messages
   if (await isUserBanned(message.guildId, message.author.id)) return; // Ignore banned users

   const result = await storyInputService.insertStoryInput(message);
   if (result === "success") {
      // The input is recorded properly
      const story = await storyService.getOngoingStory(message.guildId);

      const reply = await message.reply({
         content: await storyService.generateStoryContent(story),
         allowedMentions: {
            repliedUser: false,
         },
      });
      await storyService.replaceStoryReply(client, story, reply);

      const endStoryResult = await storyService.endStory(message, story);
      if (endStoryResult) {
         await message.reply({
            content: endStoryResult,
            allowedMentions: {
               repliedUser: false,
            },
         });
      }
   } else if (result) {
      // There is an error message to be shown
      await message.reply({
         content: result,
         allowedMentions: {
            repliedUser: false,
         },
      });
   }
});

client.on(Events.InteractionCreate, async (interaction) => {
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
         await interaction.followUp({
            content: "There was an error while executing this command!",
            ephemeral: true,
         });
      } else {
         await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
         });
      }
   }
});

client.login(process.env.CLIENT_TOKEN);
