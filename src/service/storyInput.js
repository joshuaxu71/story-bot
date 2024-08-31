const { ObjectId } = require("mongodb");

const ConfigRepository = require("@data/config.js");
const StoryRepository = require("@data/story.js");
const StoryInputRepository = require("@data/storyInput.js");
const Config = require("@model/config.js");
const Story = require("@model/story.js");
const StoryInput = require("@model/storyInput.js");

class StoryInputService {
   async insertStoryInput(message) {
      const configRepository = await ConfigRepository.getInstance();
      const storyRepository = await StoryRepository.getInstance();
      const storyInputRepository = await StoryInputRepository.getInstance();

      let config = await configRepository.getConfigByGuildId(message.guildId);
      if (!this.#isUsingPrefix(message, config)) {
         return;
      }

      // If config was null, create config now
      if (!config) {
         config = await configRepository.insertConfig(message.guildId, message.channelId);
      }

      if (!this.#isLanguageValid(message, config.languages)) {
         return `Input is invalid. Only ${config.languages[0]} inputs are accepted.`;
      }

      if (!this.#isLongEnough(message, config.minStoryInputCharacterCount)) {
         return `Input is too short. Inputs need to be at least ${config.minStoryInputCharacterCount} characters long excluding spaces.`;
      }

      const storyInput = new StoryInput(message);
      const story = await storyRepository.getOngoingStoryByGuildId(storyInput.guildId);

      if (story) {
         storyInput.storyId = story._id;
      } else {
         const storyId = await storyRepository.insertStory(new Story(storyInput));
         if (storyId) {
            storyInput.storyId = storyId;
         } else {
            throw new Error("New story was not successfully created.");
         }
      }

      storyInput.createdDate = new Date();
      storyInputRepository.insertStoryInput(storyInput);
      await this.#updateStoryLastModifiedData(storyRepository, storyInput);
      return "success";
   }

   async deleteStoryInputById(id) {
      const storyInputRepository = await StoryInputRepository.getInstance();
      return await storyInputRepository.deleteStoryInputById(ObjectId.createFromHexString(id));
   }

   async deleteStoryInputsByGuildId(guildId) {
      const storyInputRepository = await StoryInputRepository.getInstance();
      return await storyInputRepository.deleteStoryInputsByGuildId(guildId);
   }

   async getStoryInputsByStoryGuildIdentifier(guildId, guildStoryIdentifier) {
      const storyRepository = await StoryRepository.getInstance();
      const storyInputRepository = await StoryInputRepository.getInstance();

      let story;
      if (guildStoryIdentifier) {
         story = await storyRepository.getStoryByGuildIdAndIdentifier(
            guildId,
            guildStoryIdentifier
         );
      } else {
         story = await storyRepository.getOngoingStoryByGuildId(guildId);
      }

      if (!story) {
         return;
      }

      return await storyInputRepository.getStoryInputsByStoryId(story._id);
   }

   #isUsingPrefix(message, config) {
      let prefix;
      if (!config) {
         prefix = Config.DEFAULT_PREFIX;
      } else {
         prefix = config.prefix;
      }

      const isUsingPrefix = message.content.startsWith(prefix);
      if (!isUsingPrefix) {
         return false;
      }
      message.content = message.content.slice(prefix.length);
      return true;
   }

   #isLanguageValid(message, languages) {
      if (!languages.length) {
         return true;
      }

      const allowedLanguages = languages[0];
      if (allowedLanguages === "EN" && this.#containsKorean(message.content)) {
         return false;
      } else if (allowedLanguages === "KR" && this.#containsEnglish(message.content)) {
         return false;
      }
      return true;
   }

   #isLongEnough(message, minStoryInputCharacterCount) {
      if (!minStoryInputCharacterCount) {
         return true;
      }

      const cleanedMessage = message.content.replace(/\s+/g, "");
      if (cleanedMessage.length < minStoryInputCharacterCount) {
         return false;
      }
      return true;
   }

   async #updateStoryLastModifiedData(storyRepository, storyInput) {
      const update = {
         $set: {
            lastModifiedDate: new Date(),
            lastModifiedBy: storyInput.userId,
         },
      };

      return await storyRepository.updateStoryById(storyInput._id, update);
   }

   #containsKorean(str) {
      const koreanRegex = /[가-힣]/;
      return koreanRegex.test(str);
   }

   #containsEnglish(str) {
      const englishRegex = /[a-zA-Z]/;
      return englishRegex.test(str);
   }
}

module.exports = StoryInputService;
