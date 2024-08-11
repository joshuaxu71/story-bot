const { connectToDatabase } = require('@data/mongo.js');

const Config = require('@model/config.js');

const collection_name = 'configs';

async function insertConfig(guildId, channelId) {
    try {
        const db = await connectToDatabase();
        const collection = db.collection(collection_name);

        const config = await getConfigByGuildId(guildId);
        if (!config) {
            await collection.insertOne(new Config(guildId, channelId));    
        }
    } catch (err) {
        console.error('Error insertConfig:', err);
    }
}

async function getConfigByGuildId(guildId) {
    try {
        const db = await connectToDatabase();
        const collection = db.collection(collection_name);

        return await collection.findOne({ guildId: guildId });
    } catch (err) {
        console.error('Error insertConfig:', err);
    }
}

async function setLanguageByGuildId(guildId, language) {
    try {
        const db = await connectToDatabase();
        const collection = db.collection(collection_name);

        const languages = language === "ANY" ? [] : [language];
        return await collection.findOneAndUpdate(
            { guildId: guildId },
            { $set: { languages: languages } }
        );
    } catch (err) {
        console.error('Error setLanguageByGuildId:', err);
    }
}

module.exports = {
    insertConfig,
    setLanguageByGuildId
}