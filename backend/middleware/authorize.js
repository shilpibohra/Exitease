/*import { Permission, RolePermission, UserRole } from "../src/models/index.js";

async function doesUserHaveThePermission(userId, permissionSpec) {
  const permission = await Permission.findOne(permissionSpec);

  const userRoles = await UserRole.find({
    userId,
  });

  const rolePermissions = await RolePermission.find({
    roleId: { $in: userRoles.map(({ roleId }) => roleId) },
  });

  return rolePermissions.some(({ permissionId }) =>
    permissionId.equals(permission._id)
  );
}

export const canSubmitResignation = async (req, res, next) => {
  let userHasThePermission = await doesUserHaveThePermission(req.user._id, {
    subject: "resignation",
    action: "submit",
  });

  if (userHasThePermission) next();
  else res.status(401).json({ error: "Insufficient Permission" });
};

export const canReviewResignation = async (req, res, next) => {
  let userHasThePermission = await doesUserHaveThePermission(req.user._id, {
    subject: "resignation",
    action: "review",
  });
  if (userHasThePermission) next();
  else res.status(401).json({ error: "Insufficient Permission" });
};

export const canGetAllResignation = async (req, res, next) => {
  let userHasThePermission = await doesUserHaveThePermission(req.user._id, {
    subject: "resignation",
    action: "see_all",
  });
  if (userHasThePermission) next();
  else res.status(401).json({ error: "Insufficient Permission" });
};

export const canGetAllResponses = async (req, res, next) => {
  let userHasThePermission = await doesUserHaveThePermission(req.user._id, {
    subject: "responses",
    action: "see_all",
  });
  if (userHasThePermission) next();
  else res.status(401).json({ error: "Insufficient Permission" });
};*/
import { Permission, RolePermission, UserRole } from "../src/models/index.js";

/**
 * Check if a user has a specific permission
 * @param {ObjectId} userId - MongoDB ObjectId of the user
 * @param {{subject: string, action: string}} permissionSpec - Required permission
 * @returns {Promise<boolean>}
 */
async function doesUserHaveThePermission(userId, permissionSpec) {
  try {
    const permission = await Permission.findOne(permissionSpec);
    if (!permission) {
      console.warn(`Permission not found: ${JSON.stringify(permissionSpec)}`);
      return false;
    }

    const userRoles = await UserRole.find({ userId });
    const roleIds = userRoles.map(({ roleId }) => roleId);

    if (roleIds.length === 0) return false;

    const rolePermissions = await RolePermission.find({
      roleId: { $in: roleIds },
      permissionId: permission._id,
    });

    return rolePermissions.length > 0;
  } catch (error) {
    console.error("Error checking permissions:", error);
    return false;
  }
}

// Generic middleware generator
const createPermissionMiddleware = (subject, action) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return res.status(401).json({ error: "Unauthenticated" });
      }

      const allowed = await doesUserHaveThePermission(userId, { subject, action });
      if (!allowed) {
        return res.status(403).json({ error: "Insufficient Permission" });
      }

      next();
    } catch (err) {
      console.error("Permission middleware failed:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
};

// Export specific permission middleware
export const canSubmitResignation = createPermissionMiddleware("resignation", "submit");
export const canReviewResignation = createPermissionMiddleware("resignation", "review");
export const canGetAllResignation = createPermissionMiddleware("resignation", "see_all");
export const canGetAllResponses = createPermissionMiddleware("responses", "see_all");