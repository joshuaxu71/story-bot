class Story {
    guildId;
    guildStoryIdentifier;
    channelId;
    archived = false;
    createdDate;
    lastModifiedDate
    lastModifiedBy;

    constructor(storyInput) {
        this.guildId = storyInput.guildId;
        this.channelId = storyInput.channelId;
        this.lastModifiedBy = storyInput.userId;
    }
}

module.exports = Story;