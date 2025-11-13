import svgIcon from "@/components/data/svgIcon";
import { useState, useEffect, useCallback, useMemo } from "react";
import Description from "./Description";
import Image from "./Image";
import Location from "./Location";
import Amenities from "../../common/Amenities";
import { useRouter, useSearchParams } from "next/navigation";
import VendorDashboardLayout from "../../../common/layout";
import FAQs from "../../common/FAQs";
import { createListing, updateListing, createAddress, getListingCategories, getListingSubcategories, getAmenities, uploadMedia, createFAQ, getListingById, getFAQs, getMediaAssets, deleteFAQ } from "@/helpers/backend_helper";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";

const index = ({ listingId, isEditMode = false, service: propService }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const service = propService || searchParams.get("service") || "";
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditMode);
  const [activeStep, setActiveStep] = useState(1);
  const [listingData, setListingData] = useState({
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
    // Space-specific fields
    manager_name: "",
    manager_phone: "",
  });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [amenitiesList, setAmenitiesList] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [existingFaqIds, setExistingFaqIds] = useState([]);

  // Map frontend property types to backend type
  const getPropertyType = (serviceName) => {
    const typeMap = {
      "Hotels": "property",
      "Vacation Rentals": "property",
      "Event Venues": "property",
      "Spaces": "property",
    };
    return typeMap[serviceName] || "property";
  };

  // Map service name to subtype
  const getSubtypeFromService = (serviceName) => {
    if (!serviceName) return null;
    const subtypeMap = {
      "Hotels": "Hotel",
      "Spaces": "Space",
      "Vacation Rentals": "Vacation",
      "Event Venues": "EventVenue",
    };
    return subtypeMap[serviceName] || null;
  };

  // Load categories, subcategories, and amenities
  const loadData = async () => {
    try {
      const [catRes, subcatRes, amenitiesRes] = await Promise.all([
        getListingCategories(),
        getListingSubcategories(),
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
  useEffect(() => {
    loadData();
  }, []);

  // Load listing data when in edit mode
  useEffect(() => {
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
          setListingData((prev) => ({
            ...prev,
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
            // Note: manager_name and manager_phone are not in the listing model
            manager_name: listing.manager_name || "",
            manager_phone: listing.manager_phone || "",
          }));

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

          const media = mediaRes?.data || mediaRes || [];
          if (Array.isArray(media)) {
            const images = media.filter((m) => m.type === "image").map((m) => ({
              id: m.id,
              url: m.url,
              type: m.type,
            }));
            setExistingImages(images);
          }
        }
      } catch (error) {
        console.error("Error loading listing data:", error);
        toast.error(error?.message || "Failed to load listing data");
        router.push("/vendor/listings/property");
      } finally {
        setLoading(false);
      }
    };

    loadListingData();
  }, [isEditMode, listingId, router]);

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!listingData.title || listingData.title.trim() === "") {
          toast.error("Please enter a listing title");
          return false;
        }
        return true;
      case 2:
        if (uploadedImages.length === 0 && existingImages.length === 0) {
          toast.warning("No images added. You can add images later.");
        }
        return true;
      case 3:
        if (!listingData.location_address_id && (!listingData.address.line1 || listingData.address.line1.trim() === "")) {
          toast.warning("No location address selected. You can add it later.");
        }
        return true;
      case 4:
        return true;
      case 5:
        return true;
      default:
        return true;
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      if (!listingData.title || listingData.title.trim() === "") {
        toast.error("Please enter a listing title");
        setSaving(false);
        return;
      }

      let accessibilityInfoValue = null;
      if (listingData.isAccessibilityEnabled) {
        accessibilityInfoValue = listingData.accessibilityInfo
          ? listingData.accessibilityInfo.trim()
          : "";
        if (accessibilityInfoValue === "") {
          accessibilityInfoValue = null;
        }
      } else {
        accessibilityInfoValue = null;
      }

      const subtype = getSubtypeFromService(service);

      const listingPayload = {
        title: listingData.title.trim(),
        type: getPropertyType(service),
        subtype: subtype || null,
        category_id: listingData.category_id || null,
        subcategory_id: listingData.subcategory_id || null,
        description: listingData.description.trim(),
        star_rating: listingData.star_rating || null,
        accessibility_info: accessibilityInfoValue,
        location_address_id: listingData.location_address_id || null,
        ...(isEditMode ? {} : { status: "draft" }),
        amenities: listingData.amenities && Array.isArray(listingData.amenities) && listingData.amenities.length > 0
          ? listingData.amenities.filter(id => typeof id === 'number' && !isNaN(id))
          : [],
      };

      if (isEditMode && listingId) {
        const response = await updateListing(listingId, listingPayload);
        const updatedListing = response?.data || response;

        if (updatedListing) {
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
              // Delete existing FAQs
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
              // Filter out empty FAQs (both question and answer must be filled)
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
          router.push("/vendor/listings/property");
        } else {
          toast.error("Failed to update listing. Please try again.");
        }
      } else {
        const response = await createListing(listingPayload);
        const createdListing = response?.data || response;

        if (createdListing) {
          if (!listingData.location_address_id && listingData.address.line1) {
            try {
              const addressResponse = await createAddress({
                line1: listingData.address.line1,
                city: listingData.address.city || "",
                state: listingData.address.state || "",
                postal_code: listingData.address.postal_code || "",
                country: listingData.address.country || "",
                region: listingData.address.region || "",
              });
              const newAddress = addressResponse?.data || addressResponse;
              if (newAddress?.id) {
                await updateListing(createdListing.id, {
                  location_address_id: newAddress.id,
                });
                setListingData((prev) => ({
                  ...prev,
                  location_address_id: newAddress.id,
                }));
              }
            } catch (error) {
              console.error("Error creating address:", error);
              toast.warning("Listing created but address could not be saved");
            }
          }

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

          if (listingData.faqs && Array.isArray(listingData.faqs)) {
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
          router.push(`/vendor/room-type/add?service=${encodeURIComponent(service)}&listingId=${createdListing.id}`);
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
  ]);

  return (
    <VendorDashboardLayout>
      <div className="row y-gap-20 py-10 px-10 rounded-8 bg-white shadow-3">
        {loading ? (
          <div className="d-flex justify-center items-center py-40">
            <CircularProgress />
            <span className="ml-10 text-14">Loading listing...</span>
          </div>
        ) : (
          <>
            <h1 className="text-30 lh-14 fw-600">
              {isEditMode ? "Edit" : "Add"} Your Listing
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
                disabled={activeStep === 1}
              >
                Previous
              </button>
              <button
                className="rounded-8 py-5 px-20 bg-dark-4 text-white text-14"
                disabled={saving}
                onClick={async () => {
                  if (activeStep < propertySteps.length) {
                    if (validateStep(activeStep)) {
                      setActiveStep(activeStep + 1);
                    }
                  } else {
                    await handleSave();
                  }
                }}
              >
                {saving
                  ? "Saving..."
                  : activeStep < propertySteps.length
                  ? "Continue"
                  : isEditMode
                  ? "Update"
                  : "Save"}
              </button>
            </div>
          </>
        )}
      </div>
    </VendorDashboardLayout>
  );
};

export default index;
