"use client";

import AdminDashboardLayout from "../common/layout";
import { useRouter } from "next/navigation";
import { Ellipsis, Mail, MapPin, Phone, Plus, MoreVertical, UserX } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Dialog, Menu, MenuItem, CircularProgress } from "@mui/material";
import FormInput from "@/components/common/form/FormInput";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { toast } from "react-toastify";
import { 
  getAdminUsers, 
  createAdminUser, 
  updateAdminUser, 
  deleteAdminUser,
  updateUserStatus,
  getAdminRoles,
  isAuthenticated
} from "@/helpers/backend_helper";
import ConfirmationModal from "@/components/common/ConfirmationModal";

const index = () => {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const { hasPermission } = usePermissions();
  const [activeTab, setActiveTab] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Backend integration states
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Check if current user is Super Admin
  const isSuperAdmin = () => {
    if (!currentUser || currentUser.role !== "admin") return false;
    const currentUserRole = roles.find(r => r.id === currentUser.role_id);
    return currentUserRole?.name === "Super Admin";
  };
  
  // Check if user has permission for a specific resource and action
  const checkPermission = (resource, action) => {
    return hasPermission(resource, action);
  };
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "customer",
    is_active: true,
    first_name: "",
    last_name: "",
    role_id: null
  });
  const [menuAnchor, setMenuAnchor] = useState({});
  const menuRef = useRef({});
  
  // Delete confirmation modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleClose = () => {
    setShowModal(false);
    setShowEditModal(false);
    setSelectedUser(null);
    setFormData({
      email: "",
      password: "",
      role: "customer",
      is_active: true,
      first_name: "",
      last_name: "",
      role_id: null
    });
  };

  // Helper function to map backend user to frontend format
  const mapUserData = (user) => {
    if (!user) return null;
    const profile = user.profile || {};
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
      disabledAt: user.disabledAt,
      createdAt: user.createdAt || user.created_at,
      // Map profile data
      name: `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || user.email,
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      phone: profile.phone || "",
      address: profile.address || "",
      avatar_url: profile.avatar_url || "",
      role_id: profile.role_id || null,
      role_name: profile.role_name || null,
      // Computed fields for display
      status: user.disabledAt ? "Inactive" : (user.is_active ? "Active" : "Inactive"),
      location: profile.address || "N/A"
    };
  };

  // Load users data
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        
        if (!isAuthenticated()) {
          toast.error("Admin authentication required");
          return;
        }

        const [usersData, rolesData] = await Promise.all([
          getAdminUsers({ role: activeTab === "all" ? undefined : activeTab, includeDisabled: true }),
          getAdminRoles()
        ]);

        // Handle backend response structure: { status, message, data }
        let usersList = [];
        if (usersData?.data && Array.isArray(usersData.data)) {
          usersList = usersData.data;
        } else if (Array.isArray(usersData)) {
          usersList = usersData;
        } else if (usersData?.data && typeof usersData.data === 'object' && !Array.isArray(usersData.data)) {
          // Single user object
          usersList = [usersData.data];
        }

        const mappedUsers = usersList.map(mapUserData).filter(Boolean);
        setUsers(mappedUsers);
        
        // Handle admin roles response structure
        const adminRoles = rolesData?.data?.data || rolesData?.data || [];
        setRoles(adminRoles);
        
      } catch (err) {
        console.error("Failed to load users:", err);
        toast.error(err?.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [activeTab]);

  // Handle user actions
  const handleCreateUser = async () => {
    try {
      const userPayload = {
        email: formData.email,
        password: formData.password || "plist123!@#", // Default password if not provided
        role: formData.role,
        is_active: formData.is_active,
        first_name: formData.first_name,
        last_name: formData.last_name,
        ...(formData.role === "admin" && formData.role_id && { role_id: formData.role_id })
      };

      const response = await createAdminUser(userPayload);
      const newUser = mapUserData(response?.data || response);
      if (newUser) {
        // Add the newly created user to the list
        // Note: Once backend implements list endpoint, this will be handled automatically
        setUsers(prev => [...prev, newUser]);
        toast.success("User created successfully");
      }
      handleClose();
    } catch (err) {
      console.error("Failed to create user:", err);
      toast.error(err?.message || "Failed to create user");
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setFormData({
      email: user.email || "",
      password: "", // Don't pre-fill password
      role: user.role || "customer",
      is_active: user.is_active !== false,
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      role_id: user.role_id || null
    });
    setShowEditModal(true);
    setMenuAnchor({ [user.id]: null });
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    try {
      const updatePayload = {
        email: formData.email,
        role: formData.role,
        is_active: formData.is_active,
        first_name: formData.first_name,
        last_name: formData.last_name,
        ...(formData.role === "admin" && formData.role_id && { role_id: formData.role_id })
      };

      // Only include password if it's provided
      if (formData.password) {
        updatePayload.password = formData.password;
      }

      const response = await updateAdminUser(selectedUser.id, updatePayload);
      const updatedUser = mapUserData(response?.data || response);
      if (updatedUser) {
        setUsers(prev => prev.map(user => 
          user.id === selectedUser.id ? updatedUser : user
        ));
        toast.success("User updated successfully");
      }
      handleClose();
    } catch (err) {
      console.error("Failed to update user:", err);
      toast.error(err?.message || "Failed to update user");
    }
  };

  const handleDeleteUserClick = (userId, userName) => {
    setUserToDelete({ id: userId, name: userName });
    setDeleteModalOpen(true);
    setMenuAnchor({ [userId]: null });
  };

  const handleDeleteUserConfirm = async () => {
    if (!userToDelete) return;

    try {
      setDeleting(true);
      await deleteAdminUser(userToDelete.id);
      setUsers(prev => prev.filter(user => user.id !== userToDelete.id));
      setDeleteModalOpen(false);
      setUserToDelete(null);
      toast.success("User deleted successfully");
    } catch (err) {
      console.error("Failed to delete user:", err);
      toast.error(err?.message || "Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteUserCancel = () => {
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleUpdateUserStatus = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
      await updateUserStatus(userId, { 
        status: newStatus,
        is_active: newStatus === "Active"
      });
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status: newStatus, is_active: newStatus === "Active" } : user
      ));
      setMenuAnchor({ [userId]: null });
      toast.success(`User ${newStatus.toLowerCase()}d successfully`);
    } catch (err) {
      console.error("Failed to update user status:", err);
      toast.error(err?.message || "Failed to update user status");
    }
  };

  const handleAssignRole = async (userId, roleId) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user || user.role !== "admin") return;

      await updateAdminUser(userId, { 
        role_id: roleId || null
      });
      
      // Update local state
      const selectedRole = roles.find(r => r.id === roleId);
      setUsers(prev => prev.map(u => 
        u.id === userId ? { 
          ...u, 
          role_id: roleId,
          role_name: selectedRole?.name || null
        } : u
      ));
      toast.success("Role assigned successfully");
    } catch (err) {
      console.error("Failed to assign role:", err);
      toast.error(err?.message || "Failed to assign role");
    }
  };

  const handleMenuOpen = (event, userId) => {
    setMenuAnchor({ [userId]: event.currentTarget });
  };

  const handleMenuClose = (userId) => {
    setMenuAnchor({ [userId]: null });
  };

  const tabs = [
    { label: "All", value: "all" },
    { label: "Admin", value: "admin" },
    { label: "Vendor", value: "vendor" },
    { label: "Agent", value: "agent" },
    { label: "Customer", value: "customer" },
  ];

  const getInitials = (name) => {
    if (!name) return "??";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getRoleColor = (role) => {
    const colors = {
      agent: "bg-yellow-4 text-yellow-3",
      vendor: "bg-green-4 text-green-3",
      admin: "bg-red-3 text-red-2",
      customer: "bg-blue-1-05 text-blue-1",
    };
    return colors[role?.toLowerCase()] || "bg-gray-4 text-gray-3";
  };

  return (
    <AdminDashboardLayout>
      <div className="row y-gap-10 x-gap-10 items-center mb-10">
        <div className="col-auto">
          <h1 className="text-30 lh-14 fw-600">User Management</h1>
        </div>
      </div>

      <div className="row y-gap-10 x-gap-10 items-center mb-10">
        <div className="col-auto">
          <div className="row px-10">
            {tabs.map((item) => (
              <div className="col-auto px-5" key={item.value}>
                <button
                  className={`text-14 px-10 fw-500 py-5 rounded-8 ${
                    activeTab === item.value ? "bg-white" : "text-light-1"
                  }`}
                  onClick={() => setActiveTab(item.value)}
                >
                  {item.label}
                </button>
              </div>
            ))}
          </div>
        </div>

        {checkPermission("user_management", "create") && (
          <div className="col-auto ms-auto">
            <button
              className="button bg-blue-1 text-white px-15 fw-400 py-10 rounded-8"
              onClick={() => {
                setSelectedUser(null);
                setShowModal(true);
              }}
            >
              <Plus size={20} /> Add User
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-8 border-light px-20 py-15">
        <h1 className="text-24 lh-14 fw-500">All Users</h1>
        <div className="text-14 lh-14 text-light-1">
          Manage all users across the platform
        </div>
        <div className="bg-white rounded-8 border-light py-5 mt-10">
          <div className="overflow-scroll scroll-bar-1">
            <table className="table-3 -border-bottom col-12">
              <thead className="bg-light-2">
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Admin Role</th>
                  <th>Status</th>
                  <th className="text-nowrap">Created At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-20">
                      <div className="d-inline-flex items-center justify-center gap-2 text-16 text-light-1">
                        <CircularProgress size={20} thickness={5} />
                        <span>Loading users...</span>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-20">
                      <div className="d-inline-flex items-center justify-center gap-2 text-16 text-light-1">
                        <UserX size={18} />
                        <span>No users found</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td className="align-middle">
                        <div className="d-flex items-center gap-2">
                          <div className="size-30 rounded-full text-light-1 bg-light-2 flex-center fw-500">
                            {user.avatar_url ? (
                              <img src={user.avatar_url} alt={user.name} className="size-30 rounded-full" />
                            ) : (
                              getInitials(user.name)
                            )}
                          </div>
                          <div>
                            <div className="d-flex items-center gap-1 text-14">
                              {user.name}
                            </div>
                            <div className="d-flex items-center gap-1 text-light-1 text-12 mt-5">
                              <Mail size={14} /> {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="align-middle text-12 lh-16 fw-500">
                        <span className={`rounded-100 py-4 px-10 text-center text-12 fw-500 ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="align-middle">
                        {user.role === "admin" ? (
                          checkPermission("user_management", "update") && isSuperAdmin() ? (
                            <select
                              className="form-select border-light rounded-8 py-5 px-10 text-12 w-140"
                              value={user.role_id || ""}
                              disabled={currentUser.id === user.id}
                              onChange={(e) => handleAssignRole(user.id, e.target.value ? parseInt(e.target.value) : null)}
                            >
                              <option value="">No Role</option>
                              {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                  {role.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-12 text-light-1">
                              {roles.find(r => r.id === user.role_id)?.name || "No Role"}
                            </span>
                          )
                        ) : (
                          <span className="text-12 text-light-1">-</span>
                        )}
                      </td>
                      <td className="align-middle">
                        <span
                          className={`rounded-100 py-4 px-10 text-center text-12 fw-500 ${
                            user.status === "Active"
                              ? "bg-green-1 text-green-2"
                              : "bg-light-2 text-dark-1"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="align-middle">
                        <div className="d-flex items-center gap-1 text-12 lh-16 fw-500">
                          {user.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A"}
                        </div>
                      </td>
                      <td className="align-middle">
                        <div className="position-relative">
                          <button
                            className="border-0 bg-transparent cursor-pointer px-5 py-5"
                            onClick={(e) => handleMenuOpen(e, user.id)}
                          >
                            <MoreVertical size={16} />
                          </button>
                          <Menu
                            anchorEl={menuAnchor[user.id]}
                            open={Boolean(menuAnchor[user.id])}
                            onClose={() => handleMenuClose(user.id)}
                          >
                            <MenuItem 
                              disabled={!checkPermission("user_management", "update")}
                              onClick={() => {
                                if (checkPermission("user_management", "update")) {
                                  handleEditClick(user);
                                  handleMenuClose(user.id);
                                }
                              }}
                            >
                              Edit
                            </MenuItem>
                            <MenuItem 
                              disabled={!checkPermission("user_management", "update")}
                              onClick={() => {
                                if (checkPermission("user_management", "update")) {
                                  handleUpdateUserStatus(user.id, user.status);
                                }
                              }}
                            >
                              {user.status === "Active" ? "Deactivate" : "Activate"}
                            </MenuItem>
                            <MenuItem 
                              disabled={!checkPermission("user_management", "delete")}
                              onClick={() => {
                                if (checkPermission("user_management", "delete")) {
                                  handleDeleteUserClick(user.id, user.name);
                                }
                              }} 
                              className="text-red-2"
                            >
                              Delete
                            </MenuItem>
                          </Menu>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      <Dialog
        open={showModal}
        onClose={handleClose}
        aria-labelledby="create-user-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <div className="px-20 py-20">
          <ModalContent 
            roles={roles} 
            formData={formData}
            setFormData={setFormData}
            title="Create New User"
            description="Add a new user to the system"
            isSuperAdmin={isSuperAdmin()}
          />
          <div className="d-flex justify-end gap-2 mt-20">
            <button
              className="text-14 border-light rounded-8 px-15 py-8"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              className="text-14 bg-blue-1 text-white fw-500 rounded-8 px-15 py-8"
              onClick={handleCreateUser}
            >
              Create User
            </button>
          </div>
        </div>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog
        open={showEditModal}
        onClose={handleClose}
        aria-labelledby="edit-user-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <div className="px-20 py-20">
          <ModalContent 
            roles={roles} 
            formData={formData}
            setFormData={setFormData}
            title="Edit User"
            description="Update user information"
            isEdit={true}
            isSuperAdmin={isSuperAdmin()}
          />
          <div className="d-flex justify-end gap-2 mt-20">
            <button
              className="text-14 border-light rounded-8 px-15 py-8"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              className="text-14 bg-blue-1 text-white fw-500 rounded-8 px-15 py-8"
              onClick={handleUpdateUser}
            >
              Update User
            </button>
          </div>
        </div>
      </Dialog>

      <ConfirmationModal
        open={deleteModalOpen}
        onClose={handleDeleteUserCancel}
        onConfirm={handleDeleteUserConfirm}
        title="Delete User"
        message={`Are you sure you want to delete the user "${userToDelete?.name || userToDelete?.id}"?`}
        itemName={userToDelete?.name || `User #${userToDelete?.id}`}
        loading={deleting}
      />
    </AdminDashboardLayout>
  );
};

const ModalContent = ({ roles = [], formData, setFormData, title, description, isEdit = false, isSuperAdmin = false }) => {
  const roleOptions = [
    { label: "Admin", value: "admin" },
    { label: "Vendor", value: "vendor" },
    { label: "Agent", value: "agent" },
    { label: "Customer", value: "customer" },
  ];

  const statusOptions = [
    { label: "Active", value: true },
    { label: "Inactive", value: false },
  ];

  const adminRoleOptions = roles.map(role => ({
    label: role.name,
    value: role.id,
  }));

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="row x-gap-10 y-gap-10 items-center">
      <h1 className="text-20 lh-14 fw-500">{title}</h1>
      <div className="text-12 text-light-1 lh-14 mb-15">
        {description}
      </div>

      <FormInput
        label="First Name"
        required={true}
        type="text"
        placeholder="Enter First Name"
        gridClass="col-12 mt-5"
        value={formData.first_name}
        onChange={(e) => handleChange("first_name", e.target.value)}
      />

      <FormInput
        label="Last Name"
        required={true}
        type="text"
        placeholder="Enter Last Name"
        gridClass="col-12 mt-5"
        value={formData.last_name}
        onChange={(e) => handleChange("last_name", e.target.value)}
      />

      <FormInput
        label="Email"
        required={true}
        type="email"
        placeholder="Enter Email"
        gridClass="col-12 mt-5"
        value={formData.email}
        onChange={(e) => handleChange("email", e.target.value)}
      />

      <FormInput
        label="Password"
        required={!isEdit}
        type="password"
        placeholder={isEdit ? "Leave blank to keep current password" : "Enter Password"}
        gridClass="col-12 mt-5"
        value={formData.password}
        onChange={(e) => handleChange("password", e.target.value)}
      />

      <FormInput
      />

      <FormInput
        label="Role"
        type="select"
        placeholder="Select Role"
        gridClass="col-12 mt-5"
        options={roleOptions}
        value={formData.role}
        onChange={(e) => handleChange("role", e.target.value)}
      />

      {formData.role === "admin" && isSuperAdmin && (
        <FormInput
          label="Admin Role"
          type="select"
          placeholder="Select Admin Role"
          gridClass="col-12 mt-5"
          options={adminRoleOptions}
          value={formData.role_id ? String(formData.role_id) : ""}
          onChange={(e) => handleChange("role_id", e.target.value ? parseInt(e.target.value) : null)}
        />
      )}

      <FormInput
        label="Status"
        type="select"
        placeholder="Select Status"
        gridClass="col-12 mt-5"
        options={statusOptions.map(s => ({ label: s.label, value: String(s.value) }))}
        value={String(formData.is_active)}
        onChange={(e) => handleChange("is_active", e.target.value === "true")}
      />
      
    </div>
  );
};

export default index;