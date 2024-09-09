const { getDatabaseCollection, executeWithCatch } = require("@data/mongo.js");
const { BanType } = require("@model/permission.js");

class PermissionRepository {
   constructor() {
      if (PermissionRepository.instance) {
         return PermissionRepository.instance;
      }
      this.collectionName = "permissions";
      PermissionRepository.instance = this;
   }

   static async getInstance() {
      if (!PermissionRepository.instance) {
         PermissionRepository.instance = new PermissionRepository();
         await PermissionRepository.instance.initialize();
      }
      return PermissionRepository.instance;
   }

   async initialize() {
      this.collection = await getDatabaseCollection(this.collectionName);
   }

   async insertPermission(permission) {
      return executeWithCatch("insertPermission", async () => {
         await this.collection.insertOne(permission);
         return permission;
      });
   }

   async deletePermissionByGuildIdAndRoleId(guildId, roleId) {
      return executeWithCatch("deletePermissionByGuildIdAndRoleId", async () => {
         return await this.collection.deleteOne({ guildId: guildId, roleId: roleId });
      });
   }

   async getPermissionByGuildIdAndRoleId(guildId, roleId) {
      return executeWithCatch("getPermissionByGuildIdAndRoleId", async () => {
         return await this.collection.findOne({ guildId: guildId, roleId: roleId });
      });
   }
}

module.exports = PermissionRepository;
