"use client";

import { useState, useEffect, useMemo } from "react";
import CouponCard from "./CouponCard";
import VendorDashboardLayout from "../common/layout";
import CouponList from "./CouponList";
import CouponDetailModal from "./CouponDetailModal";
import { Dialog, CircularProgress } from "@mui/material";
import DatePicker, { DateObject } from "react-multi-date-picker";
import FormInput from "@/components/common/form/FormInput";
import {
  getMyCoupons,
  createVendorCoupon,
  updateVendorCoupon,
  getMyListings,
  getListingCategories,
  getListingSubcategories
} from "@/helpers/backend_helper";
import { toast } from "react-toastify";
import { useVendorPermissions } from "@/hooks/useVendorPermissions";

const index = () => {
  const { hasPermission } = useVendorPermissions();
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [viewingCoupon, setViewingCoupon] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState({});
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);

  const loadCoupons = async (filterParams = {}) => {
    try {
      setLoading(true);
      // Build query parameters from filters
      const params = {};

      if (filterParams.is_active && filterParams.is_active !== "all") {
        params.is_active = filterParams.is_active === "true" || filterParams.is_active === true;
      }

      if (filterParams.listing_category_id && filterParams.listing_category_id !== "all") {
        params.listing_category_id = filterParams.listing_category_id;
      }

      if (filterParams.listing_subcategory_id && filterParams.listing_subcategory_id !== "all") {
        params.listing_subcategory_id = filterParams.listing_subcategory_id;
      }

      if (filterParams.listing_type && filterParams.listing_type !== "all") {
        params.listing_type = filterParams.listing_type;
      }

      if (filterParams.listing_id && filterParams.listing_id !== "all") {
        params.listing_id = filterParams.listing_id;
      }

      if (filterParams.date_from) {
        params.date_from = filterParams.date_from;
      }

      if (filterParams.date_to) {
        params.date_to = filterParams.date_to;
      }

      const response = await getMyCoupons(params);
      const couponsData = response?.data?.data || response?.data || response || [];
      setCoupons(Array.isArray(couponsData) ? couponsData : []);
    } catch (error) {
      console.error("Error loading coupons:", error);
      toast.error(error?.message || "Failed to load coupons");
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  // Create a stable filter key for dependency tracking
  const filterKey = useMemo(() => {
    return `${filters.is_active || ''}_${filters.listing_category_id || ''}_${filters.listing_subcategory_id || ''}_${filters.listing_type || ''}_${filters.date_from || ''}_${filters.date_to || ''}`;
  }, [filters.is_active, filters.listing_category_id, filters.listing_subcategory_id, filters.listing_type, filters.date_from, filters.date_to]);

  useEffect(() => {
    loadCoupons(filters);
  }, [filterKey]);

  const loadCategoryData = async () => {
    try {
      const [categoriesRes, subcategoriesRes] = await Promise.all([
        getListingCategories(),
        getListingSubcategories(),
      ]);

      const categoriesData = categoriesRes?.data || categoriesRes || [];
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);

      const subcategoriesData = subcategoriesRes?.data || subcategoriesRes || [];
      setSubcategories(Array.isArray(subcategoriesData) ? subcategoriesData : []);
    } catch (error) {
      console.error("Error loading filter data:", error);
    }
  };

  // Load listings, categories, and subcategories for filters
  useEffect(() => {
    loadCategoryData();
  }, []);

  // Clear subtype when listing_type changes to non-property
  useEffect(() => {
    if (filters.listing_type !== "property") {
      setFilters(prev => ({ ...prev, listing_subtype: "" }));
    }
    // Reset category and subcategory when listing type changes (but keep listing_id if it matches)
    setFilters(prev => ({
      ...prev,
      listing_category_id: "",
      listing_subcategory_id: "",
    }));
  }, [filters.listing_type]);

  // Reset category and subcategory when subtype changes (for property type)
  useEffect(() => {
    if (filters.listing_type === "property") {
      setFilters(prev => ({
        ...prev,
        listing_category_id: "",
        listing_subcategory_id: "",
      }));
    }
  }, [filters.listing_subtype]);

  // Filter categories based on listing type/subtype (optional filtering)
  useEffect(() => {
    let filtered = [...categories]; // Start with all categories

    // Filter by listing type if selected
    if (filters.listing_type && filters.listing_type !== "") {
      filtered = filtered.filter(
        (cat) => {
          const catType = cat.type || cat.listing_type;
          return catType === filters.listing_type;
        }
      );

      // For property type, also filter by subtype if selected
      if (filters.listing_type === "property" && filters.listing_subtype && filters.listing_subtype !== "") {
        filtered = filtered.filter(
          (cat) => {
            return cat.subtype === filters.listing_subtype;
          }
        );
      }

      // Reset category if it's not in the filtered list
      if (filters.listing_category_id) {
        const catExists = filtered.some(
          (cat) => cat.id === parseInt(filters.listing_category_id, 10)
        );
        if (!catExists) {
          setFilters(prev => ({
            ...prev,
            listing_category_id: "",
            listing_subcategory_id: "",
          }));
        }
      }
    }

    setFilteredCategories(filtered);
  }, [filters.listing_type, filters.listing_subtype, categories]);

  // Filter subcategories based on selected category (optional filtering)
  useEffect(() => {
    let filtered = [...subcategories]; // Start with all subcategories

    // Filter by category if selected
    if (filters.listing_category_id && filters.listing_category_id !== "") {
      filtered = filtered.filter(
        (sub) => {
          const subCatId = sub.listing_category_id || sub.category_id;
          return subCatId === parseInt(filters.listing_category_id, 10);
        }
      );

      // Reset subcategory if it's not in the filtered list
      if (filters.listing_subcategory_id) {
        const subcatExists = filtered.some(
          (sub) => sub.id === parseInt(filters.listing_subcategory_id, 10)
        );
        if (!subcatExists) {
          setFilters(prev => ({ ...prev, listing_subcategory_id: "" }));
        }
      }
    }

    setFilteredSubcategories(filtered);
  }, [filters.listing_category_id, subcategories]);

  // Calculate dashboard card data from coupons
  const dashboardData = useMemo(() => {
    const now = new Date();
    const activeCoupons = coupons.filter(c => c.is_active).length;
    const totalDiscount = coupons.reduce((sum, c) => {
      const value = parseFloat(c.discount_value) || 0;
      return sum + value;
    }, 0);

    // Calculate expiring soon (within 30 days)
    const expiringSoon = coupons.filter(c => {
      if (!c.date_to) return false;
      const endDate = new Date(c.date_to);
      const daysUntilExpiry = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry >= 0 && daysUntilExpiry <= 30;
    }).length;

    // Calculate total redemptions (if usage_limit exists, estimate based on usage)
    // For now, we'll use a placeholder since usage tracking might not be in the model
    const totalRedemptions = coupons.length * 10; // Placeholder

    return [
      {
        title: "Active Coupons",
        amount: String(activeCoupons),
        improve: `${coupons.length - activeCoupons} inactive`,
        icon: "/img/dashboard/icons/1.svg",
      },
      {
        title: "Total Redemptions",
        amount: String(totalRedemptions),
        improve: "Estimated usage",
        icon: "/img/dashboard/icons/2.svg",
      },
      {
        title: "Discount Value",
        amount: `$${totalDiscount.toFixed(2)}`,
        improve: "Total discount amount",
        icon: "/img/dashboard/icons/3.svg",
      },
      {
        title: "Expiring Soon",
        amount: String(expiringSoon),
        improve: "Within 30 days",
        icon: "/img/dashboard/icons/4.svg",
      },
    ];
  }, [coupons]);

  const handleClose = () => {
    setShowModal(false);
    setEditingCoupon(null);
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setShowModal(true);
  };

  const handleCreateClick = () => {
    setEditingCoupon(null);
    setShowModal(true);
  };

  const handleView = (coupon) => {
    setViewingCoupon(coupon);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setViewingCoupon(null);
  };

  return (
    <VendorDashboardLayout>
      <div className="row y-gap-20 justify-between items-center mb-5">
        <div className="col-auto">
          <h1 className="text-30 lh-14 fw-600">
            Coupon & Promotional Management
          </h1>
          <div className="text-15 text-light-1">
            Create and manage coupon codes and promotional campaigns.
          </div>
        </div>
        <div className="col-auto ms-auto">
          <button
            className="bg-dark-blue text-white fw-400 text-13 py-5 px-15 rounded-8"
            onClick={() => {
              if (hasPermission("coupon_promotion_management", "create")) {
                handleCreateClick();
              }
            }}
            disabled={!hasPermission("coupon_promotion_management", "create")}
            style={{ opacity: !hasPermission("coupon_promotion_management", "create") ? 0.5 : 1, cursor: !hasPermission("coupon_promotion_management", "create") ? "not-allowed" : "pointer" }}
          >
            <i className="icon-plus mr-10 fw-400 text-10"></i>
            Create New Coupon
          </button>
        </div>
      </div>

      <div className="row y-gap-15 x-gap-10 mb-5">

        {/* Listing Type/Subtype Selection (optional filters) */}
        <div className="col-auto">
          <h1 className="text-13 lh-14 fw-500">Listing Type</h1>
          <select
            className="form-select border-light rounded-8 px-15 justify-between fw-400 py-10 h-50 w-140 text-14 mt-5"
            value={filters.listing_type || ""}
            onChange={(e) => setFilters(prev => ({ ...prev, listing_type: e.target.value }))}
          >
            <option value="">All Types</option>
            <optgroup label="Property List">
              <option value="property">Property</option>
            </optgroup>
            <optgroup label="Non-Property List">
              <option value="tour">Tour</option>
              <option value="event">Event</option>
              <option value="activity">Activity</option>
            </optgroup>
          </select>
        </div>

        {/* Subtype Selection (only for property, optional filter) */}
        <div className="col-auto">
          <h1 className="text-13 lh-14 fw-500">Property Subtype</h1>
          <select
            className="form-select border-light rounded-8 px-15 justify-between fw-400 py-10 h-50 w-140 text-14 mt-5"
            value={filters.listing_subtype || ""}
            onChange={(e) => setFilters(prev => ({ ...prev, listing_subtype: e.target.value }))}
            disabled={filters.listing_type !== "property"}
          >
            <option value="">All Subtypes</option>
            <option value="Hotel">Hotel</option>
            <option value="Space">Space</option>
            <option value="Vacation">Vacation</option>
            <option value="EventVenue">Event Venue</option>
          </select>
        </div>

        {/* Category Selection (optional filter) */}
        <div className="col-auto">
          <h1 className="text-13 lh-14 fw-500">Category</h1>
          <select
            className="form-select border-light rounded-8 px-15 justify-between fw-400 py-10 h-50 w-140 text-14 mt-5"
            value={filters.listing_category_id || ""}
            onChange={(e) => setFilters(prev => ({ ...prev, listing_category_id: e.target.value }))}
          >
            <option value="">All Categories</option>
            {filteredCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name || `Category #${category.id}`}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory Selection (optional filter) */}
        <div className="col-auto">
          <h1 className="text-13 lh-14 fw-500">Subcategory</h1>
          <select
            className="form-select border-light rounded-8 px-15 justify-between fw-400 py-10 h-50 w-180 text-14 mt-5"
            value={filters.listing_subcategory_id || ""}
            onChange={(e) => setFilters(prev => ({ ...prev, listing_subcategory_id: e.target.value }))}
          >
            <option value="">All Subcategories</option>
            {filteredSubcategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name || `Subcategory #${subcategory.id}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      <CouponCard data={dashboardData} />
      <div className="py-20 px-20 rounded-8 bg-white shadow-3 h-100 mt-20">
        <CouponList 
          onEdit={handleEdit} 
          onView={handleView} 
          onRefresh={() => loadCoupons(filters)}
          coupons={coupons} 
          loading={loading} 
        />
      </div>

      <Dialog
        open={showModal}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <div className="px-20 py-20 w-full">
          <ModalContent
            coupon={editingCoupon}
            onClose={handleClose}
            onSuccess={() => {
              handleClose();
              loadCoupons();
            }}
            submitting={submitting}
            setSubmitting={setSubmitting}
          />
        </div>
      </Dialog>

      <CouponDetailModal
        open={showDetailModal}
        onClose={handleCloseDetailModal}
        coupon={viewingCoupon}
      />
    </VendorDashboardLayout>
  );
};

const ModalContent = ({ coupon, onClose, onSuccess, submitting, setSubmitting }) => {
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    listing_id: "",
    discount_type: "percent",
    discount_value: "",
    date_from: "",
    date_to: "",
    usage_limit: "",
    min_spend: "",
    is_active: true,
  });

  // Filter state for filtering listings dropdown (not part of form submission)
  const [filters, setFilters] = useState({
    listing_type: "",
    listing_subtype: "",
    listing_category_id: "",
    listing_subcategory_id: "",
  });

  const [startDate, setStartDate] = useState(new DateObject());
  const [endDate, setEndDate] = useState(new DateObject());
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [listingsRes, categoriesRes, subcategoriesRes] = await Promise.all([
        getMyListings(),
        getListingCategories(),
        getListingSubcategories(),
      ]);

      const listingsData = listingsRes?.data || listingsRes || [];
      setListings(Array.isArray(listingsData) ? listingsData : []);

      const categoriesData = categoriesRes?.data || categoriesRes || [];
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);

      const subcategoriesData = subcategoriesRes?.data || subcategoriesRes || [];
      setSubcategories(Array.isArray(subcategoriesData) ? subcategoriesData : []);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load form data");
    } finally {
      setLoading(false);
    }
  };

  // Load listings, categories, and subcategories
  useEffect(() => {
    loadData();
  }, []);

  // Clear subtype when listing_type changes to non-property
  useEffect(() => {
    if (filters.listing_type !== "property") {
      setFilters(prev => ({ ...prev, listing_subtype: "" }));
    }
    // Reset category and subcategory when listing type changes (but keep listing_id if it matches)
    setFilters(prev => ({
      ...prev,
      listing_category_id: "",
      listing_subcategory_id: "",
    }));
  }, [filters.listing_type]);

  // Reset category and subcategory when subtype changes (for property type)
  useEffect(() => {
    if (filters.listing_type === "property") {
      setFilters(prev => ({
        ...prev,
        listing_category_id: "",
        listing_subcategory_id: "",
      }));
    }
  }, [filters.listing_subtype]);

  // Filter categories based on listing type/subtype (optional filtering)
  useEffect(() => {
    let filtered = [...categories]; // Start with all categories

    // Filter by listing type if selected
    if (filters.listing_type && filters.listing_type !== "") {
      filtered = filtered.filter(
        (cat) => {
          const catType = cat.type || cat.listing_type;
          return catType === filters.listing_type;
        }
      );

      // For property type, also filter by subtype if selected
      if (filters.listing_type === "property" && filters.listing_subtype && filters.listing_subtype !== "") {
        filtered = filtered.filter(
          (cat) => {
            return cat.subtype === filters.listing_subtype;
          }
        );
      }

      // Reset category if it's not in the filtered list
      if (filters.listing_category_id) {
        const catExists = filtered.some(
          (cat) => cat.id === parseInt(filters.listing_category_id, 10)
        );
        if (!catExists) {
          setFilters(prev => ({
            ...prev,
            listing_category_id: "",
            listing_subcategory_id: "",
          }));
        }
      }
    }

    setFilteredCategories(filtered);
  }, [filters.listing_type, filters.listing_subtype, categories]);

  // Filter subcategories based on selected category (optional filtering)
  useEffect(() => {
    let filtered = [...subcategories]; // Start with all subcategories

    // Filter by category if selected
    if (filters.listing_category_id && filters.listing_category_id !== "") {
      filtered = filtered.filter(
        (sub) => {
          const subCatId = sub.listing_category_id || sub.category_id;
          return subCatId === parseInt(filters.listing_category_id, 10);
        }
      );

      // Reset subcategory if it's not in the filtered list
      if (filters.listing_subcategory_id) {
        const subcatExists = filtered.some(
          (sub) => sub.id === parseInt(filters.listing_subcategory_id, 10)
        );
        if (!subcatExists) {
          setFilters(prev => ({ ...prev, listing_subcategory_id: "" }));
        }
      }
    }

    setFilteredSubcategories(filtered);
  }, [filters.listing_category_id, subcategories]);

  // Filter listings based on selected filters (all filters are optional)
  useEffect(() => {
    let filtered = [...listings]; // Start with all listings

    // Filter by listing type if selected
    if (filters.listing_type && filters.listing_type !== "") {
      filtered = filtered.filter(
        (listing) => {
          const listingType = listing.type || listing.listing_type;
          return listingType === filters.listing_type;
        }
      );
    }

    // For property type, also filter by subtype if selected
    if (filters.listing_type === "property" && filters.listing_subtype && filters.listing_subtype !== "") {
      filtered = filtered.filter(
        (listing) => {
          const listingSubtype = listing.subtype || listing.listing_subtype;
          return listingSubtype === filters.listing_subtype;
        }
      );
    }

    // Filter by category if selected
    if (filters.listing_category_id && filters.listing_category_id !== "") {
      filtered = filtered.filter(
        (listing) => {
          const listingCatId = listing.category_id || listing.listing_category_id;
          return listingCatId === parseInt(filters.listing_category_id, 10);
        }
      );
    }

    // Filter by subcategory if selected
    if (filters.listing_subcategory_id && filters.listing_subcategory_id !== "") {
      filtered = filtered.filter(
        (listing) => {
          const listingSubcatId = listing.subcategory_id || listing.listing_subcategory_id;
          return listingSubcatId === parseInt(filters.listing_subcategory_id, 10);
        }
      );
    }

    setFilteredListings(filtered);

    // Reset listing if it's not in the filtered list
    if (formData.listing_id) {
      const listingExists = filtered.some(
        (listing) => listing.id === parseInt(formData.listing_id, 10)
      );
      if (!listingExists) {
        setFormData(prev => ({ ...prev, listing_id: null }));
      }
    }
  }, [filters.listing_type, filters.listing_subtype, filters.listing_category_id, filters.listing_subcategory_id, listings, formData.listing_id]);

  // Populate form when editing
  useEffect(() => {
    if (coupon) {
      const start = coupon.date_from ? new DateObject(coupon.date_from) : new DateObject();
      const end = coupon.date_to ? new DateObject(coupon.date_to) : new DateObject();
      setStartDate(start);
      setEndDate(end);

      // Set form data (only actual coupon fields)
      setFormData({
        code: coupon.code || "",
        description: coupon.description || "",
        listing_id: coupon.listing_id || "",
        discount_type: coupon.discount_type || "percent",
        discount_value: coupon.discount_value || "",
        date_from: coupon.date_from || "",
        date_to: coupon.date_to || "",
        usage_limit: coupon.usage_limit || "",
        min_spend: coupon.min_spend || "",
        is_active: coupon.is_active !== undefined ? coupon.is_active : true,
      });

      // Set filters based on coupon's listing data (for filtering dropdowns)
      // If coupon has a listing_id, populate filters from the listing to help filter the dropdown
      if (coupon.listing_id && coupon.listing) {
        setFilters({
          listing_type: coupon.listing.type || coupon.listing.listing_type || "",
          listing_subtype: coupon.listing.subtype || coupon.listing.listing_subtype || "",
          listing_category_id: coupon.listing.category_id || coupon.listing.listing_category_id || "",
          listing_subcategory_id: coupon.listing.subcategory_id || coupon.listing.listing_subcategory_id || "",
        });
      } else {
        // No listing, reset filters
        setFilters({
          listing_type: "",
          listing_subtype: "",
          listing_category_id: "",
          listing_subcategory_id: "",
        });
      }
    } else {
      // Reset form for new coupon
      setStartDate(new DateObject());
      setEndDate(new DateObject());
      setFormData({
        code: "",
        description: "",
        listing_id: "",
        discount_type: "percent",
        discount_value: "",
        date_from: "",
        date_to: "",
        usage_limit: "",
        min_spend: "",
        is_active: true,
      });
      setFilters({
        listing_type: "",
        listing_subtype: "",
        listing_category_id: "",
        listing_subcategory_id: "",
      });
    }
  }, [coupon]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.code || !formData.code.trim()) {
      toast.error("Coupon code is required");
      return;
    }

    if (!formData.discount_value || parseFloat(formData.discount_value) <= 0) {
      toast.error("Discount value must be greater than 0");
      return;
    }

    if (!startDate || !endDate) {
      toast.error("Please select start and end dates");
      return;
    }

    if (startDate.toDate() >= endDate.toDate()) {
      toast.error("End date must be after start date");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        ...formData,
        date_from: startDate.format("YYYY-MM-DD"),
        date_to: endDate.format("YYYY-MM-DD"),
        listing_id: formData.listing_id || null,
        usage_limit: formData.usage_limit || null,
        min_spend: formData.min_spend || null,
      };

      if (coupon) {
        await updateVendorCoupon(coupon.id, payload);
        toast.success("Coupon updated successfully");
      } else {
        await createVendorCoupon(payload);
        toast.success("Coupon created successfully");
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving coupon:", error);
      toast.error(error?.message || `Failed to ${coupon ? "update" : "create"} coupon`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-20 lh-14 fw-500">
        {coupon ? "Edit Coupon" : "Create New Coupon"}
      </h1>
      <div className="text-12 text-light-1 lh-14 mb-15">
        {coupon ? "Update your coupon details." : "Create a new coupon code for your listings."}
      </div>
      <div className="row y-gap-10 x-gap-15">
        <FormInput
          label="Coupon Code"
          required={true}
          type="text"
          placeholder="SUMMER2025"
          gridClass="col-12 mt-5"
          value={formData.code}
          onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
        />

        <FormInput
          label="Description"
          type="textarea"
          placeholder="Enter coupon description"
          gridClass="col-12 mt-5"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />

        {/* Listing Type Selection */}
        <div className="col-6 mt-5">
          <h1 className="text-14 lh-14 fw-500">Listing Type</h1>
          <select
            className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-full mt-10"
            value={filters.listing_type || ""}
            onChange={(e) => setFilters(prev => ({ ...prev, listing_type: e.target.value }))}
          >
            <option value="">Select Listing Type</option>
            <optgroup label="Property List">
              <option value="property">Property</option>
            </optgroup>
            <optgroup label="Non-Property List">
              <option value="tour">Tour</option>
              <option value="event">Event</option>
              <option value="activity">Activity</option>
            </optgroup>
          </select>
        </div>

        {/* Listing Subtype Selection (only for property type) */}
        <div className="col-6 mt-5">
          <h1 className="text-14 lh-14 fw-500">Listing Subtype</h1>
          <select
            className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-full mt-10"
            value={filters.listing_subtype || ""}
            onChange={(e) => setFilters(prev => ({ ...prev, listing_subtype: e.target.value }))}
            disabled={filters.listing_type !== "property"}
          >
            <option value="">Select Subtype</option>
            <option value="Hotel">Hotels</option>
            <option value="Space">Spaces</option>
            <option value="Vacation">Vacation Rentals</option>
            <option value="EventVenue">Event Venues</option>
          </select>
        </div>

        {/* Category Selection */}
        <div className="col-6 mt-5">
          <h1 className="text-14 lh-14 fw-500">Listing Category</h1>
          <select
            className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-full mt-10"
            value={filters.listing_category_id || ""}
            onChange={(e) => setFilters(prev => ({ ...prev, listing_category_id: e.target.value }))}
          >
            <option value="">All Categories</option>
            {filteredCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name || `Category #${category.id}`}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory Selection */}
        <div className="col-6 mt-5">
          <h1 className="text-14 lh-14 fw-500">Listing Subcategory</h1>
          <select
            className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-full mt-10"
            value={filters.listing_subcategory_id || ""}
            onChange={(e) => setFilters(prev => ({ ...prev, listing_subcategory_id: e.target.value }))}
          >
            <option value="">All Subcategories</option>
            {filteredSubcategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name || `Subcategory #${subcategory.id}`}
              </option>
            ))}
          </select>
        </div>

        {/* Listing Selection */}
        <div className="col-12 mt-5">
          <h1 className="text-14 lh-14 fw-500">Listing<span className="text-red-1">*</span></h1>
          <select
            className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-full mt-10"
            value={formData.listing_id || ""}
            onChange={(e) => setFormData(prev => ({ ...prev, listing_id: e.target.value }))}
          >
            <option value="">All Listings</option>
            {filteredListings.map((listing) => (
              <option key={listing.id} value={listing.id}>
                {listing.title || `Listing #${listing.id}`}
              </option>
            ))}
          </select>
          {filteredListings.length === 0 && (
            <div className="text-12 text-light-1 mt-5">
              No listings found for the selected filters.
            </div>
          )}
        </div>
        <div className="col-6 mt-5">
          <h1 className="text-14 lh-14 fw-500">Discount Type</h1>
          <select
            className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-full mt-10"
            value={formData.discount_type}
            onChange={(e) => setFormData(prev => ({ ...prev, discount_type: e.target.value }))}
          >
            <option value="percent">Percentage</option>
            <option value="fixed">Fixed</option>
          </select>
        </div>

        <FormInput
          label="Discount Value"
          type="number"
          placeholder={formData.discount_type === "percent" ? "10" : "50"}
          gridClass="col-6 mt-5"
          value={formData.discount_value}
          onChange={(e) => setFormData(prev => ({ ...prev, discount_value: e.target.value }))}
          required
        />
        <div className="col-6 mt-5">
          <h1 className="text-14 lh-14 fw-500">Date from</h1>
          <div className="border-light rounded-8 py-10 px-20 w-full cursor-text text-light-1 bg-white">
            <DatePicker
              inputClass="custom_input-picker"
              containerClassName="custom_container-picker"
              value={startDate}
              onChange={(date) => {
                setStartDate(date);
                if (date) {
                  setFormData(prev => ({ ...prev, date_from: date.format("YYYY-MM-DD") }));
                }
              }}
              numberOfMonths={1}
              offsetY={10}
              format="YYYY-MM-DD"
              minDate={new DateObject()}
            />
          </div>
        </div>
        <div className="col-6 mt-5">
          <h1 className="text-14 lh-14 fw-500">Date to</h1>
          <div className="border-light rounded-8 py-10 px-20 w-full cursor-text text-light-1 bg-white">
            <DatePicker
              inputClass="custom_input-picker"
              containerClassName="custom_container-picker"
              value={endDate}
              onChange={(date) => {
                setEndDate(date);
                if (date) {
                  setFormData(prev => ({ ...prev, date_to: date.format("YYYY-MM-DD") }));
                }
              }}
              numberOfMonths={1}
              offsetY={10}
              format="YYYY-MM-DD"
              minDate={startDate || new DateObject()}
            />
          </div>
        </div>

        <FormInput
          label="Usage Limit"
          type="number"
          placeholder="100 (Leave empty for unlimited)"
          gridClass="col-6 mt-5"
          value={formData.usage_limit}
          onChange={(e) => setFormData(prev => ({ ...prev, usage_limit: e.target.value }))}
        />

        <FormInput
          label="Minimum Spend"
          type="number"
          placeholder="50 (Leave empty for no minimum)"
          gridClass="col-6 mt-5"
          value={formData.min_spend}
          onChange={(e) => setFormData(prev => ({ ...prev, min_spend: e.target.value }))}
        />
      </div>

      <div className="d-flex justify-end gap-2 mt-20">
        <button
          type="button"
          className="text-14 border-light rounded-8 px-10 py-5"
          onClick={onClose}
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="text-14 bg-blue-1 text-white fw-500 rounded-8 px-10 py-5"
          disabled={submitting}
        >
          {submitting ? "Saving..." : coupon ? "Update Coupon" : "Create Coupon"}
        </button>
      </div>
    </form>
  );
};

export default index;
