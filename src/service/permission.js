const PermissionRepository = require("@data/permission.js");
const Permission = require("@model/permission.js");

class PermissionService {
   async insertPermission(guildId, role, type) {
      const permissionRepository = await PermissionRepository.getInstance();

      const existingPermission = await this.getPermissionByGuildIdAndRoleId(guildId, role.id);
      if (existingPermission) {
         if (existingPermission.type === permission.type) {
            return "The role already has that permission.";
         }
      }

      const permission = new Permission(guildId, role, type);
      await permissionRepository.insertPermission(permission);
      return `The role \`${permission.roleName}\` has been given the \`${permission.type}\` permission successfully.`;
   }

   async revokePermissionByGuildIdAndRoleId(guildId, roleId) {
      const permissionRepository = await PermissionRepository.getInstance();

      const existingPermission = await this.getPermissionByGuildIdAndRoleId(guildId, roleId);
      if (!existingPermission) {
         return "The role has no permission set.";
      }

      await permissionRepository.deletePermissionByGuildIdAndRoleId(guildId, roleId);
      return `The permission given to \`${existingPermission.roleName}\` has been revoked successfully.`;
   }

   async getPermissionByGuildIdAndRoleId(guildId, roleId) {
      const permissionRepository = await PermissionRepository.getInstance();
      return await permissionRepository.getPermissionByGuildIdAndRoleId(guildId, roleId);
   }

   async getPermissionsByGuildId(guildId) {
      const permissionRepository = await PermissionRepository.getInstance();
      return await permissionRepository.getPermissionsByGuildId(guildId);
   }
}

module.exports = PermissionService;
