class StoryInput {
    storyId;
    guildId;
    channelId;
    userId;
    username;
    message;
    createdDate;

    constructor(message) {
        this.guildId = message.guildId;
        this.channelId = message.channelId;
        this.userId = message.author.id;
        this.username = message.author.username;
        this.message = message.content;
    }
}

module.exports = StoryInput;