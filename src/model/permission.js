class Permission {
   guildId;
   roleId;
   roleName;
   type;

   constructor(guildId, role, type) {
      this.guildId = guildId;
      this.roleId = role.id;
      this.roleName = role.name;
      this.type = type;
   }
}

module.exports = Permission;
