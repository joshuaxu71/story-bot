const BanActionRepository = require("@data/banAction.js");
const { BanType } = require("@model/banAction.js");

const cache = new Map(); // In-memory cache

// Cache configuration
const CACHE_TTL = 24 * 60 * 60 * 1000; // 1 day

function getCacheKey(guildId, userId) {
   return `${guildId}-${userId}`;
}

// Get cache entry
function getCachedBan(guildId, userId) {
   const cacheKey = getCacheKey(guildId, userId);
   const cachedBan = cache.get(cacheKey);

   if (cachedBan && Date.now() - cachedBan.timestamp < CACHE_TTL) {
      return cachedBan.isBanned;
   }

   // Cache entry expired or not found
   return null;
}

// Set cache entry
function setBanCache(guildId, userId, isBanned) {
   const cacheKey = getCacheKey(guildId, userId);
   cache.set(cacheKey, { isBanned, timestamp: Date.now() });
}

// Invalidate cache entry
function invalidateBanCache(guildId, userId) {
   const cacheKey = getCacheKey(guildId, userId);
   cache.delete(cacheKey);
}

function withBanCheck(handler) {
   return async function (interaction) {
      if (await isUserBanned(interaction.guildId, interaction.user.id)) {
         return await interaction.reply({
            content: "You are banned from interacting with the bot.",
            ephemeral: true,
         });
      }

      // Proceed with the original handler if not banned
      return handler(interaction);
   };
}

async function isUserBanned(guildId, userId) {
   const cachedBan = getCachedBan(guildId, userId);
   if (cachedBan !== null) {
      return cachedBan;
   }

   const banActionRepository = await BanActionRepository.getInstance();

   const latestBanAction = await banActionRepository.getLatestBanActionByGuildIdAndUserId(
      guildId,
      userId
   );

   const isBanned = latestBanAction && latestBanAction.type === BanType.BAN;

   // Update the cache with the new value
   setBanCache(guildId, userId, isBanned);

   return isBanned;
}

module.exports = {
   withBanCheck,
   isUserBanned,
   invalidateBanCache,
};
