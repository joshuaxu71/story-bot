class Config {
    guildId;
    channelId;
    languages = [];
    endingText;
    minStoryInputLength;

    constructor(guildId, channelId) {
        this.guildId = guildId;
        this.channelId = channelId;
    }
}

module.exports = Config;