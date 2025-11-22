import svgIcon from "@/components/data/svgIcon";
import { useState, useEffect, useCallback, useMemo } from "react";
import Description from "./Description";
import Image from "./Image";
import Location from "./Location";
import ListingDetails from "./ListingDetails";
import ListingPrice from "./ListingPrice";
import Amenities from "../../AddListing/Amenities";
import { useRouter } from "next/navigation";
import VendorDashboardLayout from "../../../common/layout";
import FAQs from "../../AddListing/FAQs";
import Calendar from "../common/Calendar";
import { createListing, updateListing, createAddress, getListingCategories, getListingSubcategories, getAmenities, uploadMedia, createFAQ, getListingById, getFAQs, getMediaAssets, deleteFAQ } from "@/helpers/backend_helper";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { validateStep } from "@/utils/validationUtils";
import { getServiceName } from "@/utils/listingUtils";

const index = ({ listingId, isEditMode = false, type: propType }) => {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditMode);
  const [activeStep, setActiveStep] = useState(1);

  const type = propType;
  const service = getServiceName(type);

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
    // ListingDetails fields
    listingDetails: {
      group_size_limit: "",
      inclusions: "",
      exclusions: "",
      is_multi_day: false,
      event_days: [],
      special_offers_id: null,
      parking_info: "",
      safety_guidelines: "",
      guide_name: "",
      guide_detail: "",
      itinerary_details: [{ type: "", details: "" }],
      cancellation_policy_id: null,
      accessibility_info: "",
      is_accessibility_enabled: false,
    },
    // ListingPrice fields
    listingPrice: {
      ticket_prices: [{ category: "", price: "" }],
      base_prices_by_day_of_week: false,
      additional_prices_by_guests: false,
      base_prices_by_day: {},
      guest_prices: [{ guest_start: "", guest_end: "", price: "" }],
    },
    // Calendar fields
    calendar: {
      calendar_type: 1,
      calendar_start_date: null,
      calendar_end_date: null,
      blocked_dates: [],
      available_dates: [],
    },
  });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [amenitiesList, setAmenitiesList] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [existingFaqIds, setExistingFaqIds] = useState([]);

  const loadData = async () => {
    try {
      const filterParams = { type: type || "tour" };

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
  useEffect(() => {
    loadData();
  }, [type]);

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
        // Type is already set from props, no need to set listingType state

        setListingData((prev) => ({
          ...prev,
          title: listing.title || "",
          category_id: listing.category_id || null,
          subcategory_id: listing.subcategory_id || null,
          description: listing.description || "",
          star_rating: listing.star_rating || null,
          location_address_id: listing.location_address_id || null,
          event_date_time: listing.event_date_time || null,
          amenities: listing.amenity && Array.isArray(listing.amenity)
            ? listing.amenity.map((a) => a.id)
            : [],
          accessibilityInfo: listing.accessibility_info || "",
          isAccessibilityEnabled: listing.accessibility_info !== null && listing.accessibility_info !== undefined,
          status: listing.status || "draft",
          // ListingDetails fields
          listingDetails: {
            group_size_limit: listing.group_size_limit || "",
            inclusions: listing.inclusions || "",
            exclusions: listing.exclusions || "",
            is_multi_day: listing.is_multi_day || false,
            event_days: listing.event_days && Array.isArray(listing.event_days) ? listing.event_days : [],
            special_offers_id: listing.special_offers_id || null,
            parking_info: listing.parking_info || "",
            safety_guidelines: listing.safety_guidelines || "",
            guide_name: listing.guide_name || "",
            guide_detail: listing.guide_detail || "",
            itinerary_details: listing.itinerary_details && Array.isArray(listing.itinerary_details) && listing.itinerary_details.length > 0
              ? listing.itinerary_details
              : [{ type: "", details: "" }],
            cancellation_policy_id: listing.cancellation_policy_id || null,
            accessibility_info: listing.accessibility_info || "",
            is_accessibility_enabled: listing.accessibility_info !== null && listing.accessibility_info !== undefined,
          },
          // ListingPrice fields
          listingPrice: {
            ticket_prices: listing.ticket_prices && Array.isArray(listing.ticket_prices) && listing.ticket_prices.length > 0
              ? listing.ticket_prices
              : [{ category: "", price: "" }],
            base_prices_by_day_of_week: listing.base_prices_by_day && typeof listing.base_prices_by_day === 'object' && Object.keys(listing.base_prices_by_day).length > 0,
            additional_prices_by_guests: listing.guest_prices && Array.isArray(listing.guest_prices) && listing.guest_prices.length > 0,
            base_prices_by_day: listing.base_prices_by_day && typeof listing.base_prices_by_day === 'object' ? listing.base_prices_by_day : {},
            guest_prices: listing.guest_prices && Array.isArray(listing.guest_prices) && listing.guest_prices.length > 0
              ? listing.guest_prices
              : [{ guest_start: "", guest_end: "", price: "" }],
          },
          // Calendar fields
          calendar: {
            calendar_type: listing.calendar_type || 1,
            calendar_start_date: listing.calendar_start_date || null,
            calendar_end_date: listing.calendar_end_date || null,
            blocked_dates: listing.blocked_dates && Array.isArray(listing.blocked_dates) ? listing.blocked_dates : [],
            available_dates: listing.available_dates && Array.isArray(listing.available_dates) ? listing.available_dates : [],
          },
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
      router.push("/vendor/listings/non-property");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListingData();
  }, [isEditMode, listingId, router]);

  // Use validation utility function
  const validateStepLocal = (step) => {
    return validateStep(step, listingData, uploadedImages, existingImages, true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

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
      if (!listingData.event_date_time) {
        toast.error("Please select a date & time");
        setSaving(false);
        return;
      }

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

      // Prepare listingDetails data
      const listingDetailsData = listingData.listingDetails || {};
      
      // Process accessibility_info from listingDetails
      let accessibilityInfoValue = null;
      if (listingDetailsData.is_accessibility_enabled) {
        if (listingDetailsData.accessibility_info && typeof listingDetailsData.accessibility_info === 'string') {
          const trimmed = listingDetailsData.accessibility_info.trim();
          accessibilityInfoValue = trimmed;
        } else {
          accessibilityInfoValue = "";
        }
      } else {
        accessibilityInfoValue = null;
      }
      
      // Prepare listingPrice data
      const listingPriceData = listingData.listingPrice || {};
      
      // Prepare calendar data
      const calendarData = listingData.calendar || {};

      const listingPayload = {
        title: listingData.title.trim(),
        type: type || "tour",
        category_id: listingData.category_id || null,
        subcategory_id: listingData.subcategory_id || null,
        description: listingData.description.trim(),
        star_rating: listingData.star_rating || null,
        event_date_time: listingData.event_date_time || null,
        accessibility_info: accessibilityInfoValue,
        location_address_id: locationAddressId || null,
        ...(isEditMode ? {} : { status: "draft" }),
        amenities: listingData.amenities && Array.isArray(listingData.amenities) && listingData.amenities.length > 0
          ? listingData.amenities.filter(id => typeof id === 'number' && !isNaN(id))
          : [],
        // ListingDetails fields
        group_size_limit: listingDetailsData.group_size_limit || null,
        inclusions: listingDetailsData.inclusions || null,
        exclusions: listingDetailsData.exclusions || null,
        is_multi_day: listingDetailsData.is_multi_day || false,
        event_days: listingDetailsData.event_days && Array.isArray(listingDetailsData.event_days) && listingDetailsData.event_days.length > 0
          ? listingDetailsData.event_days.map(day => ({
              ...day,
              start_time: day.start_time && day.start_time.trim() ? day.start_time.trim() : null,
              end_time: day.end_time && day.end_time.trim() ? day.end_time.trim() : null,
              date: day.date && day.date.trim() ? day.date.trim() : null,
              duration: day.duration && day.duration.trim() ? day.duration.trim() : null,
            }))
          : null,
        special_offers_id: listingDetailsData.special_offers_id || null,
        parking_info: listingDetailsData.parking_info && listingDetailsData.parking_info.trim() ? listingDetailsData.parking_info.trim() : null,
        safety_guidelines: listingDetailsData.safety_guidelines && listingDetailsData.safety_guidelines.trim() ? listingDetailsData.safety_guidelines.trim() : null,
        guide_name: listingDetailsData.guide_name && listingDetailsData.guide_name.trim() ? listingDetailsData.guide_name.trim() : null,
        guide_detail: listingDetailsData.guide_detail && listingDetailsData.guide_detail.trim() ? listingDetailsData.guide_detail.trim() : null,
        itinerary_details: listingDetailsData.itinerary_details && Array.isArray(listingDetailsData.itinerary_details) && listingDetailsData.itinerary_details.length > 0
          ? listingDetailsData.itinerary_details.filter(i => i.type && i.details)
          : null,
        cancellation_policy_id: listingDetailsData.cancellation_policy_id || null,
        // ListingPrice fields (stored as JSON)
        ticket_prices: listingPriceData.ticket_prices && Array.isArray(listingPriceData.ticket_prices) && listingPriceData.ticket_prices.length > 0
          ? listingPriceData.ticket_prices.filter(t => t.category && t.price)
          : null,
        base_prices_by_day: listingPriceData.base_prices_by_day && Object.keys(listingPriceData.base_prices_by_day).length > 0
          ? listingPriceData.base_prices_by_day
          : null,
        guest_prices: listingPriceData.guest_prices && Array.isArray(listingPriceData.guest_prices) && listingPriceData.guest_prices.length > 0
          ? listingPriceData.guest_prices.filter(g => g.guest_start && g.guest_end && g.price)
          : null,
        // Calendar fields
        calendar_type: calendarData.calendar_type || 1,
        calendar_start_date: calendarData.calendar_start_date || null,
        calendar_end_date: calendarData.calendar_end_date || null,
        blocked_dates: calendarData.blocked_dates && Array.isArray(calendarData.blocked_dates) && calendarData.blocked_dates.length > 0
          ? calendarData.blocked_dates
          : null,
        available_dates: calendarData.available_dates && Array.isArray(calendarData.available_dates) && calendarData.available_dates.length > 0
          ? calendarData.available_dates
          : null,
      };

      if (isEditMode && listingId) {
        const response = await updateListing(listingId, listingPayload);
        const updatedListing = response?.data || response;

        if (updatedListing?.id) {
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
          router.push("/vendor/listings/non-property");
        } else {
          toast.error("Failed to update listing. Please try again.");
        }
      } else {
        const response = await createListing(listingPayload);
        const createdListing = response?.data || response;

        if (createdListing?.id) {
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
          router.push("/vendor/listings/non-property");
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

  const propertySteps = useMemo(() => [
    {
      id: 1,
      name: "Listing Description",
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
      name: "Listing Images",
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
      name: "Listing Details",
      content: (
        <ListingDetails
          listingId={isEditMode ? listingId : null}
          data={listingData.listingDetails}
          onUpdate={(details) => updateListingData("listingDetails", details)}
        />
      ),
    },
    {
      id: 5,
      name: "Listing Price",
      content: (
        <ListingPrice
          data={listingData.listingPrice}
          onUpdate={(price) => updateListingData("listingPrice", price)}
        />
      ),
    },
    {
      id: 6,
      name: "FAQs",
      content: (
        <FAQs
          faqs={listingData.faqs || []}
          onUpdate={(faqs) => updateListingData("faqs", faqs)}
        />
      ),
    },
    {
      id: 7,
      name: "Calendar",
      content: (
        <Calendar
          data={listingData.calendar}
          onUpdate={(calendar) => updateListingData("calendar", calendar)}
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
  ]);

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
};

export default index;
