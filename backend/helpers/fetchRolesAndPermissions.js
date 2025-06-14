import {
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
  }
    /*import { UserRole, Permission, RolePermission, Role } from "../src/models/index.js";

export default async function fetchRolesAndPermissions(req) {
  if (!req?.user?._id) {
    throw new Error("User ID is required to fetch roles and permissions");
  }

  const userId = req.user._id;

  try {
    // Fetch roles associated with the user
    const userRoles = await UserRole.find({ userId }).lean();
    const roleIds = userRoles.map(({ roleId }) => roleId);

    // Fetch role names
    const rolesData = await Role.find({ _id: { $in: roleIds } }).lean();
    const roles = rolesData.reduce((acc, { role }) => {
      acc[role] = true;
      return acc;
    }, {});

    // Fetch permissions for the user's roles
    const rolePermissions = await RolePermission.find({ roleId: { $in: roleIds } }).lean();
    const permissionIds = rolePermissions.map(({ permissionId }) => permissionId);

    const permissionsData = await Permission.find({ _id: { $in: permissionIds } }).lean();
    const permissions = permissionsData.reduce((acc, { action, subject }) => {
      if (!acc[subject]) acc[subject] = {};
      acc[subject][action] = true;
      return acc;
    }, {});

    return { roles, permissions };
  } catch (error) {
    console.error("Error fetching roles and permissions:", error);
    throw new Error("Failed to fetch roles and permissions");
  }
}*/