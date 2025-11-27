"use client";

import AdminDashboardLayout from "../common/layout";
import { Tag } from "lucide-react";
import { useState, useEffect } from "react";
import { Menu as MuiMenu, MenuItem, CircularProgress } from "@mui/material";
import { usePermissions } from "@/hooks/usePermissions";
import { toast } from "react-toastify";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import {
  getAdminCommissions,
  deleteAdminCommission,
  updateCommissionStatus
} from "@/helpers/backend_helper";

const index = () => {
  const { hasPermission } = usePermissions();
  const [activeTab, setActiveTab] = useState("all");
  const [menuAnchor, setMenuAnchor] = useState({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch commissions from backend
  useEffect(() => {
    fetchCommissions();
  }, [activeTab]);

  const fetchCommissions = async () => {
    try {
      setLoading(true);
      const params = {};
      if (activeTab !== "all") {
        params.role = activeTab;
      }
      const response = await getAdminCommissions(params);
      const commissions = response?.commissions || [];

      // Map backend data to frontend format
      const mappedEntries = commissions.map((commission) => ({
        id: commission.id,
        name: commission.user?.business_name || commission.user?.email || `User ${commission.user_id}`,
        listing_type: commission.listing_type || "-",
        status: commission.is_active ? "Active" : "Inactive",
        plan: commission.plan || "-",
        commission_rate: parseFloat(commission.commission_rate) || 0,
        total_commission: `$${parseFloat(commission.total_commission || 0).toLocaleString()}`,
        total_revenue: `$${parseFloat(commission.total_revenue || 0).toLocaleString()}`,
        role: commission.role === "vendor" ? "Vendor" : "Agent",
        is_active: commission.is_active,
        user_id: commission.user_id,
      }));

      setEntries(mappedEntries);
    } catch (error) {
      console.error("Error fetching commissions:", error);
      toast.error(error?.message || "Failed to fetch commissions");
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Vendor",
      value: "vendor",
    },
    {
      label: "Agent",
      value: "agent",
    },
  ];

  // Handle menu open/close
  const handleMenuOpen = (event, entryId) => {
    event.stopPropagation();
    setMenuAnchor({ ...menuAnchor, [entryId]: event.currentTarget });
  };

  const handleMenuClose = (entryId) => {
    setMenuAnchor({ ...menuAnchor, [entryId]: null });
  };

  // Handle delete
  const handleDeleteClick = (entry) => {
    setItemToDelete(entry);
    setDeleteModalOpen(true);
    handleMenuClose(entry.id);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      setDeleting(true);
      await deleteAdminCommission(itemToDelete.id);
      toast.success(`${itemToDelete.role} commission deleted successfully`);
      setDeleteModalOpen(false);
      setItemToDelete(null);
      // Refresh data
      await fetchCommissions();
    } catch (error) {
      console.error("Error deleting commission:", error);
      toast.error(error?.message || "Failed to delete commission");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  // Handle activate/deactivate
  const handleToggleStatus = async (entry) => {
    try {
      const newStatus = !entry.is_active;
      await updateCommissionStatus(entry.id, newStatus);
      toast.success(`Commission ${newStatus ? "activated" : "deactivated"} successfully`);
      handleMenuClose(entry.id);
      // Refresh data
      await fetchCommissions();
    } catch (error) {
      console.error("Error updating commission status:", error);
      toast.error(error?.message || "Failed to update commission status");
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="row y-gap-10 x-gap-10 items-center mb-10">
        <div className="col-auto">
          <h1 className="text-30 lh-14 fw-600">
            Agent & Vendor Commission Management
          </h1>
          {/* <div className="text-14 lh-14 text-light-1">
            Manage all users across the platform
          </div> */}
        </div>
      </div>
      <div className="row y-gap-10 x-gap-10 items-center mb-10">
        <div className="col-auto">
          <div className="row px-10">
            {tabs.map((item) => (
              <div className="col-auto px-5" key={item.value}>
                <button
                  className={`text-14 px-10 fw-500 py-5 rounded-8 ${activeTab === item.value ? "bg-white" : "text-light-1"
                    }`}
                  onClick={() => {
                    setActiveTab(item.value);
                  }}
                >
                  {item.label}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-8 border-light px-20 py-15">
        <div className="d-flex items-center justify-between mb-10">
          <div className="d-flex flex-column">
            <h1 className="text-24 lh-14 fw-500"> Commission Overview</h1>
            <div className="text-14 lh-14 text-light-1">
              Manage commission rates for vendors and agents
            </div>
          </div>
          {/* <div className="d-flex items-center gap-2">
            {activeTab === "vendor" && (
              <select className="form-select border-light h-45 px-15 w-140">
                <option value="all">All Vendors</option>
              </select>
            )}
            {activeTab === "agent" && (
              <select className="form-select border-light h-45 px-15 w-140">
                <option value="all">All Agents</option>
              </select>
            )}
            <select className="form-select border-light h-45 px-15 w-140">
              <option value="all">All Locations</option>
            </select>
          </div> */}
        </div>
        <div className="bg-white rounded-8 border-light px-15 py-5 mt-10">
          <div className="overflow-scroll scroll-bar-1">
            <table className="table-2 text-14 col-12">
              <thead className="text-nowrap">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Listing Type</th>
                  <th>Plan</th>
                  <th>Commission Rate</th>
                  <th>Total Revenue</th>
                  <th>Total Commission</th>
                  <th>Status</th>
                  {/* <th>Action</th> */}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="10" className="text-center py-20">
                      <div className="d-flex items-center justify-center gap-2 text-14 text-light-1">
                        <CircularProgress size={24} />
                        <span>Loading commissions...</span>
                      </div>
                    </td>
                  </tr>
                ) : entries.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center py-20">
                      <div className="d-flex flex-column items-center justify-center gap-2 text-14 text-light-1">
                        <Tag size={18} />
                        <span>No commissions found</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  entries
                    .filter((item) => {
                      return activeTab === "all"
                        ? true
                        : item.role.toLowerCase() === activeTab;
                    })
                    .map((entry, index) => (
                      <tr key={index}>
                        <td className="align-middle text-12 lh-16 fw-500">
                          {entry.id}
                        </td>
                        <td className="align-middle text-12 lh-16 fw-500">
                          {entry.name}
                        </td>

                        <td className="align-middle text-12 lh-16 fw-500">
                          <span
                            className={`rounded-100 py-4 px-10 text-center text-12 fw-500 ${{
                                Vendor: "bg-green-4 text-green-3",
                                Agent: "bg-blue-1-05 text-blue-1",
                              }[entry.role] || "bg-gray-4 text-gray-3"
                              }`}
                          >
                            {entry.role}
                          </span>
                        </td>

                        <td className="align-middle text-12 lh-16 fw-500">
                          {entry.listing_type}
                        </td>
                        <td className="align-middle text-12 lh-16 fw-500">
                          {entry.plan}
                        </td>
                        <td className="align-middle text-12 lh-16 fw-500">
                          {entry.commission_rate}%
                        </td>
                        <td className="align-middle text-12 lh-16 fw-500">
                          {entry.total_revenue}
                        </td>
                        <td className="align-middle text-12 lh-16 fw-500">
                          {entry.total_commission}
                        </td>
                        <td className="align-middle">
                          <span
                            className={`rounded-100 py-4 px-10 text-center text-12 fw-500 ${entry.status === "Active"
                                ? "bg-green-1 text-green-2"
                                : "bg-light-2 text-dark-1"
                              }`}
                          >
                            {entry.status}
                          </span>
                        </td>
                        {/* <td className="align-middle">
                        <div className="position-relative">
                          <button
                            className="border-0 bg-transparent cursor-pointer  px-5 py-5"
                            onClick={(e) => handleMenuOpen(e, entry.id)}
                          >
                            <MoreVertical size={16} />
                          </button>
                          <MuiMenu
                            anchorEl={menuAnchor[entry.id]}
                            open={Boolean(menuAnchor[entry.id])}
                            onClose={() => handleMenuClose(entry.id)}
                          >
                            <MenuItem 
                              disabled={!hasPermission("commission_management", "update")}
                              onClick={() => {
                                if (hasPermission("commission_management", "update")) {
                                  handleToggleStatus(entry);
                                }
                              }}
                            >
                              {entry.is_active ? "Deactivate" : "Activate"}
                            </MenuItem>
                            <MenuItem 
                              disabled={!hasPermission("commission_management", "delete")}
                              onClick={() => {
                                if (hasPermission("commission_management", "delete")) {
                                  handleDeleteClick(entry);
                                }
                              }} 
                              className="text-red-2"
                            >
                              Delete
                            </MenuItem>
                          </MuiMenu>
                        </div>
                      </td> */}
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmationModal
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title={`Delete ${itemToDelete?.role} Commission`}
        message={`Are you sure you want to delete the commission for "${itemToDelete?.name}"?`}
        itemName={itemToDelete?.name}
        loading={deleting}
      />
    </AdminDashboardLayout>
  );
};

export default index;
