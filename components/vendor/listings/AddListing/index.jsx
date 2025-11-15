"use client";

import svgIcon from "@/components/data/svgIcon";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import VendorDashboardLayout from "../../common/layout";
import { createListing, updateListing, createAddress, getListingCategories, getListingSubcategories, getAmenities, uploadMedia, createFAQ, getListingById, getFAQs, getMediaAssets, deleteFAQ } from "@/helpers/backend_helper";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { validateStep } from "@/utils/validationUtils";
import { getServiceName } from "@/utils/listingUtils";

// Property components
import Description from "./Description";
import Image from "./Image";
import Location from "./Location";
import Amenities from "./Amenities";
import FAQs from "./FAQs";

// Non-property components
import AddEvent from "../non-property/AddEvent";
import AddActivity from "../non-property/AddActivity";
import AddTour from "../non-property/AddTour";

/**
 * Unified AddListing Component
 * 
 * @param {string} type - Listing type: "property", "activity", "tour", "event", "flight", "ride"
 * @param {string} subtype - Listing subtype (for property only): "Hotel", "Space", "Vacation", "EventVenue"
 * @param {string} listingId - Listing ID for edit mode
 * @param {boolean} isEditMode - Whether in edit mode
 */
const AddListing = ({
  type: propType,
  subtype: propSubtype,
  listingId,
  isEditMode = false,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get type from props, URL params, or listing data
  const type = propType || searchParams.get("type") || "property";

  // Get subtype from props, URL params, or listing data
  const subtype = propSubtype || searchParams.get("subtype") || null;

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditMode);
  const [activeStep, setActiveStep] = useState(1);

  const service = getServiceName(type, subtype);

  // Initialize listing data with subtype-specific fields
  const getInitialListingData = () => {
    const baseData = {
      title: "",
      category_id: null,
      subcategory_id: null,
      description: "",
      star_rating: null,
      location_address_id: null,
      address: {
        line1: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
        region: "",
      },
      images: [],
      amenities: [],
      accessibilityInfo: "",
      isAccessibilityEnabled: false,
      faqs: [],
    };

    // Add subtype-specific fields
    if (subtype === "Hotel") {
      return {
        ...baseData,
        contact_email: "",
        contact_phone: "",
      };
    } else if (subtype === "EventVenue") {
      return {
        ...baseData,
        manager_name: "",
        manager_phone: "",
        parking_info: "",
      };
    } else if (subtype === "Space") {
      return {
        ...baseData,
        manager_name: "",
        manager_phone: "",
      };
    }
    // Vacation or default - no additional fields
    return baseData;
  };

  const [listingData, setListingData] = useState(getInitialListingData);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [amenitiesList, setAmenitiesList] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [existingFaqIds, setExistingFaqIds] = useState([]);

  const loadData = async () => {
    try {
      const filterParams = { type: type || "property" };
      if (subtype) {
        filterParams.subtype = subtype;
      }
      const [catRes, subcatRes, amenitiesRes] = await Promise.all([
        getListingCategories(filterParams),
        getListingSubcategories(filterParams),
        getAmenities(),
      ]);

      setCategories(catRes?.data || catRes || []);
      setSubcategories(subcatRes?.data || subcatRes || []);
      setAmenitiesList(amenitiesRes?.data || amenitiesRes || []);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error(error?.message || "Failed to load data");
    }
  };
  // Load categories, subcategories, and amenities
  useEffect(() => {
    loadData();
  }, [type, subtype]);

  const loadListingData = async () => {
    if (!isEditMode || !listingId) return;

    try {
      setLoading(true);
      const [listingRes, faqsRes, mediaRes] = await Promise.all([
        getListingById(listingId),
        getFAQs({ listing_id: listingId }),
        getMediaAssets({ listing_id: listingId }),
      ]);

      const listing = listingRes?.data || listingRes;

      if (listing) {
        // Update listing data with all fields including subtype-specific ones
        const updatedData = {
          title: listing.title || "",
          category_id: listing.category_id || null,
          subcategory_id: listing.subcategory_id || null,
          description: listing.description || "",
          star_rating: listing.star_rating || null,
          location_address_id: listing.location_address_id || null,
          amenities: listing.amenity && Array.isArray(listing.amenity)
            ? listing.amenity.map((a) => a.id)
            : [],
          accessibilityInfo: listing.accessibility_info || "",
          isAccessibilityEnabled: listing.accessibility_info !== null && listing.accessibility_info !== undefined,
          status: listing.status || "draft",
        };

        // Add subtype-specific fields
        if (subtype === "Hotel") {
          updatedData.contact_email = listing.contact_email || "";
          updatedData.contact_phone = listing.contact_phone || "";
        } else if (subtype === "EventVenue") {
          updatedData.manager_name = listing.manager_name || "";
          updatedData.manager_phone = listing.manager_phone || "";
          updatedData.parking_info = listing.parking_info || "";
        } else if (subtype === "Space") {
          updatedData.manager_name = listing.manager_name || "";
          updatedData.manager_phone = listing.manager_phone || "";
        }

        setListingData((prev) => ({
          ...prev,
          ...updatedData,
        }));

        // Load FAQs
        const faqs = faqsRes?.data || faqsRes || [];
        if (Array.isArray(faqs)) {
          setListingData((prev) => ({
            ...prev,
            faqs: faqs.map((faq) => ({
              question: faq.question || "",
              answer: faq.answer || "",
            })),
          }));
          setExistingFaqIds(faqs.map((faq) => faq.id).filter((id) => id));
        }

        // Load existing images
        const media = mediaRes?.data || mediaRes || [];
        if (Array.isArray(media)) {
          const images = media.filter((m) => m.type === "image").map((m) => ({
            id: m.id,
            url: m.url,
            type: m.type,
          }));
          setExistingImages(images);
        }
      } else {
        toast.error("Listing not found");
        router.push("/vendor/listings/property");
      }
    } catch (error) {
      console.error("Error loading listing data:", error);
      toast.error(error?.message || "Failed to load listing data");
      router.push("/vendor/listings/property");
    } finally {
      setLoading(false);
    }
  };

  // Load listing data when in edit mode
  useEffect(() => {
    loadListingData();
  }, [isEditMode, listingId, router, subtype]);

  // Use validation utility function
  const validateStepLocal = (step) => {
    return validateStep(step, listingData, uploadedImages, existingImages, false, subtype);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Validate required fields
      if (!listingData.title || !listingData.title.trim()) {
        toast.error("Please enter a listing title");
        setSaving(false);
        return;
      }
      if (!listingData.category_id) {
        toast.error("Please select a category");
        setSaving(false);
        return;
      }
      if (!listingData.subcategory_id) {
        toast.error("Please select a subcategory");
        setSaving(false);
        return;
      }

      // Process accessibility_info
      let accessibilityInfoValue = null;
      if (listingData.isAccessibilityEnabled) {
        if (listingData.accessibilityInfo && typeof listingData.accessibilityInfo === 'string') {
          const trimmed = listingData.accessibilityInfo.trim();
          accessibilityInfoValue = trimmed;
        } else {
          accessibilityInfoValue = "";
        }
      } else {
        accessibilityInfoValue = null;
      }

      // Create address if location data is provided
      let locationAddressId = listingData.location_address_id;
      if (!locationAddressId && listingData.address.line1 && listingData.address.city) {
        try {
          const addressData = {
            line1: listingData.address.line1,
            city: listingData.address.city,
            state: listingData.address.state || "",
            postal_code: listingData.address.postal_code || "",
            country: listingData.address.country || "",
            region: listingData.address.region || "",
          };
          const addressRes = await createAddress(addressData);
          const createdAddress = addressRes?.data || addressRes;
          locationAddressId = createdAddress?.id;
        } catch (error) {
          console.error("Error creating address:", error);
          toast.warning("Address creation failed. Creating listing without address.");
        }
      }

      const listingPayload = {
        title: listingData.title.trim(),
        type: type || "property",
        subtype: subtype || null,
        category_id: listingData.category_id || null,
        subcategory_id: listingData.subcategory_id || null,
        description: listingData.description.trim(),
        star_rating: listingData.star_rating || null,
        accessibility_info: accessibilityInfoValue,
        location_address_id: locationAddressId || null,
        ...(isEditMode ? {} : { status: "draft" }),
        amenities: listingData.amenities && Array.isArray(listingData.amenities) && listingData.amenities.length > 0
          ? listingData.amenities.filter(id => typeof id === 'number' && !isNaN(id))
          : [],
      };

      // Add subtype-specific fields to payload if they exist
      if (subtype === "Hotel") {
        if (listingData.contact_email) listingPayload.contact_email = listingData.contact_email;
        if (listingData.contact_phone) listingPayload.contact_phone = listingData.contact_phone;
      } else if (subtype === "EventVenue") {
        if (listingData.manager_name) listingPayload.manager_name = listingData.manager_name;
        if (listingData.manager_phone) listingPayload.manager_phone = listingData.manager_phone;
        if (listingData.parking_info) listingPayload.parking_info = listingData.parking_info;
      } else if (subtype === "Space") {
        if (listingData.manager_name) listingPayload.manager_name = listingData.manager_name;
        if (listingData.manager_phone) listingPayload.manager_phone = listingData.manager_phone;
      }

      if (isEditMode && listingId) {
        // Update existing listing
        const response = await updateListing(listingId, listingPayload);
        const updatedListing = response?.data || response;

        if (updatedListing?.id) {
          // Upload new images if any were selected
          if (uploadedImages.length > 0) {
            try {
              const uploadPromises = uploadedImages.map((file) =>
                uploadMedia(file, updatedListing.id)
              );
              await Promise.all(uploadPromises);
            } catch (error) {
              console.error("Error uploading images:", error);
              toast.warning("Listing updated, but some images failed to upload.");
            }
          }

          // Update FAQs: Delete existing and create new ones
          if (existingFaqIds.length > 0) {
            try {
              await Promise.all(
                existingFaqIds.map((faqId) => deleteFAQ(faqId))
              );
            } catch (error) {
              console.error("Error deleting existing FAQs:", error);
              toast.warning("Failed to delete some existing FAQs.");
            }
          }

          // Create new FAQs if any were added
          if (listingData.faqs && Array.isArray(listingData.faqs) && listingData.faqs.length > 0) {
            try {
              const validFaqs = listingData.faqs.filter(
                (faq) => faq.question?.trim() && faq.answer?.trim()
              );

              if (validFaqs.length > 0) {
                const faqPromises = validFaqs.map((faq) =>
                  createFAQ({
                    listing_id: updatedListing.id,
                    question: faq.question.trim(),
                    answer: faq.answer.trim(),
                  })
                );
                await Promise.all(faqPromises);
              }
            } catch (error) {
              console.error("Error creating FAQs:", error);
              toast.warning("Listing updated, but some FAQs failed to save.");
            }
          }

          toast.success("Listing updated successfully!");
          router.push(`/vendor/room-type/add?subtype=${subtype}&listingId=${updatedListing.id}`);
        } else {
          toast.error("Failed to update listing. Please try again.");
        }
      } else {
        // Create new listing
        const response = await createListing(listingPayload);
        const createdListing = response?.data || response;

        if (createdListing?.id) {
          // Upload images if any were selected
          if (uploadedImages.length > 0) {
            try {
              const uploadPromises = uploadedImages.map((file) =>
                uploadMedia(file, createdListing.id)
              );
              await Promise.all(uploadPromises);
            } catch (error) {
              console.error("Error uploading images:", error);
              toast.warning("Listing created, but some images failed to upload.");
            }
          }

          // Create FAQs if any were added
          if (listingData.faqs && Array.isArray(listingData.faqs) && listingData.faqs.length > 0) {
            try {
              const validFaqs = listingData.faqs.filter(
                (faq) => faq.question?.trim() && faq.answer?.trim()
              );

              if (validFaqs.length > 0) {
                const faqPromises = validFaqs.map((faq) =>
                  createFAQ({
                    listing_id: createdListing.id,
                    question: faq.question.trim(),
                    answer: faq.answer.trim(),
                  })
                );
                await Promise.all(faqPromises);
              }
            } catch (error) {
              console.error("Error creating FAQs:", error);
              toast.warning("Listing created, but some FAQs failed to save.");
            }
          }

          toast.success("Listing created successfully!");
          localStorage.setItem("add-rateplan-property-id", createdListing.id);
          router.push(`/vendor/room-type/add?type=${type}&subtype=${subtype}&listingId=${createdListing.id}`);
        } else {
          toast.error("Failed to create listing. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error saving listing:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to save listing";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const updateListingData = useCallback((field, value) => {
    setListingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const updateAddressData = useCallback((field, value) => {
    setListingData((prev) => {
      if (field === 'address_id' || field === 'location_address_id') {
        return {
          ...prev,
          location_address_id: value,
        };
      }
      return {
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      };
    });
  }, []);

  const handleAmenitiesUpdate = useCallback((amenities) => {
    updateListingData("amenities", amenities);
  }, [updateListingData]);

  const handleAccessibilityInfoChange = useCallback((value) => {
    updateListingData("accessibilityInfo", value);
  }, [updateListingData]);

  const handleAccessibilityEnabledChange = useCallback((enabled) => {
    updateListingData("isAccessibilityEnabled", enabled);
  }, [updateListingData]);

  const handleFAQsUpdate = useCallback((faqs) => {
    updateListingData("faqs", faqs);
  }, [updateListingData]);

  // Memoize propertySteps for property type
  const propertySteps = useMemo(() => [
    {
      id: 1,
      name: "Property Description",
      content: (
        <Description
          data={listingData}
          categories={categories}
          subcategories={subcategories}
          onUpdate={updateListingData}
          subtype={subtype}
        />
      ),
    },
    {
      id: 2,
      name: "Property Images",
      content: (
        <Image
          images={uploadedImages}
          existingImages={existingImages}
          onImagesChange={(images) => setUploadedImages(images)}
          onExistingImagesChange={(images) => setExistingImages(images)}
          listingId={isEditMode ? listingId : null}
        />
      ),
    },
    {
      id: 3,
      name: "Location",
      content: (
        <Location
          address={{
            ...listingData.address,
            location_address_id: listingData.location_address_id,
          }}
          onUpdate={updateAddressData}
        />
      ),
    },
    {
      id: 4,
      name: "Property Amenities",
      content: (
        <Amenities
          amenitiesList={amenitiesList}
          selectedAmenities={listingData.amenities || []}
          onUpdate={handleAmenitiesUpdate}
          accessibilityInfo={listingData.accessibilityInfo || ""}
          isAccessibilityEnabled={listingData.isAccessibilityEnabled || false}
          onAccessibilityChange={handleAccessibilityInfoChange}
          onAccessibilityEnabledChange={handleAccessibilityEnabledChange}
        />
      ),
    },
    {
      id: 5,
      name: "FAQs",
      content: (
        <FAQs
          faqs={listingData.faqs || []}
          onUpdate={handleFAQsUpdate}
        />
      ),
    },
  ], [
    listingData,
    categories,
    subcategories,
    updateListingData,
    uploadedImages,
    existingImages,
    isEditMode,
    listingId,
    updateAddressData,
    amenitiesList,
    handleAmenitiesUpdate,
    handleAccessibilityInfoChange,
    handleAccessibilityEnabledChange,
    handleFAQsUpdate,
    subtype,
  ]);

  // Render appropriate component based on type and subtype
  const renderComponent = () => {
    if (!type) {
      return (
        <div className="d-flex flex-column items-center justify-center py-40">
          <span className="material-symbols-outlined text-48 text-light-1 mb-10">
            error
          </span>
          <div className="text-16 text-light-1 mb-10">Listing type is required</div>
          <button
            className="button -md bg-blue-1 px-15 py-10 fw-400 text-14 text-white rounded-8"
            onClick={() => router.push("/vendor/listings/property")}
          >
            Back to Listings
          </button>
        </div>
      );
    }

    // Property type - render unified property form
    if (type === "property") {

      return (
        <VendorDashboardLayout>
          <div className="row y-gap-20 py-10 px-10 rounded-8 bg-white shadow-3">
            {loading ? (
              <div className="d-flex justify-center items-center py-40">
                <CircularProgress />
                <span className="ml-10 text-14">Loading listing data...</span>
              </div>
            ) : (
              <>
                <h1 className="text-30 lh-14 fw-600">
                  {isEditMode ? "Edit Your Listing" : "Add Your Listing"}
                  <span className="text-12 text-white rounded-100 px-10 bg-dark-4 ml-10 fw-400">
                    {service}
                  </span>
                </h1>
                <div className="col-12 overflow-scroll scroll-bar-1">
                  <div className="d-flex justify-between">
                    {propertySteps.map((step, index) => (
                      <div
                        className="d-flex flex-column items-center"
                        style={{ minWidth: "120px" }}
                        key={index}
                      >
                        <div
                          className={
                            "size-35 flex-center rounded-full cursor-pointer text-14 " +
                            (step.id > activeStep
                              ? "bg-light-2 text-light-1"
                              : "bg-blue-1 text-white")
                          }
                        >
                          {step.id < activeStep ? svgIcon.icon_check : step.id}
                        </div>
                        <div className="text-12 text-center mt-10">{step.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-12">
                  <div className="border-light rounded-8 px-20 py-15">
                    {propertySteps[activeStep - 1].content}
                  </div>
                </div>

                <div className="col-12 d-flex justify-between">
                  <button
                    onClick={() => setActiveStep(activeStep - 1)}
                    className="border-light bg-light-2 rounded-8 py-5 px-20 fw-500 bg-white text-14"
                    disabled={activeStep === 1 || saving}
                  >
                    Previous
                  </button>
                  <button
                    className="rounded-8 py-5 px-20 bg-dark-4 text-white text-14"
                    onClick={async () => {
                      if (activeStep < propertySteps.length) {
                        if (validateStepLocal(activeStep)) {
                          setActiveStep(activeStep + 1);
                        }
                      } else {
                        if (validateStepLocal(activeStep)) {
                          await handleSave();
                        }
                      }
                    }}
                    disabled={saving}
                  >
                    {saving ? (isEditMode ? "Updating..." : "Saving...") : activeStep < propertySteps.length ? "Continue" : (isEditMode ? "Update" : "Save")}
                  </button>
                </div>
              </>
            )}
          </div>
        </VendorDashboardLayout>
      );
    }

    // Non-property types
    switch (type) {
      case "activity":
        return (
          <AddActivity
            type={type}
            subtype={subtype}
            listingId={listingId}
            isEditMode={isEditMode}
          />
        );

      case "tour":
        return (
          <AddTour
            type={type}
            subtype={subtype}
            listingId={listingId}
            isEditMode={isEditMode}
          />
        );

      case "event":
        return (
          <AddEvent
            type={type}
            subtype={subtype}
            listingId={listingId}
            isEditMode={isEditMode}
          />
        );

      case "flight":
        return (
          <div className="d-flex flex-column items-center justify-center py-40">
            <span className="material-symbols-outlined text-48 text-light-1 mb-10">
              info
            </span>
            <div className="text-16 text-light-1 mb-10">Flight listings are not yet available</div>
            <button
              className="button -md bg-blue-1 px-15 py-10 fw-400 text-14 text-white rounded-8"
              onClick={() => router.push("/vendor/listings/property")}
            >
              Back to Listings
            </button>
          </div>
        );

      case "ride":
        return (
          <div className="d-flex flex-column items-center justify-center py-40">
            <span className="material-symbols-outlined text-48 text-light-1 mb-10">
              info
            </span>
            <div className="text-16 text-light-1 mb-10">Ride listings are not yet available</div>
            <button
              className="button -md bg-blue-1 px-15 py-10 fw-400 text-14 text-white rounded-8"
              onClick={() => router.push("/vendor/listings/property")}
            >
              Back to Listings
            </button>
          </div>
        );

      default:
        return (
          <div className="d-flex flex-column items-center justify-center py-40">
            <span className="material-symbols-outlined text-48 text-light-1 mb-10">
              error
            </span>
            <div className="text-16 text-light-1 mb-10">Invalid listing type: {type}</div>
            <button
              className="button -md bg-blue-1 px-15 py-10 fw-400 text-14 text-white rounded-8"
              onClick={() => router.push("/vendor/listings/property")}
            >
              Back to Listings
            </button>
          </div>
        );
    }
  };

  return <>{renderComponent()}</>;
};

export default AddListing;
