"use client";

import AdminDashboardLayout from "../common/layout";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog } from "@mui/material";
import FormInput from "@/components/common/form/FormInput";
import { ListingAPIClient } from "@/helpers/api_helper";
import { toast } from "react-toastify";

const index = () => {
  const [activeTab, setActiveTab] = useState("category");
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category_id: "",
    type: "",
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
      status: "active"
    });
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await ListingAPIClient.get("/listing-categories");
      setCategories(response?.data || []);
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
      const response = await ListingAPIClient.get("/listing-subcategories");
      setSubcategories(response?.data || []);
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
      fetchSubcategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

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
        // Category fields: name, description, type, status
        if (!formData.type) {
          toast.error("Type is required");
          return;
        }
        payload.type = formData.type;
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
        response = await ListingAPIClient.update(
          `/${activeTab === "category" ? "listing-categories" : "listing-subcategories"}/${editingId}`,
          payload
        );
        toast.success(`${activeTab === "category" ? "Category" : "Subcategory"} updated successfully`);
      } else {
        // Create
        response = await ListingAPIClient.create(
          `/${activeTab === "category" ? "listing-categories" : "listing-subcategories"}`,
          payload
        );
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
  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete this ${activeTab}?`)) {
      return;
    }

    try {
      await ListingAPIClient.delete(
        `/${activeTab === "category" ? "listing-categories" : "listing-subcategories"}/${id}`
      );
      toast.success(`${activeTab === "category" ? "Category" : "Subcategory"} deleted successfully`);
      
      // Refresh data
      if (activeTab === "category") {
        await fetchCategories();
      } else {
        await fetchSubcategories();
      }
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error(error?.message || `Failed to delete ${activeTab}`);
    }
  };

  // Handle form change
  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
  ]

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
                  className={`text-14 px-10 fw-500 py-5 rounded-8 ${
                    activeTab === item.value ? "bg-white" : "text-light-1"
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
            className="button bg-blue-1 text-white px-15 fw-400 py-10 rounded-8"
            onClick={() => setShowModal(true)}
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
            <select className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-140 sm:w-full">
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="col-sm-auto">
            <select className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-140 sm:w-full">
              <option value="all">All Types</option>
              <option value="property">Property</option>
              <option value="activity">Activity</option>
              <option value="tour">Tour</option>
              <option value="event">Event</option>
              <option value="flight">Flight</option>
              <option value="ride">Ride</option>
            </select>
          </div>

          <div className="col-sm-auto">
            <select className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-140 sm:w-full">
              <option value="all">Category</option>
            </select>
          </div>
          
          <div className="col-sm-auto ms-auto d-flex">
            <button className="button -md px-15 py-10 fw-400 text-14 bg-white border-light rounded-8 sm:w-full me-2">
              Export Listings
            </button>
            <button className="button -md px-15 py-10 fw-400 text-14 text-white bg-blue-1 rounded-8 sm:w-full">
              View All
            </button>
          </div>
        </div>

        <div className="bg-white rounded-8 border-light py-5 mt-10">
          <div className="overflow-scroll scroll-bar-1">
            <table className="table-3 -border-bottom col-12">
              <thead className="bg-light-2">
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
                      <div className="text-14 text-light-1">Loading...</div>
                    </td>
                  </tr>
                ) : activeTab == "category" ? (
                  categories.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-20">
                        <div className="text-14 text-light-1">No categories found</div>
                      </td>
                    </tr>
                  ) : (
                    categories.map((item, index) => (
                      <tr key={item.id || index}>
                        <td className="align-middle text-12 lh-16 fw-500">
                          {item.name}
                        </td>
                        <td className="align-middle text-12 lh-16 fw-500">
                          {item.type || "-"}
                        </td>
                        <td className="align-middle">
                          <span
                            className={`rounded-100 py-4 px-10 text-center text-12 fw-500 ${
                              item.is_active !== false
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
                          <span 
                            className="text-12 border border-primary text-blue-1 fw-500 rounded-4 px-10 cursor-pointer" 
                            onClick={() => handleEdit(item)}
                          >
                            Edit
                          </span>
                          <span 
                            className="text-12 border border-danger text-red-2 fw-500 rounded-4 px-10 cursor-pointer mx-1"
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </span>
                        </td>
                      </tr>
                    ))
                  )
                ) : (
                  subcategories.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-20">
                        <div className="text-14 text-light-1">No subcategories found</div>
                      </td>
                    </tr>
                  ) : (
                    subcategories.map((item, index) => (
                      <tr key={item.id || index}>
                        <td className="align-middle text-12 lh-16 fw-500">
                          {item.name}
                        </td>
                        <td className="align-middle text-12 lh-16 fw-500">
                          {categories.find(cat => cat.id === item.category_id)?.name || "-"}
                        </td>
                        <td className="align-middle">
                          <span
                            className={`rounded-100 py-4 px-10 text-center text-12 fw-500 ${
                              item.is_active !== false
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
                          <span 
                            className="text-12 border border-primary text-blue-1 fw-500 rounded-4 px-10 cursor-pointer" 
                            onClick={() => handleEdit(item)}
                          >
                            Edit
                          </span>
                          <span 
                            className="text-12 border border-danger text-red-2 fw-500 rounded-4 px-10 cursor-pointer mx-1"
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </span>
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
