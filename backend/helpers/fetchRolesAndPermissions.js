/*import {
    UserRole,
    Permission,
    RolePermission,
    Role,
  } from "../src/models/index.js";
  
  export default async function fetchRoleAndPermissions(req) {
    const userRoles = await UserRole.find({
      userId: req.user._id,
    });
    let roles = {};
    (
      await Role.find({
        _id: { $in: userRoles.map(({ roleId }) => roleId) },
      })
    ).forEach(({ role }) => {
      roles[role] = true;
    });
    let permissions = {};
    if (userRoles.length) {
      const rolePermissions = await RolePermission.find({
        roleId: { $in: userRoles.map(({ roleId }) => roleId) },
      });
      if (rolePermissions.length) {
        // get all permissions
        (
          await Permission.find({
            _id: { $in: rolePermissions.map(({ permissionId }) => permissionId) },
          })
        ).forEach(({ action, subject }) => {
          if (!permissions[subject]) permissions[subject] = {};
          permissions[subject][action] = true;
        });
      }
    }
  
    return {
      roles,
      permissions,
    };
  }*/
    import {
      UserRole,
      Permission,
      RolePermission,
      Role,
    } from "../src/models/index.js";
    
    /**
     * Fetch roles and permissions for the authenticated user
     * @param {Object} req - Express request object containing `req.user._id`
     * @returns {Object} - { roles: { [roleName]: true }, permissions: { subject: { action: true } } }
     */
    export default async function fetchRoleAndPermissions(req) {
      if (!req.user || !req.user._id) {
        throw new Error("Missing user ID in fetchRoleAndPermissions");
      }
    
      // Get roles for the user
      const userRoles = await UserRole.find({ userId: req.user._id });
      const roleIds = userRoles.map(({ roleId }) => roleId);
    
      // Map role names to true
      const roles = {};
      const foundRoles = await Role.find({ _id: { $in: roleIds } });
      foundRoles.forEach(({ role }) => {
        roles[role] = true;
      });
    
      // Initialize permission structure
      const permissions = {};
    
      if (roleIds.length) {
        const rolePermissions = await RolePermission.find({
          roleId: { $in: roleIds },
        });
    
        const permissionIds = rolePermissions.map(({ permissionId }) => permissionId);
        const foundPermissions = await Permission.find({
          _id: { $in: permissionIds },
        });
    
        foundPermissions.forEach(({ action, subject }) => {
          if (!permissions[subject]) permissions[subject] = {};
          permissions[subject][action] = true;
        });
      }
    
      return { roles, permissions };
    }