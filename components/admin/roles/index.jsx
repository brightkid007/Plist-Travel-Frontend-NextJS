"use client";

import AdminDashboardLayout from "../common/layout";
import { Ellipsis, Plus, Edit2, Trash2, Menu, Eye, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, Menu as MuiMenu, MenuItem, CircularProgress } from "@mui/material";
import { Checkbox } from "@mui/material";
import FormInput from "@/components/common/form/FormInput";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { getAdminRoles, createAdminRole, updateAdminRole, deleteAdminRole } from "@/helpers/backend_helper";
import { toast } from "react-toastify";
import DeleteConfirmationModal from "@/components/common/DeleteConfirmationModal";

// Permission structure (CRUD where applicable)
const PERMISSION_STRUCTURE = [
  {
    id: "user_management",
    label: "User Management",
    description: "Manage all users across the platform",
    actions: { view: true, create: true, update: true, delete: true },
  },
  {
    id: "role_management",
    label: "Role Management",
    description: "Manage all Roles across the platform",
    actions: { view: true, create: true, update: true, delete: true },
  },
  {
    id: "vendor_listing_management",
    label: "Vendor Listing Management",
    description: "Review and manage listings from vendors across the platform",
    actions: { view: true, create: true, update: true, delete: true },
  },
  // {
  //   id: "agent_management",
  //   label: "Agent Management",
  //   description: "Review and manage Agents across the platform",
  //   actions: { view: true, create: true, update: true, delete: true },
  // },
  {
    id: "system_settings",
    label: "System Settings",
    description: "Manage global settings and configurations for the platform.",
    actions: { view: true, create: true, update: true, delete: true },
  },
  {
    id: "dashboard",
    label: "Dashboard",
    description: "View dashboard and analytics",
    actions: { view: true, create: false, update: false, delete: false },
  },
  {
    id: "booking_oversight",
    label: "Booking Oversight",
    description: "View and manage bookings",
    actions: { view: true, create: false, update: false, delete: false },
  },
  {
    id: "category_management",
    label: "Category Management",
    description: "Manage Categories/Subcategories",
    actions: { view: true, create: true, update: true, delete: true },
  },
  {
    id: "commission_management",
    label: "Commission Management",
    description: "Manage commission rates for vendors and agents",
    actions: { view: true, create: true, update: true, delete: true },
  },
  {
    id: "financial_management",
    label: "Financial Management",
    description: "Manage invoices, cancellations, refunds, and wallet transactions across the platform",
    actions: { view: true, create: true, update: true, delete: true },
  },
  {
    id: "coupon_promotion_management",
    label: "Coupon & Promotion Management",
    description: "Create and manage coupon codes and seasonal promotions",
    actions: { view: true, create: true, update: true, delete: true },
  },
  {
    id: "package_management",
    label: "Package Management",
    description: "Manage and monitor all package plans across the platform, Manage and monitor all package subscriptions across the platform.",
    actions: { view: true, create: true, update: true, delete: true },
  },
  {
    id: "email_template",
    label: "Email Template",
    description: "Create and manage email templates for various system notifications.",
    actions: { view: true, create: true, update: true, delete: true },
  },
  {
    id: "notification_management",
    label: "Notification Management",
    description: "Create and send notifications to users across the platform.",
    actions: { view: true, create: true, update: true, delete: true },
  },
  {
    id: "customer_support",
    label: "Customer Support",
    description: "Manage support tickets and customer inquiries.",
    actions: { view: true, create: true, update: true, delete: true },
  },
  // {
  //   id: "content_management",
  //   label: "Content Management",
  //   description: "Manage content.",
  //   actions: { view: true, create: true, update: true, delete: true },
  // },
];

