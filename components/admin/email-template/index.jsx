"use client";

import AgentDashboardLayout from "../common/layout";
import { useState, useEffect, useMemo } from "react";
import { Dialog, Drawer, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { Eye, Edit, Trash2, MailX } from "lucide-react";
import { MailOutline } from "@mui/icons-material";
import { getEmailTemplates, deleteEmailTemplate } from "@/helpers/backend_helper";
import { toast } from "react-toastify";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { usePermissions } from "@/hooks/usePermissions";

const index = () => {
  const { hasPermission } = usePermissions();
  const [openFilter, setOpenFilter] = useState(false);
  const [email_templates, setEmail_templates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const handleClose = () => {
    setOpenFilter(false);
  };

  const [openModal, setOpenModal] = useState(false);
  const [preview, setPreview] = useState(null);
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Delete confirmation modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const router = useRouter();

  // Filters state
  const [filters, setFilters] = useState({
    status: "all", // Active / Inactive
    category: "all",
    type: "all", // text / html
    startDate: null,
    endDate: null,
  });

  const hasActiveFilters = useMemo(() => {
    return (
      (filters.status && filters.status !== "all") ||
      (filters.category && filters.category !== "all") ||
      (filters.type && filters.type !== "all") ||
      filters.startDate ||
      filters.endDate
    );
  }, [filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleResetFilters = () => {
    setFilters({ status: "all", category: "all", type: "all", startDate: null, endDate: null });
  };

  useEffect(() => {
    loadEmailTemplates();
  }, []);

  const loadEmailTemplates = async () => {
    try {
      setLoading(true);
      const res = await getEmailTemplates();
      const templates = res?.email_templates || res?.data?.email_templates || res?.data || res || [];
      const mapped = templates.map((t) => ({
        id: t.id,
        name: t.name || "Untitled Template",
        category: t.category || "General",
        subject: t.subject || "No Subject",
        type: t.type || "text",
        status: t.status || "Active",
        content: t.content || t.body || "",
        body: t.body || t.content || "",
        last_used: t.last_used ? new Date(t.last_used).toISOString().split("T")[0] : null,
      }));
      setEmail_templates(mapped);
    } catch (error) {
      toast.error(error?.message || "Failed to load email templates");
      setEmail_templates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id, name) => {
    if (!hasPermission("email_template", "delete")) {
      toast.error("You don't have permission to delete email templates");
      return;
    }
    setItemToDelete({ id, name });
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      setDeleting(true);
      await deleteEmailTemplate(itemToDelete.id);
      toast.success("Email template deleted successfully");
      loadEmailTemplates(); // Refresh the list
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      toast.error(error?.message || "Failed to delete email template");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const filteredTemplates = email_templates.filter((t) => {
    // Search filter
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      const matchesSearch =
        t.name.toLowerCase().includes(s) ||
        t.subject.toLowerCase().includes(s) ||
        t.category.toLowerCase().includes(s);
      if (!matchesSearch) return false;
    }

    // Status filter
    if (filters.status !== "all") {
      if ((t.status || "").toLowerCase() !== filters.status.toLowerCase()) return false;
    }

    // Category filter
    if (filters.category !== "all") {
      if ((t.category || "").toLowerCase() !== filters.category.toLowerCase()) return false;
    }

    // Type filter
    if (filters.type !== "all") {
      if ((t.type || "").toLowerCase() !== filters.type.toLowerCase()) return false;
    }

    // Date range filter (last_used)
    if (filters.startDate || filters.endDate) {
      if (!t.last_used) return false;
      const d = new Date(t.last_used);
      if (filters.startDate) {
        const start = new Date(filters.startDate);
        start.setHours(0, 0, 0, 0);
        if (d < start) return false;
      }
      if (filters.endDate) {
        const end = new Date(filters.endDate);
        end.setHours(23, 59, 59, 999);
        if (d > end) return false;
      }
    }

    return true;
  });

  return (
    <AgentDashboardLayout>
      <div className="row y-gap-10 x-gap-10 items-center mb-10">
        <div className="col-auto">
          <h1 className="text-30 lh-14 fw-600">Email Templates</h1>
          <div className="text-14 lh-14 text-light-1">
            Create and manage email templates for various system notifications.
          </div>
        </div>
        <div className="col-auto ms-auto">
          <button
            className={`button px-15 py-10 rounded-8 ${hasActiveFilters ? "bg-blue-1 text-white" : "border-blue-1 text-blue-1"}`}
            onClick={() => setOpenFilter(true)}
          >
            Filter{hasActiveFilters ? ` (${Object.values(filters).filter(v => v !== "all" && v !== null).length})` : ""}
          </button>
          <Drawer anchor="right" open={openFilter} onClose={handleClose}>
            <div className="w-300 rounded-left rounded-8 bg-white px-20 py-20 h-100 d-flex flex-column justify-between">
              <div className="overflow-y-auto flex-grow-1">
                <h2 className="text-20 fw-600 mb-20">Filter Templates</h2>
                <div className="d-flex flex-column y-gap-15">
                  <div>
                    <h3 className="text-14 fw-600 mb-10">Status</h3>
                    <select
                      className="form-select rounded-8 border-light py-10 px-15 w-100 text-14"
                      value={filters.status}
                      onChange={(e) => handleFilterChange("status", e.target.value)}
                    >
                      <option value="all">All</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <h3 className="text-14 fw-600 mb-10">Category</h3>
                    <select
                      className="form-select rounded-8 border-light py-10 px-15 w-100 text-14"
                      value={filters.category}
                      onChange={(e) => handleFilterChange("category", e.target.value)}
                    >
                      <option value="all">All</option>
                      <option value="Booking">Booking</option>
                      <option value="Payment">Payment</option>
                      <option value="User">User</option>
                      <option value="Refund">Refund</option>
                      <option value="Technical">Technical</option>
                      <option value="Commission">Commission</option>
                      <option value="General">General</option>
                    </select>
                  </div>

                  <div>
                    <h3 className="text-14 fw-600 mb-10">Type</h3>
                    <select
                      className="form-select rounded-8 border-light py-10 px-15 w-100 text-14"
                      value={filters.type}
                      onChange={(e) => handleFilterChange("type", e.target.value)}
                    >
                      <option value="all">All</option>
                      <option value="text">Text</option>
                      <option value="html">HTML</option>
                    </select>
                  </div>

                  <div>
                    <h3 className="text-14 fw-600 mb-10">Date Range (Last Used)</h3>
                    <input
                      type="date"
                      className="form-control border-light rounded-8 py-10 px-15 text-14 mb-10"
                      value={filters.startDate || ""}
                      onChange={(e) => handleFilterChange("startDate", e.target.value || null)}
                    />
                    <input
                      type="date"
                      className="form-control border-light rounded-8 py-10 px-15 text-14"
                      value={filters.endDate || ""}
                      onChange={(e) => handleFilterChange("endDate", e.target.value || null)}
                    />
                  </div>
                </div>
              </div>
              <div className="col-12 d-flex justify-end gap-2 mt-20 pt-20 border-top-light">
                <button
                  className="border-light rounded-8 py-5 px-15 text-14"
                  onClick={handleResetFilters}
                >
                  Reset
                </button>
                <button
                  className="bg-blue-1 text-white rounded-8 py-5 px-15 text-14"
                  onClick={handleClose}
                >
                  Apply
                </button>
              </div>
            </div>
          </Drawer>
        </div>
        <div className="col-auto">
          <button
            className="button bg-blue-1 text-white px-15 fw-400 py-10 rounded-8"
            onClick={() => router.push("/admin/email-template/add")}
            disabled={!hasPermission("email_template", "create")}
            style={{
              opacity: !hasPermission("email_template", "create") ? 0.5 : 1,
              cursor: !hasPermission("email_template", "create") ? "not-allowed" : "pointer",
            }}
          >
            New Email Template
          </button>
        </div>
      </div>

      <div className="bg-white rounded-8 border-light px-20 py-15">
        <div className="d-flex items-center justify-between mb-10 mt-5">
          <div className="position-relative d-flex items-center w-180 sm:w-full">
            <input
              type="text"
              placeholder="Search templates..."
              className="border-light bg-white rounded-8 px-10 py-5 pl-30"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i
              className="icon-search text-light-1 position-absolute"
              style={{
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            ></i>
          </div>
          {/* <button className="button border-light px-20 py-10 rounded-8">
            <MailOutline className="text-18 mr-10" /> Test Email
          </button> */}
        </div>
        <div className="bg-white rounded-8 border-light px-15 py-5 mt-10">
          <div className="overflow-scroll scroll-bar-1">
            <table className="table-2 col-12">
              <thead>
                <tr className="text-light-1 fw-600">
                  <th>Template Name</th>
                  <th>Category</th>
                  <th>Subject</th>
                  <th>Last Used</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={6} className="text-center py-20">
                      <div className="d-inline-flex items-center justify-center gap-2 text-14 text-light-1">
                        <CircularProgress size={20} thickness={5} />
                        <span>Loading email templates...</span>
                      </div>
                    </td>
                  </tr>
                )}
                {!loading && filteredTemplates.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-40">
                      <div className="d-flex flex-column items-center justify-center gap-10">
                        <MailX size={32} className="text-light-1 mb-5" />
                        <div className="text-16 text-light-1 fw-500">No email templates found</div>
                        <div className="text-14 text-light-1">
                          {searchTerm ? "Try a different search term." : "Create your first email template to get started."}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  !loading && filteredTemplates.map((row) => (
                    <tr key={row.id}>
                      <td className="align-middle">{row.name}</td>
                      <td className="align-middle">{row.category}</td>
                      <td className="align-middle">{row.subject}</td>
                      <td className="align-middle">{row.last_used || "—"}</td>
                      <td className="align-middle">
                        <span className="text-14 px-10 text-white bg-dark-blue rounded-100 fw-500">
                          {row.status}
                        </span>
                      </td>
                      <td className="align-middle">
                        <div className="d-flex items-center justify-end">
                          <Eye
                            size={18}
                            className={`mr-5 ${hasPermission("email_template", "view") ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
                            onClick={() => {
                              if (hasPermission("email_template", "view")) {
                                setPreview(row);
                                handleOpenModal();
                              } else {
                                toast.error("You don't have permission to view email templates");
                              }
                            }}
                            title="Preview template"
                          />
                          <Edit
                            size={18}
                            className={`mr-5 ${hasPermission("email_template", "update") ? "cursor-pointer text-blue-1" : "cursor-not-allowed opacity-50 text-light-1"}`}
                            onClick={() => {
                              if (hasPermission("email_template", "update")) {
                                router.push(`/admin/email-template/add?edit=${row.id}`);
                              } else {
                                toast.error("You don't have permission to edit email templates");
                              }
                            }}
                            title="Edit template"
                          />
                          <Trash2
                            size={18}
                            className={`${hasPermission("email_template", "delete") ? "cursor-pointer text-red-1" : "cursor-not-allowed opacity-50 text-light-1"}`}
                            onClick={() => handleDeleteClick(row.id, row.name)}
                            title="Delete template"
                          />
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

      <Dialog open={openModal} onClose={handleCloseModal}>
        <div className="px-20 py-20" style={{ width: "500px" }}>
          <h1 className="text-20 fw-500 mb-10">Email Template Preview</h1>
          {preview?.type == "text" ? (
            <div
              dangerouslySetInnerHTML={{
                __html: preview?.content.replace(/\n/g, "<br/>"),
              }}
            />
          ) : (
            <div
              dangerouslySetInnerHTML={{
                __html: preview?.content,
              }}
            />
          )}
        </div>
      </Dialog>

      <ConfirmationModal
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Email Template"
        message={`Are you sure you want to delete the template "${itemToDelete?.name}"?`}
        itemName={itemToDelete?.name}
        loading={deleting}
      />
    </AgentDashboardLayout>
  );
};

export default index;
