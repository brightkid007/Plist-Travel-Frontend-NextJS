"use client";

import VendorDashboardLayout from "../common/layout";
import { useState, useEffect } from "react";
import { Dialog, Menu, MenuItem, CircularProgress } from "@mui/material";
import { MoreVertical, Mail, UserPlus, UserX } from "lucide-react";
import FormInput from "@/components/common/form/FormInput";
import { useVendorPermissions } from "@/hooks/useVendorPermissions";
import { toast } from "react-toastify";
import {
  getAdminUsers,
  register,
  searchCustomers,
  associateCustomerWithVendor,
  removeCustomerAssociation,
  isAuthenticated
} from "@/helpers/backend_helper";
import ConfirmationModal from "@/components/common/ConfirmationModal";

const index = () => {
  const { hasPermission } = useVendorPermissions();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [modalType, setModalType] = useState("add"); // "invite" or "add"
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedInternalCustomer, setSelectedInternalCustomer] = useState(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    is_active: true,
    role: "customer",
    business_name: "",
    business_phone: "",
    country: ""
  });

  // Load customers
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        if (!isAuthenticated()) {
          return;
        }

        setLoading(true);
        const usersData = await getAdminUsers({ role: "customer", includeDisabled: true });
        const mappedCustomers = (usersData?.data?.data || usersData?.data || []).map(mapCustomerData).filter(Boolean);
        setCustomers(mappedCustomers);
      } catch (err) {
        console.error("Failed to load customers:", err);
        toast.error(err?.message || "Failed to load customers");
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  // Helper function to map backend customer to frontend format
  const mapCustomerData = (customer) => {
    if (!customer) return null;
    const profile = customer.profile || {};
    return {
      id: customer.id,
      email: customer.email,
      role: customer.role,
      is_active: customer.is_active,
      disabledAt: customer.disabledAt,
      createdAt: customer.createdAt || customer.created_at,
      name: `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || customer.email,
      first_name: profile.first_name || "",
      last_name: profile.last_name || "",
      phone: profile.phone || "",
      avatar_url: profile.avatar_url,
      status: customer.disabledAt ? "Inactive" : (customer.is_active ? "Active" : "Inactive"),
      business_name: profile.business_name || "",
      business_phone: profile.business_phone || "",
      country: profile.country || "",
    };
  };

  const handleClose = () => {
    setShowModal(false);
    setModalType("add");
    setSearchTerm("");
    setSearchResults([]);
    setSelectedInternalCustomer(null);
    setFormData({
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      phone: "",
      is_active: true,
      role: "customer",
      business_name: "",
      business_phone: "",
      country: ""
    });
  };

  const handleCreateCustomer = async () => {
    try {
      if (modalType === "add") {
        // Add internal customer
        if (!selectedInternalCustomer) {
          toast.error("Please select a customer");
          return;
        }

        await associateCustomerWithVendor(selectedInternalCustomer.id);

        // Reload customers to get updated list
        const usersData = await getAdminUsers({ role: "customer", includeDisabled: true });
        const mappedCustomers = (usersData?.data?.data || usersData?.data || []).map(mapCustomerData).filter(Boolean);
        setCustomers(mappedCustomers);

        toast.success("Customer added successfully");
        handleClose();
        return;
      }

      // Invite external user
      if (!formData.email || !formData.first_name || !formData.last_name) {
        toast.error("Please fill in all required fields");
        return;
      }

      const customerPayload = {
        email: formData.email,
        password: formData.password || `Plist${Math.random().toString(36).slice(-8)}!`, // Generate random password if not provided
        role: "customer",
        is_active: formData.is_active,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone || "",
        business_name: formData.business_name || "",
        business_phone: formData.business_phone || "",
        country: formData.country || "",
      };

      const response = await register(customerPayload);
      const newCustomer = mapCustomerData(response?.data || response);
      if (newCustomer) {
        setCustomers(prev => [...prev, newCustomer]);
        toast.success("Customer invited successfully");
        if (!formData.password) {
          toast.info("An invitation email will be sent to the customer.");
        }
      }
      handleClose();
    } catch (err) {
      console.error("Failed to create/add customer:", err);
      toast.error(err?.message || "Failed to create/add customer");
    }
  };

  const handleSearchCustomers = async (searchValue) => {
    setSearchTerm(searchValue);
    if (!searchValue || searchValue.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      const response = await searchCustomers(searchValue);
      const results = response?.data?.data || response?.data || [];
      setSearchResults(results);
    } catch (err) {
      console.error("Failed to search customers:", err);
      toast.error(err?.message || "Failed to search customers");
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleDeleteCustomerClick = (customerId, customerName) => {
    setCustomerToDelete({ id: customerId, name: customerName });
    setDeleteModalOpen(true);
    setMenuAnchor({ [customerId]: null });
  };

  const handleDeleteCustomerConfirm = async () => {
    if (!customerToDelete) return;

    // Check permission
    if (!hasPermission("user_management", "delete")) {
      toast.error("You don't have permission to remove customer associations");
      setDeleteModalOpen(false);
      setCustomerToDelete(null);
      return;
    }

    try {
      setDeleting(true);
      await removeCustomerAssociation(customerToDelete.id);
      // Remove customer from list (association deleted, customer still exists in system)
      setCustomers(prev => prev.filter(customer => customer.id !== customerToDelete.id));
      toast.success("Customer association removed successfully");
      setDeleteModalOpen(false);
      setCustomerToDelete(null);
    } catch (err) {
      console.error("Failed to remove customer association:", err);
      toast.error(err?.message || "Failed to remove customer association");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCustomerCancel = () => {
    setDeleteModalOpen(false);
    setCustomerToDelete(null);
  };


  const handleMenuOpen = (event, customerId) => {
    setMenuAnchor({ [customerId]: event.currentTarget });
  };

  const handleMenuClose = (customerId) => {
    setMenuAnchor({ [customerId]: null });
  };

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <VendorDashboardLayout>
      <div className="row y-gap-20 justify-between items-center mb-5">
        <div className="col-auto">
          <h1 className="text-30 lh-14 fw-600">User Management</h1>
          <div className="text-15 text-light-1">
            Manage customers and users associated with your business. Only invited customers can book your listings.
          </div>
        </div>
        <div className="col-auto ms-auto">
          <button
            className="button -md bg-blue-1 px-15 py-10 fw-400 text-14 text-white rounded-8"
            onClick={() => {
              if (hasPermission("user_management", "create")) {
                setShowModal(true);
              }
            }}
            disabled={!hasPermission("user_management", "create")}
            style={{ opacity: !hasPermission("user_management", "create") ? 0.5 : 1, cursor: !hasPermission("user_management", "create") ? "not-allowed" : "pointer" }}
          >
            <UserPlus size={16} className="mr-5" />
            Add Customer
          </button>
        </div>
      </div>

      <div className="bg-white border-light rounded-8 shadow-3">
        <div className="px-15 py-15">
          <div className="overflow-scroll scroll-bar-1">
            <table className="table-2 col-12 text-14">
              <thead className="text-nowrap">
                <tr className="text-light-1 fw-600">
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Business</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-20">
                      <div className="d-inline-flex items-center justify-center gap-2 text-16 text-light-1">
                        <CircularProgress size={20} thickness={5} />
                        <span>Loading customers...</span>
                      </div>
                    </td>
                  </tr>
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-20">
                      <div className="d-inline-flex items-center justify-center gap-2 text-16 text-light-1">
                        <UserX size={18} />
                        <span>No customers found</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr key={customer.id}>
                      <td className="align-middle">
                        <div className="d-flex items-center gap-2">
                          <div className="size-30 rounded-full text-light-1 bg-light-2 flex-center fw-500">
                            {customer.avatar_url ? (
                              <img src={customer.avatar_url} alt={customer.name} className="size-30 rounded-full" />
                            ) : (
                              getInitials(customer.name)
                            )}
                          </div>
                          <div>
                            <div className="d-flex items-center gap-1 text-14">
                              {customer.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="align-middle">
                        <div className="d-flex items-center gap-1 text-12">
                          <Mail size={14} /> {customer.email}
                        </div>
                      </td>
                      <td className="align-middle text-12">{customer.phone || "-"}</td>
                      <td className="align-middle text-12">{customer.business_name || "-"}</td>
                      <td className="align-middle">
                        <span
                          className={`rounded-100 py-4 px-10 text-center text-12 fw-500 ${customer.status === "Active"
                              ? "bg-green-1 text-green-2"
                              : "bg-light-2 text-dark-1"
                            }`}
                        >
                          {customer.status}
                        </span>
                      </td>
                      <td className="align-middle">
                        <div className="d-flex items-center gap-1 text-12 lh-16 fw-500">
                          {customer.createdAt ? new Date(customer.createdAt).toLocaleString() : "N/A"}
                        </div>
                      </td>
                      <td className="align-middle">
                        <div className="position-relative">
                          <button
                            className="border-0 bg-transparent cursor-pointer px-5 py-5"
                            onClick={(e) => handleMenuOpen(e, customer.id)}
                          >
                            <MoreVertical size={16} />
                          </button>
                          <Menu
                            anchorEl={menuAnchor[customer.id]}
                            open={Boolean(menuAnchor[customer.id])}
                            onClose={() => handleMenuClose(customer.id)}
                          >
                            <MenuItem
                              onClick={() => {
                                if (hasPermission("user_management", "delete")) {
                                  handleDeleteCustomerClick(customer.id, customer.name);
                                }
                              }}
                              className="text-red-2"
                              disabled={!hasPermission("user_management", "delete")}
                            >
                              Remove
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

      {/* Create Customer Modal */}
      <Dialog
        open={showModal}
        onClose={handleClose}
        aria-labelledby="create-customer-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <div className="px-20 py-20">
          <h1 className="text-20 lh-14 fw-500 mb-15">Add Customer</h1>

          {/* Tabs */}
          <div className="d-flex gap-2 mb-20 border-bottom-light pb-10">
            {/* <button
              className={`text-14 fw-500 px-15 py-8 rounded-8 ${
                modalType === "invite"
                  ? "bg-blue-1 text-white"
                  : "bg-light-2 text-dark-1"
              }`}
              onClick={() => {
                setModalType("invite");
                setSearchTerm("");
                setSearchResults([]);
                setSelectedInternalCustomer(null);
              }}
            >
              Invite External User
            </button> */}
            <button
              className={`text-14 fw-500 px-15 py-8 rounded-8 ${modalType === "add"
                  ? "bg-blue-1 text-white"
                  : "bg-light-2 text-dark-1"
                }`}
              onClick={() => {
                setModalType("add");
                setFormData({
                  email: "",
                  password: "",
                  first_name: "",
                  last_name: "",
                  phone: "",
                  is_active: true,
                  role: "customer",
                  business_name: "",
                  business_phone: "",
                  country: ""
                });
              }}
            >
              Add Internal Customer
            </button>
          </div>

          {modalType === "invite" ? (
            <ModalContent
              formData={formData}
              setFormData={setFormData}
              title=""
              description="Invite a new customer by creating their account. They will receive an invitation email."
              isInvite={true}
            />
          ) : (
            <AddInternalCustomerContent
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              searchResults={searchResults}
              searching={searching}
              selectedInternalCustomer={selectedInternalCustomer}
              setSelectedInternalCustomer={setSelectedInternalCustomer}
              onSearch={handleSearchCustomers}
            />
          )}

          <div className="d-flex justify-end gap-2 mt-20">
            <button
              className="text-14 border-light rounded-8 px-15 py-8"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              className="text-14 bg-blue-1 text-white fw-500 rounded-8 px-15 py-8"
              onClick={handleCreateCustomer}
              disabled={!hasPermission("user_management", "create") || (modalType === "add" && !selectedInternalCustomer)}
            >
              {modalType === "add" ? "Add Customer" : (formData.password ? "Create Customer" : "Invite Customer")}
            </button>
          </div>
        </div>
      </Dialog>

      <ConfirmationModal
        open={deleteModalOpen}
        onClose={handleDeleteCustomerCancel}
        onConfirm={handleDeleteCustomerConfirm}
        title="Remove Customer Association"
        message={`Are you sure you want to remove the association with "${customerToDelete?.name || customerToDelete?.id}"? This will remove them from your customer list, but the customer account will remain in the system.`}
        itemName={customerToDelete?.name || `Customer #${customerToDelete?.id}`}
        loading={deleting}
      />
    </VendorDashboardLayout>
  );
};

const AddInternalCustomerContent = ({ searchTerm, setSearchTerm, searchResults, searching, selectedInternalCustomer, setSelectedInternalCustomer, onSearch }) => {
  return (
    <div className="row x-gap-10 y-gap-10 items-center">
      <div className="col-12">
        <div className="text-12 text-light-1 lh-14 mb-15">
          Search for existing customers in the system to add them to your customer list.
        </div>

        <FormInput
          label="Search Customers"
          type="text"
          placeholder="Search by name or email (minimum 2 characters)"
          gridClass="col-12 mt-5"
          value={searchTerm}
          onChange={(e) => {
            const value = e.target.value;
            setSearchTerm(value);
            onSearch(value);
          }}
        />

        {searching && (
          <div className="col-12 mt-10 text-center">
            <CircularProgress size={20} thickness={5} />
            <span className="text-12 text-light-1 ml-10">Searching...</span>
          </div>
        )}

        {!searching && searchTerm.length >= 2 && searchResults.length === 0 && (
          <div className="col-12 mt-10 text-center text-12 text-light-1">
            No customers found matching your search.
          </div>
        )}

        {!searching && searchResults.length > 0 && (
          <div className="col-12 mt-10">
            <div className="text-12 fw-500 mb-5">Select a customer:</div>
            <div className="border-light rounded-8 max-h-300 overflow-y-auto">
              {searchResults.map((customer) => (
                <div
                  key={customer.id}
                  className={`px-15 py-10 cursor-pointer border-bottom-light ${selectedInternalCustomer?.id === customer.id
                      ? "bg-blue-1 bg-opacity-10"
                      : "hover:bg-light-2"
                    }`}
                  onClick={() => setSelectedInternalCustomer(customer)}
                >
                  <div className="d-flex items-center justify-between">
                    <div>
                      <div className="text-14 fw-500">{customer.name}</div>
                      <div className="text-12 text-light-1">{customer.email}</div>
                      {customer.business_name && (
                        <div className="text-12 text-light-1">{customer.business_name}</div>
                      )}
                    </div>
                    {selectedInternalCustomer?.id === customer.id && (
                      <span className="material-symbols-outlined text-blue-1">check_circle</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedInternalCustomer && (
          <div className="col-12 mt-10">
            <div className="text-12 text-light-1 bg-green-1 bg-opacity-10 px-10 py-8 rounded-8">
              <strong>Selected:</strong> {selectedInternalCustomer.name} ({selectedInternalCustomer.email})
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ModalContent = ({ formData, setFormData, title, description, isEdit = false, isInvite = false }) => {
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="row x-gap-10 y-gap-10 items-center">
      {title && <h1 className="text-20 lh-14 fw-500">{title}</h1>}
      {description && (
        <div className="text-12 text-light-1 lh-14 mb-15">
          {description}
        </div>
      )}

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
        disabled={isEdit}
      />

      <FormInput
        label={isInvite && !formData.password ? "Password (Optional - Leave blank to send invitation)" : "Password"}
        type="password"
        placeholder={isInvite && !formData.password ? "Leave blank to send invitation email" : "Enter Password"}
        gridClass="col-12 mt-5"
        value={formData.password}
        onChange={(e) => handleChange("password", e.target.value)}
        required={!isInvite}
      />

      {isInvite && !formData.password && (
        <div className="col-12 mt-5">
          <div className="text-12 text-light-1 bg-blue-1 bg-opacity-10 px-10 py-8 rounded-8">
            <strong>Note:</strong> If password is left blank, an invitation email will be sent to the customer with instructions to set their password.
          </div>
        </div>
      )}

      <FormInput
        label="Phone"
        type="text"
        placeholder="Enter Phone Number"
        gridClass="col-12 mt-5"
        value={formData.phone}
        onChange={(e) => handleChange("phone", e.target.value)}
      />

      <FormInput
        label="Business Name"
        type="text"
        placeholder="Enter Business Name"
        gridClass="col-12 mt-5"
        value={formData.business_name}
        onChange={(e) => handleChange("business_name", e.target.value)}
      />

      <FormInput
        label="Business Phone"
        type="text"
        placeholder="Enter Business Phone"
        gridClass="col-12 mt-5"
        value={formData.business_phone}
        onChange={(e) => handleChange("business_phone", e.target.value)}
      />

      <FormInput
        label="Country"
        type="text"
        placeholder="Enter Country"
        gridClass="col-12 mt-5"
        value={formData.country}
        onChange={(e) => handleChange("country", e.target.value)}
      />

      {isEdit && (
        <FormInput
          label="Status"
          type="select"
          placeholder="Select Status"
          gridClass="col-12 mt-5"
          options={[
            { label: "Active", value: true },
            { label: "Inactive", value: false },
          ]}
          value={formData.is_active ? "true" : "false"}
          onChange={(e) => handleChange("is_active", e.target.value === "true")}
        />
      )}
    </div>
  );
};

export default index;
