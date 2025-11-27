"use client";

import AdminDashboardLayout from "../common/layout";
import { Plus, MoreVertical, Tag } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, Menu, MenuItem, CircularProgress } from "@mui/material";
import FormInput from "@/components/common/form/FormInput";
import {
  getListingCategories,
  getListingSubcategories,
  createListingCategory,
  updateListingCategory,
  deleteListingCategory,
  createListingSubcategory,
  updateListingSubcategory,
  deleteListingSubcategory
} from "@/helpers/backend_helper";
import { toast } from "react-toastify";
import { usePermissions } from "@/hooks/usePermissions";
import ConfirmationModal from "@/components/common/ConfirmationModal";

const index = () => {
  const { hasPermission } = usePermissions();
  const [activeTab, setActiveTab] = useState("category");
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [parentCategoryFilter, setParentCategoryFilter] = useState("all");

  // Delete confirmation modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Menu anchor state for dropdown actions
  const [menuAnchor, setMenuAnchor] = useState({});

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category_id: "",
    type: "",
    subtype: "",
    status: "active"
  });

  const handleClose = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      category_id: "",
      type: "",
      subtype: "",
      status: "active"
    });
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getListingCategories();
      const categoriesData = response?.data || response || [];
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error(error?.message || "Failed to fetch categories");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch subcategories
  const fetchSubcategories = async () => {
    try {
      setLoading(true);
      const response = await getListingSubcategories();
      const subcategoriesData = response?.data || response || [];
      setSubcategories(Array.isArray(subcategoriesData) ? subcategoriesData : []);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      toast.error(error?.message || "Failed to fetch subcategories");
      setSubcategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount and tab change
  useEffect(() => {
    if (activeTab === "category") {
      fetchCategories();
    } else {
      // Ensure categories are available for subcategory parent names and filtering
      fetchSubcategories();
      fetchCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Derived filtered data
  const filteredCategories = categories.filter((cat) => {
    const statusOk =
      statusFilter === "all" || (statusFilter === "active" ? cat.is_active !== false : cat.is_active === false);
    const typeOk = typeFilter === "all" || (cat.type || "").toLowerCase() === typeFilter;
    return statusOk && typeOk;
  });

  const filteredSubcategories = subcategories.filter((sub) => {
    const statusOk =
      statusFilter === "all" || (statusFilter === "active" ? sub.is_active !== false : sub.is_active === false);
    const parentOk =
      parentCategoryFilter === "all" || String(sub.category_id) === String(parentCategoryFilter);
    return statusOk && parentOk;
  });

  // Actions
  const handleViewAll = () => {
    setStatusFilter("all");
    setTypeFilter("all");
    setParentCategoryFilter("all");
    // Reload data
    if (activeTab === "category") {
      fetchCategories();
    } else {
      fetchSubcategories();
      fetchCategories();
    }
  };

  const toCsv = (rows) => {
    const escapeCell = (cell) => {
      const value = cell == null ? "" : String(cell);
      if (/[",\n]/.test(value)) {
        return '"' + value.replace(/"/g, '""') + '"';
      }
      return value;
    };
    return rows.map((row) => row.map(escapeCell).join(",")).join("\n");
  };

  const handleExport = () => {
    try {
      const isCategory = activeTab === "category";
      const data = isCategory ? filteredCategories : filteredSubcategories;
      const headers = isCategory
        ? ["Category", "Listing Type", "Status", "Description"]
        : ["Subcategory", "Parent Category", "Status", "Description"];

      const rows = data.map((item) => {
        if (isCategory) {
          return [
            item.name || "-",
            item.type || "-",
            item.is_active !== false ? "Active" : "Inactive",
            item.description || "-",
          ];
        }
        const parentName = categories.find((c) => c.id === item.category_id)?.name || "-";
        return [
          item.name || "-",
          parentName,
          item.is_active !== false ? "Active" : "Inactive",
          item.description || "-",
        ];
      });

      const csv = toCsv([headers, ...rows]);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      link.href = url;
      link.download = `${isCategory ? "categories" : "subcategories"}-${timestamp}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed", err);
      toast.error(err?.message || "Failed to export");
    }
  };

  // Handle create/update
  const handleSubmit = async () => {
    try {
      if (!formData.name.trim()) {
        toast.error("Name is required");
        return;
      }

      const payload = { name: formData.name.trim() };

      if (formData.description) {
        payload.description = formData.description.trim();
      }

      if (activeTab === "category") {
        // Category fields: name, description, type, subtype (if property), status
        if (!formData.type) {
          toast.error("Type is required");
          return;
        }
        payload.type = formData.type;
        // Handle subtype: only applicable for property type
        if (formData.type === "property") {
          // If subtype is provided and not empty, include it; otherwise, set to null
          if (formData.subtype && formData.subtype.trim() !== "") {
            payload.subtype = formData.subtype;
          } else {
            payload.subtype = null;
          }
        } else {
          // If type is not property, explicitly set subtype to null
          payload.subtype = null;
        }
        payload.is_active = formData.status === "active";
      } else {
        // Subcategory fields: name, description, parent category id, status
        if (!formData.category_id) {
          toast.error("Parent category is required");
          return;
        }
        payload.category_id = parseInt(formData.category_id);
        // Status field for subcategory
        payload.is_active = (formData.status || "active") === "active";
      }

      let response;
      if (editingId) {
        // Update
        if (activeTab === "category") {
          response = await updateListingCategory(editingId, payload);
        } else {
          response = await updateListingSubcategory(editingId, payload);
        }
        toast.success(`${activeTab === "category" ? "Category" : "Subcategory"} updated successfully`);
      } else {
        // Create
        if (activeTab === "category") {
          response = await createListingCategory(payload);
        } else {
          response = await createListingSubcategory(payload);
        }
        toast.success(`${activeTab === "category" ? "Category" : "Subcategory"} created successfully`);
      }

      handleClose();
      // Refresh data
      if (activeTab === "category") {
        await fetchCategories();
      } else {
        await fetchSubcategories();
      }
    } catch (error) {
      console.error("Error saving:", error);
      toast.error(error?.message || `Failed to ${editingId ? "update" : "create"} ${activeTab}`);
    }
  };

  // Handle edit
  const handleEdit = (item) => {
    setEditingId(item.id);
    if (activeTab === "category") {
      setFormData({
        name: item.name || "",
        description: item.description || "",
        category_id: "",
        type: item.type || "",
        subtype: item.subtype || "",
        status: item.is_active !== false ? "active" : "inactive"
      });
    } else {
      setFormData({
        name: item.name || "",
        description: item.description || "",
        category_id: item.category_id || "",
        type: "",
        status: item.is_active !== false ? "active" : "inactive"
      });
    }
    setShowModal(true);
  };

  // Handle delete
  const handleDeleteClick = (id, name) => {
    setItemToDelete({ id, name, type: activeTab });
    setDeleteModalOpen(true);
  };

  // Menu handlers for dropdown actions
  const handleMenuOpen = (event, itemId) => {
    setMenuAnchor({ [itemId]: event.currentTarget });
  };

  const handleMenuClose = (itemId) => {
    setMenuAnchor({ [itemId]: null });
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      setDeleting(true);
      if (itemToDelete.type === "category") {
        await deleteListingCategory(itemToDelete.id);
      } else {
        await deleteListingSubcategory(itemToDelete.id);
      }
      toast.success(`${itemToDelete.type === "category" ? "Category" : "Subcategory"} deleted successfully`);

      // Refresh data
      if (itemToDelete.type === "category") {
        await fetchCategories();
      } else {
        await fetchSubcategories();
      }
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error(error?.message || `Failed to delete ${itemToDelete.type}`);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  // Handle form change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: value
      };
      // Clear subtype when type changes (if not property)
      if (name === "type" && value !== "property") {
        updated.subtype = "";
      }
      return updated;
    });
  };

  const tabs = [
    {
      label: "Category",
      value: "category",
    },
    {
      label: "Subcategory",
      value: "subcategory",
    }
  ];

  return (
    <AdminDashboardLayout>
      <div className="row y-gap-10 x-gap-10 items-center mb-10">
        <div className="col-auto">
          <h1 className="text-30 lh-14 fw-600">Category Management</h1>
          <div className="text-14 lh-14 text-light-1">
            Magage Your Categories/Subcategories
          </div>
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

        <div className="col-auto ms-auto">
          <button
            className={`button px-15 fw-400 py-10 rounded-8 ${hasPermission("category_management", "create")
              ? "bg-blue-1 text-white"
              : "bg-light-2 text-light-1 cursor-not-allowed opacity-50"
              }`}
            onClick={() => {
              if (hasPermission("category_management", "create")) {
                setShowModal(true);
              }
            }}
            disabled={!hasPermission("category_management", "create")}
          >
            <Plus size={20} /> Add
          </button>
        </div>
      </div>

      <div className="bg-white rounded-8 border-light px-20 py-15">
        {/* <h1 className="text-24 lh-14 fw-500">All Cate</h1>
        <div className="text-14 lh-14 text-light-1">
          Manage all users across the platform
        </div> */}

        <div className="row y-gap-10 x-gap-10 items-center mb-5 mt-10">

          <div className="col-sm-auto">
            <select
              className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-140 sm:w-full"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {activeTab === "category" && (
            <div className="col-sm-auto">
              <select
                className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-140 sm:w-full"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="property">Property</option>
                <option value="activity">Activity</option>
                <option value="tour">Tour</option>
                <option value="event">Event</option>
                <option value="flight">Flight</option>
                <option value="ride">Ride</option>
              </select>
            </div>
          )}

          {activeTab === "subcategory" && (
            <div className="col-sm-auto">
              <select
                className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-140 sm:w-full"
                value={parentCategoryFilter}
                onChange={(e) => setParentCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="col-sm-auto ms-auto d-flex">
            <button
              className="button -md px-15 py-10 fw-400 text-14 bg-white border-light rounded-8 sm:w-full me-2"
              onClick={handleExport}
            >
              Export
            </button>
            <button
              className="button -md px-15 py-10 fw-400 text-14 text-white bg-blue-1 rounded-8 sm:w-full"
              onClick={handleViewAll}
            >
              View All
            </button>
          </div>

          <div className="bg-white rounded-8 border-light px-15 mt-10">
            <div className="overflow-scroll scroll-bar-1">
              <table className="table-2 col-12 text-14">
                <thead className="text-nowrap">
                  {activeTab === "category" ? (
                    <tr>
                      <th>Category</th>
                      <th>Listing Type</th>
                      <th>Status</th>
                      <th>Description</th>
                      <th>Action</th>
                    </tr>
                  ) : (
                    <tr>
                      <th>Subcategory</th>
                      <th>Parent Category</th>
                      <th>Status</th>
                      <th>Description</th>
                      <th>Action</th>
                    </tr>
                  )}
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="text-center py-20">
                        <div className="d-flex items-center justify-center gap-2 text-14 text-light-1">
                          <CircularProgress size={24} />
                          <span>Loading categories...</span>
                        </div>
                      </td>
                    </tr>
                  ) : activeTab == "category" ? (
                    filteredCategories.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-20">
                          <div className="d-flex flex-column items-center justify-center gap-2 text-14 text-light-1">
                            <Tag size={18} />
                            <span>No categories found</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredCategories.map((item, index) => (
                        <tr key={item.id || index}>
                          <td className="align-middle text-12 lh-16 fw-500">
                            {item.name}
                          </td>
                          <td className="align-middle text-12 lh-16 fw-500">
                            {item.type || "-"}
                          </td>
                          <td className="align-middle">
                            <span
                              className={`rounded-100 py-4 px-10 text-center text-12 fw-500 ${item.is_active !== false
                                ? "bg-green-1 text-green-2"
                                : "bg-light-2 text-dark-1"
                                }`}
                            >
                              {item.is_active !== false ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="align-middle text-12 lh-16 fw-500">
                            {item.description || "-"}
                          </td>
                          <td className="align-middle">
                            <div className="position-relative">
                              <button
                                className="border-0 bg-transparent cursor-pointer px-5 py-5"
                                onClick={(e) => handleMenuOpen(e, item.id)}
                              >
                                <MoreVertical size={16} />
                              </button>
                              <Menu
                                anchorEl={menuAnchor[item.id]}
                                open={Boolean(menuAnchor[item.id])}
                                onClose={() => handleMenuClose(item.id)}
                              >
                                <MenuItem
                                  disabled={!hasPermission("category_management", "update")}
                                  onClick={() => {
                                    if (hasPermission("category_management", "update")) {
                                      handleEdit(item);
                                      handleMenuClose(item.id);
                                    }
                                  }}
                                >
                                  Edit
                                </MenuItem>
                                <MenuItem
                                  disabled={!hasPermission("category_management", "delete")}
                                  onClick={() => {
                                    if (hasPermission("category_management", "delete")) {
                                      handleDeleteClick(item.id, item.name);
                                      handleMenuClose(item.id);
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
                    )
                  ) : (
                    filteredSubcategories.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-20">
                          <div className="text-14 text-light-1">No subcategories found</div>
                        </td>
                      </tr>
                    ) : (
                      filteredSubcategories.map((item, index) => (
                        <tr key={item.id || index}>
                          <td className="align-middle text-12 lh-16 fw-500">
                            {item.name}
                          </td>
                          <td className="align-middle text-12 lh-16 fw-500">
                            {categories.find(cat => cat.id === item.category_id)?.name || "-"}
                          </td>
                          <td className="align-middle">
                            <span
                              className={`rounded-100 py-4 px-10 text-center text-12 fw-500 ${item.is_active !== false
                                ? "bg-green-1 text-green-2"
                                : "bg-light-2 text-dark-1"
                                }`}
                            >
                              {item.is_active !== false ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="align-middle text-12 lh-16 fw-500">
                            {item.description || "-"}
                          </td>
                          <td className="align-middle">
                            <div className="position-relative">
                              <button
                                className="border-0 bg-transparent cursor-pointer px-5 py-5"
                                onClick={(e) => handleMenuOpen(e, item.id)}
                              >
                                <MoreVertical size={16} />
                              </button>
                              <Menu
                                anchorEl={menuAnchor[item.id]}
                                open={Boolean(menuAnchor[item.id])}
                                onClose={() => handleMenuClose(item.id)}
                              >
                                <MenuItem
                                  disabled={!hasPermission("category_management", "update")}
                                  onClick={() => {
                                    if (hasPermission("category_management", "update")) {
                                      handleEdit(item);
                                      handleMenuClose(item.id);
                                    }
                                  }}
                                >
                                  Edit
                                </MenuItem>
                                <MenuItem
                                  disabled={!hasPermission("category_management", "delete")}
                                  onClick={() => {
                                    if (hasPermission("category_management", "delete")) {
                                      handleDeleteClick(item.id, item.name);
                                      handleMenuClose(item.id);
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
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        open={showModal}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-title"
      >
        <div className="px-20 py-20 w-500 sm:w-full">
          <ModalContent
            activeTab={activeTab}
            formData={formData}
            handleFormChange={handleFormChange}
            categories={categories}
            editingId={editingId}
          />
          <div className="d-flex justify-end gap-2 mt-10">
            <button
              className="text-14 border-light rounded-8 px-10 py-5"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              className="text-14 bg-blue-1 text-white fw-500 rounded-8 px-10 py-5"
              onClick={handleSubmit}
              disabled={loading}
            >
              {editingId ? "Update" : "Create"} {activeTab === "category" ? "Category" : "Subcategory"}
            </button>
          </div>
        </div>
      </Dialog>

      <ConfirmationModal
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title={`Delete ${itemToDelete?.type === "category" ? "Category" : "Subcategory"}`}
        message={`Are you sure you want to delete ${itemToDelete?.type === "category" ? "the category" : "the subcategory"} "${itemToDelete?.name}"?`}
        itemName={itemToDelete?.name}
        loading={deleting}
      />
    </AdminDashboardLayout>
  );
};

const ModalContent = ({ activeTab, formData, handleFormChange, categories, editingId }) => {
  const categoryOptions = categories.map(cat => ({
    value: cat.id,
    label: cat.name
  }));

  const typeOptions = [
    { value: "property", label: "Property" },
    { value: "activity", label: "Activity" },
    { value: "tour", label: "Tour" },
    { value: "event", label: "Event" },
    { value: "flight", label: "Flight" },
    { value: "ride", label: "Ride" }
  ];

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" }
  ];

  return (
    <div className="row x-gap-10 y-gap-10 items-center">
      {activeTab === "category" ? (
        <>
          <h1 className="text-20 lh-14 fw-500">{editingId ? "Edit" : "Create New"} Category</h1>
          <div className="text-12 text-light-1 lh-14 mb-15">
            Define a new category
          </div>

          <FormInput
            label="Category Name"
            required={true}
            type="text"
            name="name"
            placeholder="Enter Category Name"
            gridClass="col-12 mt-5"
            value={formData.name}
            onChange={handleFormChange}
          />

          <FormInput
            label="Description"
            type="textarea"
            name="description"
            placeholder="Fill Description"
            gridClass="col-12 mt-5"
            value={formData.description}
            onChange={handleFormChange}
          />

          <FormInput
            label="Type"
            required={true}
            type="select"
            name="type"
            placeholder="Select type"
            gridClass="col-12 mt-5"
            options={typeOptions}
            value={formData.type}
            onChange={handleFormChange}
          />

          {formData.type === "property" && (
            <FormInput
              label="Subtype"
              type="select"
              name="subtype"
              placeholder="Select subtype (optional)"
              gridClass="col-12 mt-5"
              options={[
                { value: "", label: "Select subtype (optional)" },
                { value: "Hotel", label: "Hotel" },
                { value: "Vacation", label: "Vacation Rental" },
                { value: "Space", label: "Space" },
                { value: "EventVenue", label: "Event Venue" }
              ]}
              value={formData.subtype || ""}
              onChange={handleFormChange}
            />
          )}

          <FormInput
            label="Status"
            required={true}
            type="select"
            name="status"
            placeholder="Select status"
            gridClass="col-12 mt-5"
            options={statusOptions}
            value={formData.status}
            onChange={handleFormChange}
          />
        </>
      ) : (
        <>
          <h1 className="text-20 lh-14 fw-500">{editingId ? "Edit" : "Create New"} Sub-Category</h1>
          <div className="text-12 text-light-1 lh-14 mb-15">
            Define a new subcategory
          </div>

          <FormInput
            label="Parent Category"
            required={true}
            type="select"
            name="category_id"
            placeholder="Select parent category"
            gridClass="col-12 mt-5"
            options={categoryOptions}
            value={formData.category_id}
            onChange={handleFormChange}
          />

          <FormInput
            label="Sub-Category Name"
            required={true}
            type="text"
            name="name"
            placeholder="Enter Sub-Category Name"
            gridClass="col-12 mt-5"
            value={formData.name}
            onChange={handleFormChange}
          />

          <FormInput
            label="Description"
            type="textarea"
            name="description"
            placeholder="Fill Description"
            gridClass="col-12 mt-5"
            value={formData.description}
            onChange={handleFormChange}
          />

          <FormInput
            label="Status"
            required={true}
            type="select"
            name="status"
            placeholder="Select status"
            gridClass="col-12 mt-5"
            options={statusOptions}
            value={formData.status}
            onChange={handleFormChange}
          />
        </>
      )}
    </div>
  );
};

export default index;
