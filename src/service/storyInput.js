const ConfigRepository = require("@data/config.js");
const StoryRepository = require("@data/story.js");
const StoryInputRepository = require("@data/storyInput.js");

class StoryInputService {
   async insertStoryInput(message) {
      const configRepository = await ConfigRepository.getInstance();
      const storyRepository = await StoryRepository.getInstance();
      const storyInputRepository = await StoryInputRepository.getInstance();

      const config = await configRepository.getConfigByGuildId(message.guildId);
      if (!config) {
         config = await configRepository.insertConfig(
            message.guildId,
            message.channelId
         );
      }

      const isUsingPrefix = message.content.startsWith(config.prefix);
      if (!isUsingPrefix) {
         return;
      }
      message.content = message.content.slice(config.prefix.length);

      const isValid = await this.#isInputValid(message, config.languages);
      if (!isValid) {
         return `Input is invalid. Only ${config.languages[0]} inputs are accepted.`;
      }

      const storyInput = new StoryInput(message);
      const story = await storyRepository.getOngoingStoryByGuildId(
         storyInput.guildId
      );

      if (story) {
         storyInput.storyId = story._id;
      } else {
         const storyId = await storyRepository.insertStory(
            new Story(storyInput)
         );
         if (storyId) {
            storyInput.storyId = storyId;
         } else {
            throw new Error("New story was not successfully created.");
         }
      }

      storyInput.createdDate = new Date();
      storyInputRepository.insertOne(storyInput);
      await this.#updateStoryLastModifiedData(storyRepository, storyInput);
   }

   async deleteStoryInputsByGuildId(guildId) {
      const storyInputRepository = await StoryInputRepository.getInstance();
      return await storyInputRepository.deleteStoryInputsByGuildId(guildId);
   }

   async #isInputValid(message, languages) {
      if (!languages.length) {
         return true;
      }

      const allowedLanguages = languages[0];
      if (allowedLanguages === "EN" && this.#containsKorean(message.content)) {
         return false;
      } else if (
         allowedLanguages === "KR" &&
         this.#containsEnglish(message.content)
      ) {
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
