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

async function setPrefixByGuildId(guildId, prefix) {
    try {
        const db = await connectToDatabase();
        const collection = db.collection(collection_name);

        return await collection.findOneAndUpdate(
            { guildId: guildId },
            { $set: { prefix: prefix + " " } } // Add space so that there's a space between prefix and input
        );
    } catch (err) {
        console.error('Error setPrefixByGuildId:', err);
    }
}

async function deleteConfigsByGuildId(guildId) {
    try {
        const db = await connectToDatabase();
        const collection = db.collection(collection_name);

        return await collection.deleteMany({ guildId: guildId })
    } catch (err) {
        console.error('Error deleteConfigsByGuildId:', err);
    }
}

function containsKorean(str) {
    const koreanRegex = /[가-힣]/;
    return koreanRegex.test(str);
}

function containsEnglish(str) {
    const englishRegex = /[a-zA-Z]/;
    return englishRegex.test(str);
}

async function isInputValid(message) {
    try {
        const config = await getConfigByGuildId(message.guildId);
        if (!config || !config.languages.length) {
            return true;
        }

        const allowedLanguages = config.languages[0];
        if (allowedLanguages === "EN" && containsKorean(message.content)) {
            return false;
        } else if (allowedLanguages === "KR" && containsEnglish(message.content)) {
            return false;
        }
        return true;
    } catch (err) {
        console.error('Error isInputValid:', err);
    }
}

module.exports = {
    insertConfig,
    setLanguageByGuildId,
    isInputValid,
    deleteConfigsByGuildId,
    setPrefixByGuildId,
    getConfigByGuildId
}