"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

/**
 * Hook to check user permissions
 * @returns {Object} Permission checking functions
 */
export const usePermissions = () => {
  const { user: currentUser } = useAuth();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    // Check if user is Super Admin
    if (currentUser && currentUser.role === "admin") {
      // Super Admin check would require roles data, but for now we'll check permissions
      // If user has all permissions, they're likely Super Admin
      const permissions = currentUser.permissions || {};
      const hasAllPermissions = Object.keys(permissions).every(resource => {
        const resourcePerms = permissions[resource];
        return resourcePerms?.view && resourcePerms?.create && resourcePerms?.update && resourcePerms?.delete;
      });
      setIsSuperAdmin(hasAllPermissions);
    } else {
      setIsSuperAdmin(false);
    }
  }, [currentUser]);

  /**
   * Check if user has permission for a specific resource and action
   * @param {string} resource - Resource name (e.g., "user_management")
   * @param {string} action - Action name (e.g., "view", "create", "update", "delete")
   * @returns {boolean} - True if user has permission
   */
  const hasPermission = (resource, action) => {
    if (!currentUser || currentUser.role !== "admin") return false;
    
    // Super Admin has all permissions
    if (isSuperAdmin) return true;
    
    // Check permissions from user object
    const permissions = currentUser.permissions || {};
    const resourcePerms = permissions[resource];
    if (!resourcePerms) return false;
    
    return resourcePerms[action] === true;
  };

  return {
    hasPermission,
    isSuperAdmin,
    permissions: currentUser?.permissions || {}
  };
};

