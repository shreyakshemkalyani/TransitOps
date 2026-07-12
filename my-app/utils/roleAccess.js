import { USER_ROLES } from "@/lib/constants";

const access = { [USER_ROLES.ADMIN]: ["*"], [USER_ROLES.MANAGER]: ["dashboard", "analytics", "vehicles", "drivers", "trips", "maintenance", "expenses"], [USER_ROLES.DRIVER]: ["dashboard", "trips"] };
export function hasAccess(role, resource) { const permissions = access[role] || []; return permissions.includes("*") || permissions.includes(resource); }
