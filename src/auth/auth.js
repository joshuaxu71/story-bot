const BanActionService = require("@service/banAction.js");
const PermissionService = require("@service/permission.js");
const { BanType } = require("@model/banAction.js");

const banActionService = new BanActionService();
const permissionService = new PermissionService();

const cache = new Map(); // In-memory cache

// Cache configuration
const CACHE_TTL = 24 * 60 * 60 * 1000; // 1 day

function getBanCacheKey(guildId, userId) {
   return `ban-${guildId}-${userId}`;
}
function getPermissionCacheKey(guildId, roleId) {
   return `permission-${guildId}-${roleId}`;
}

// Get cache entry
function getCachedBan(guildId, userId) {
   const cacheKey = getBanCacheKey(guildId, userId);
   const cachedBan = cache.get(cacheKey);

   if (cachedBan && Date.now() - cachedBan.timestamp < CACHE_TTL) {
      return cachedBan.isBanned;
   }

   return null;
}
function getCachedPermission(guildId, roleId) {
   const cacheKey = getPermissionCacheKey(guildId, roleId);
   const cachedPermission = cache.get(cacheKey);

   if (cachedPermission && Date.now() - cachedPermission.timestamp < CACHE_TTL) {
      return cachedPermission;
   }

   return null;
}

// Set cache entry
function setBanCache(guildId, userId, isBanned) {
   const cacheKey = getBanCacheKey(guildId, userId);
   cache.set(cacheKey, { isBanned, timestamp: Date.now() });
}
function setPermissionCache(guildId, roleId, type) {
   const cacheKey = getPermissionCacheKey(guildId, roleId);
   cache.set(cacheKey, { type: type, timestamp: Date.now() });
}

// Invalidate cache entry
function invalidateBanCache(guildId, userId) {
   const cacheKey = getBanCacheKey(guildId, userId);
   cache.delete(cacheKey);
}
function invalidatePermissionCache(guildId, roleId) {
   const cacheKey = getPermissionCacheKey(guildId, roleId);
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

function withPermissionAndBanCheck(handler) {
   return async function (interaction) {
      if (
         await isUserInsufficientPermission(
            interaction.client,
            interaction.guildId,
            interaction.user.id
         )
      ) {
         return await interaction.reply({
            content: "You have insufficient permission to execute this command.",
            ephemeral: true,
         });
      }

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

   const latestBanAction = await banActionService.getLatestBanActionByGuildIdAndUserId(
      guildId,
      userId
   );

   const isBanned = latestBanAction && latestBanAction.type === BanType.BAN;

   // Update the cache with the new value
   setBanCache(guildId, userId, isBanned);

   return isBanned;
}

async function isUserInsufficientPermission(client, guildId, userId) {
   const guild = await client.guilds.fetch(guildId);
   const member = await guild.members.fetch(userId);

   if (member.permissions.has("ADMINISTRATOR")) {
      return false;
   }

   const roles = member.roles.cache;
   for (const role of roles) {
      const roleId = role[0];

      let permission = getCachedPermission(guildId, roleId);
      if (permission === null) {
         permission = await permissionService.getPermissionByGuildIdAndRoleId(guildId, roleId);
         if (permission) {
            setPermissionCache(guildId, roleId, permission.type);
         } else {
            setPermissionCache(guildId, roleId, null);
         }
      }

      if (permission && permission.type === "ADMINISTRATOR") {
         return false;
      }
   }

   return true;
}

module.exports = {
   withBanCheck,
   withPermissionAndBanCheck,
   isUserBanned,
   invalidateBanCache,
   invalidatePermissionCache,
};
