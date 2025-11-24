"use client";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Hook to check vendor permissions
 * @returns {Object} Permission checking functions
 */
export const useVendorPermissions = () => {
  const { user: currentUser } = useAuth();

  /**
   * Check if vendor has permission for a specific resource and action
   * @param {string} resource - Resource name (e.g., "listings_management")
   * @param {string} action - Action name (e.g., "view", "create", "update", "delete")
   * @returns {boolean} - True if vendor has permission
   */
  const hasPermission = (resource, action) => {
    if (!currentUser || currentUser.role !== "vendor") return false;
    
    // Check permissions from user object
    const permissions = currentUser.permissions || {};
    const resourcePerms = permissions[resource];
    if (!resourcePerms) return false;
    
    return resourcePerms[action] === true;
  };

  return {
    hasPermission,
    permissions: currentUser?.permissions || {}
  };
};