const index = () => {
  const { user: currentUser } = useAuth();
  const { hasPermission } = usePermissions();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [permissionsModalOpen, setPermissionsModalOpen] = useState(false);
  const [viewingRole, setViewingRole] = useState(null);

  // Check if current user is Super Admin
  const isSuperAdmin = () => {
    if (!currentUser || currentUser.role !== "admin") return false;
    const currentUserRole = roles.find(r => r.id === currentUser.role_id);
    return currentUserRole?.name === "Super Admin";
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    setLoading(true);
    try {
      const response = await getAdminRoles();
      const data = response?.data?.data || response?.data || [];
      setRoles(data);
    } catch (error) {
      toast.error(error?.message || "Failed to load roles");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingRole(null);
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setShowModal(true);
    setMenuAnchor(null);
  };

  const handleDeleteClick = (role) => {
    setRoleToDelete(role);
    setDeleteModalOpen(true);
    setMenuAnchor(null);
  };

  const handleDeleteConfirm = async () => {
    if (!roleToDelete) return;
    try {
      await deleteAdminRole(roleToDelete.id);
      toast.success("Role deleted successfully");
      setDeleteModalOpen(false);
      setRoleToDelete(null);
      loadRoles();
    } catch (error) {
      toast.error(error?.message || "Failed to delete role");
    }
  };

  const getPermissionCount = (permissions) => {
    if (!permissions) return 0;
    let count = 0;
    Object.values(permissions).forEach((perm) => {
      // Support both legacy read/write and new CRUD
      if (typeof perm === "object") {
        if ("read" in perm || "write" in perm) {
          if (perm.read) count++;
          if (perm.write) count++;
        } else {
          if (perm.view) count++;
          if (perm.create) count++;
          if (perm.update) count++;
          if (perm.delete) count++;
        }
      }
    });
    return count;
  };

  const formatDateTime = (value) => {
    const source = value ?? null;
    const d = source ? new Date(source) : null;
    return d && !isNaN(d.getTime()) ? d.toLocaleString() : "-";
  };

  const handleMenuOpen = (event, role) => {
    setMenuAnchor(event.currentTarget);
    setSelectedRole(role);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedRole(null);
  };

  const handleViewPermissions = (role) => {
    setViewingRole(role);
    setPermissionsModalOpen(true);
    setMenuAnchor(null);
  };

  return (
    <AdminDashboardLayout>
      <div className="row y-gap-10 x-gap-10 items-center mb-15">
        <div className="col-auto">
          <h1 className="text-30 lh-14 fw-600">Permissions & Roles</h1>
          <div className="text-14 lh-14 text-light-1">
            Manage your permissions & roles easily
          </div>
        </div>
        {hasPermission("role_management", "create") && (
          <div className="col-auto ms-auto">
            <button
              className="button bg-blue-1 text-white px-15 fw-400 py-10 rounded-8"
              onClick={() => setShowModal(true)}
            >
              <Plus size={20} /> Add Role
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-8 border-light px-20 py-15">
        <div className="d-flex items-center justify-between mb-10">
          <div className="d-flex flex-column">
            <h1 className="text-24 lh-14 fw-500">Roles</h1>
            <div className="text-14 lh-14 text-light-1">
              Manage roles and permissions
            </div>
          </div>
        </div>
        <div className="bg-white rounded-8 border-light py-5 mt-10">
          <div className="overflow-scroll scroll-bar-1">
            <table className="table-3 -border-bottom col-12">
              <thead className="bg-light-2">
                <tr>
                  <th>ID</th>
                  <th>Role</th>
                  <th>Permissions</th>
                  <th>Users</th>
                  <th>Created at</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-20">
                      <CircularProgress size={24} />
                      <div className="text-14 text-light-1 mt-10">Loading roles...</div>
                    </td>
                  </tr>
                ) : roles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-20 text-14 text-light-1">
                      No roles found
                    </td>
                  </tr>
                ) : (
                  roles.map((role) => (
                    <tr key={role.id}>
                      <td className="align-middle">
                        <div className="text-12 fw-500">{role.id}</div>
                      </td>
                      <td className="align-middle">
                        <div className="mb-2">
                          <div className="d-flex align-items-center gap-2 flex-wrap">
                            <strong className="text-dark">{role.name}</strong>
                            {role.is_system && (
                              <span className="badge bg-primary d-inline-flex align-items-center gap-1">
                                <Lock size={10} />
                                System
                              </span>
                            )}
                          </div>
                        </div>
                        {role.description && (
                          <small className="text-muted d-block ps-2 border-start border-warning border-3">
                            {role.description}
                          </small>
                        )}
                      </td>
                      <td className="align-middle">
                        <div className="text-14 fw-500 text-center">
                          {getPermissionCount(role.permissions)}
                        </div>
                      </td>
                      <td className="align-middle">
                        <div className="text-14 text-center">{role.user_count || 0}</div>
                      </td>
                      <td className="align-middle">
                        <div className="text-14 fw-500 text-center">
                          {formatDateTime(role.created_at || role.createdAt)}
                        </div>
                      </td>
                      <td className="align-middle">
                        <button
                          className="border-0 bg-transparent px-5 py-5 cursor-pointer"
                          onClick={(e) => handleMenuOpen(e, role)}
                        >
                          <Ellipsis size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <MuiMenu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem
          disabled={!hasPermission("role_management", "view")}
          onClick={() => {
            if (hasPermission("role_management", "view")) {
              handleViewPermissions(selectedRole);
            }
          }}
        >
          <Eye size={16} className="mr-10" /> View Permissions
        </MenuItem>
        <MenuItem
          disabled={!hasPermission("role_management", "update") || (selectedRole && selectedRole.is_system)}
          onClick={() => {
            if (hasPermission("role_management", "update") && selectedRole && !selectedRole.is_system) {
              handleEdit(selectedRole);
            }
          }}
        >
          <Edit2 size={16} className="mr-10" /> Edit
        </MenuItem>
        <MenuItem
          disabled={!hasPermission("role_management", "delete") || (selectedRole && selectedRole.is_system)}
          onClick={() => {
            if (hasPermission("role_management", "delete") && selectedRole && !selectedRole.is_system) {
              handleDeleteClick(selectedRole);
            }
          }}
          className="text-red-1"
        >
          <Trash2 size={16} className="mr-10" /> Delete
        </MenuItem>
      </MuiMenu>

      <Dialog
        open={showModal}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        <div className="px-20 py-20">
          <RoleModal
            role={editingRole}
            onClose={handleClose}
            onSuccess={loadRoles}
          />
        </div>
      </Dialog>

      <DeleteConfirmationModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setRoleToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Role"
        message={`Are you sure you want to delete the role "${roleToDelete?.name}"?`}
        itemName={roleToDelete?.name}
        confirmLabel="Delete"
        confirmingLabel="Deleting..."
      />

      <Dialog
        open={permissionsModalOpen}
        onClose={() => {
          setPermissionsModalOpen(false);
          setViewingRole(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <div className="px-20 py-20">
          <PermissionsViewModal
            role={viewingRole}
            onClose={() => {
              setPermissionsModalOpen(false);
              setViewingRole(null);
            }}
          />
        </div>
      </Dialog>
    </AdminDashboardLayout>
  );
};

const RoleModal = ({ role, onClose, onSuccess }) => {
  const [roleName, setRoleName] = useState(role?.name || "");
  const [description, setDescription] = useState(role?.description || "");
  const [permissions, setPermissions] = useState(role?.permissions || {});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (role) {
      setRoleName(role.name);
      setDescription(role.description);
      setPermissions(role.permissions || {});
    } else {
      setRoleName("");
      setDescription("");
      setPermissions({});
    }
  }, [role]);

  const handlePermissionChange = (permId, type) => {
    setPermissions((prev) => ({
      ...prev,
      [permId]: {
        ...prev[permId],
        [type]: !prev[permId]?.[type],
      },
    }));
  };

  const handleParentChange = (permId, checked) => {
    const perm = PERMISSION_STRUCTURE.find((p) => p.id === permId);
    if (!perm) return;

    const a = perm.actions;
    setPermissions((prev) => ({
      ...prev,
      [permId]: {
        view: a.view ? checked : false,
        create: a.create ? checked : false,
        update: a.update ? checked : false,
        delete: a.delete ? checked : false,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roleName.trim()) {
      toast.error("Role name is required");
      return;
    }

    setSaving(true);
    try {
      const data = {
        name: roleName,
        description,
        permissions,
      };

      if (role) {
        await updateAdminRole(role.id, data);
        toast.success("Role updated successfully");
      } else {
        await createAdminRole(data);
        toast.success("Role created successfully");
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error?.message || "Failed to save role");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-20 lh-14 fw-500 mb-15">
        {role ? "Edit Role" : "Create New Role"}
      </h1>
      <div className="text-12 text-light-1 lh-14 mb-15">
        Define a new role with specific permissions
      </div>

      <FormInput
        label="Role Name"
        required={true}
        type="text"
        placeholder="Enter role name"
        gridClass="col-12 mt-5"
        value={roleName}
        onChange={(e) => setRoleName(e.target.value)}
        disabled={role?.is_system}
      />

      <FormInput
        label="Description"
        type="textarea"
        placeholder="Enter role description"
        gridClass="col-12 mt-5"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={role?.is_system}
      />

      <div className="col-12 mt-15">
        <h1 className="text-14 lh-14 fw-500 mb-10">
          Permissions<span className="text-red-1">*</span>
        </h1>
        <div className="border-light rounded-8 p-15" style={{ maxHeight: 400, overflowY: "auto" }}>
          {PERMISSION_STRUCTURE.map((perm) => {
            const base = { view: false, create: false, update: false, delete: false };
            const permData = { ...base, ...(permissions[perm.id] || {}) };
            const a = perm.actions;
            const allChecked = (
              (a.view ? permData.view : true) &&
              (a.create ? permData.create : true) &&
              (a.update ? permData.update : true) &&
              (a.delete ? permData.delete : true)
            );

            return (
              <div key={perm.id} className="mb-15 pb-15 border-bottom-light">
                <div className="d-flex items-center mb-5">
                  <Checkbox className="px-0 py-0"
                    checked={allChecked}
                    onChange={(e) => handleParentChange(perm.id, e.target.checked)}
                    disabled={role?.is_system}
                  />
                  <div className="ml-5">
                    <div className="text-14 fw-500">{perm.label}</div>
                    <div className="text-12 text-light-1">{perm.description}</div>
                  </div>
                </div>
                <div className="ml-30 d-flex gap-20 flex-wrap">
                  {a.view && (
                    <div className="d-flex items-center">
                      <Checkbox className="px-0 py-0"
                        checked={permData.view}
                        onChange={() => handlePermissionChange(perm.id, "view")}
                        disabled={role?.is_system}
                      />
                      <span className="text-12 ml-5">View</span>
                    </div>
                  )}
                  {a.create && (
                    <div className="d-flex items-center">
                      <Checkbox className="px-0 py-0"
                        checked={permData.create}
                        onChange={() => handlePermissionChange(perm.id, "create")}
                        disabled={role?.is_system || !permData.view}
                      />
                      <span className="text-12 ml-5">Create</span>
                    </div>
                  )}
                  {a.update && (
                    <div className="d-flex items-center">
                      <Checkbox className="px-0 py-0"
                        checked={permData.update}
                        onChange={() => handlePermissionChange(perm.id, "update")}
                        disabled={role?.is_system || !permData.view}
                      />
                      <span className="text-12 ml-5">Update</span>
                    </div>
                  )}
                  {a.delete && (
                    <div className="d-flex items-center">
                      <Checkbox className="px-0 py-0"
                        checked={permData.delete}
                        onChange={() => handlePermissionChange(perm.id, "delete")}
                        disabled={role?.is_system || !permData.view}
                      />
                      <span className="text-12 ml-5">Delete</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="d-flex justify-end gap-2 mt-20">
        <button
          type="button"
          className="text-14 border-light rounded-8 px-15 py-8"
          onClick={onClose}
          disabled={saving}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="text-14 bg-blue-1 text-white fw-500 rounded-8 px-15 py-8"
          disabled={saving || role?.is_system}
        >
          {saving ? "Saving..." : role ? "Update Role" : "Create Role"}
        </button>
      </div>
    </form>
  );
};

const PermissionsViewModal = ({ role, onClose }) => {
  if (!role) return null;

  const getActionBadges = (permData) => {
    const badges = [];
    if (permData.view) badges.push(<span key="view" className="text-10 bg-green-2 text-white px-10 py-0 rounded-16">View</span>);
    if (permData.create) badges.push(<span key="create" className="text-10 bg-blue-1 text-white px-10 py-0 rounded-16">Create</span>);
    if (permData.update) badges.push(<span key="update" className="text-10 bg-yellow-1 text-white px-10 py-0 rounded-16">Update</span>);
    if (permData.delete) badges.push(<span key="delete" className="text-10 bg-red-1 text-white px-10 py-0 rounded-16">Delete</span>);
    return badges.length > 0 ? badges : <span className="text-11 text-light-1">No permissions</span>;
  };

  return (
    <div>
      <div className="d-flex items-center justify-between mb-20">
        <div>
          <h2 className="text-20 fw-600 mb-5">{role.name} Permissions</h2>
          <p className="text-14 text-light-1">{role.description || "No description"}</p>
        </div>
        <button
          className="text-14 border-light rounded-8 px-15 py-8"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      <div className="border-light rounded-8 p-15" style={{ maxHeight: 500, overflowY: "auto" }}>
        {PERMISSION_STRUCTURE.map((perm) => {
          const permData = role.permissions?.[perm.id] || {};
          const hasAnyPermission = permData.view || permData.create || permData.update || permData.delete;

          return (
            <div key={perm.id} className="mb-15 pb-15 border-bottom-light last:border-0">
              <div className="d-flex items-center justify-between mb-8">
                <div className="flex-1">
                  <div className="text-14 fw-600 text-dark-1">{perm.label}</div>
                  <div className="text-12 text-light-1 mt-2">{perm.description}</div>
                </div>
                <div className="d-flex items-center gap-1 flex-wrap ml-15">
                  {hasAnyPermission ? getActionBadges(permData) : <span className="text-11 text-light-1">No access</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default index;
