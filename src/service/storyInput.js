const StoryInputRepository = require("@data/mongo/storyInput.js");

class StoryInputService {
   async insertStoryInput(message) {
      const storyInputRepository = await StoryInputRepository.getInstance();

      // const config = await getConfigByGuildId(message.guildId);
      // if (config) {
      //    const hasPrefix = message.content.startsWith(config.prefix);
      //    if (hasPrefix) {
      //       message.content = message.content.slice(config.prefix.length);
      //    } else {
      //       return "Not using prefix, not story input";
      //    }
      // }

      // const isValid = await isInputValid(message);
      // if (!isValid) {
      //    return "Input is invalid. Please check the supported language.";
      // }

      // const storyInput = new StoryInput(message);
      // const story = await findFirstOngoingStoryByGuildId(storyInput.guildId);
      // if (story) {
      //    storyInput.storyId = story._id;
      // } else {
      //    const storyId = await insertStory(new Story(storyInput));
      //    if (storyId) {
      //       storyInput.storyId = storyId;
      //    } else {
      //       throw new Error("New story was not successfully created.");
      //    }
      // }

      // storyInput.createdDate = new Date();
      storyInputRepository.insertOne(storyInput);
      // await updateStoryLastModifiedData(storyInput);
   }

   async setLanguageByGuildId(guildId, language) {
      const storyInputRepository = await StoryInputRepository.getInstance();
      const languages = language === "ANY" ? [] : [language];
      const update = { $set: { languages: languages } };
      return await storyInputRepository.updateConfigByGuildId(guildId, update);
   }
}

module.exports = ConfigService;
