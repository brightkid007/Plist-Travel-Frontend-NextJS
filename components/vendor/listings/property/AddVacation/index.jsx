import svgIcon from "@/components/data/svgIcon";
import { useState, useEffect } from "react";
import Description from "./Description";
import Image from "./Image";
import Location from "./Location";
import Amenities from "../../common/Amenities";
import { useRouter, useSearchParams } from "next/navigation";
import VendorDashboardLayout from "../../../common/layout";
import FAQs from "../../common/FAQs";
import { createListing, createAddress, getListingCategories, getListingSubcategories, getAmenities, uploadMedia, createFAQ } from "@/helpers/backend_helper";
import { toast } from "react-toastify";

const index = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const service = searchParams.get("service") || "";
  const [saving, setSaving] = useState(false);
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
    isAccessibilityEnabled: false, // Track checkbox state separately
    faqs: [],
  });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [amenitiesList, setAmenitiesList] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);

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

  // Load categories, subcategories, and amenities
  useEffect(() => {
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
    loadData();
  }, []);

  // Validate step before proceeding
  const validateStep = (step) => {
    switch (step) {
      case 1: // Property Description
        if (!listingData.title || !listingData.title.trim()) {
          toast.error("Please enter a listing title");
          return false;
        }
        // if (!listingData.description || !listingData.description.trim()) {
        //   toast.error("Please enter a description");
        //   return false;
        // }
        if (!listingData.category_id) {
          toast.error("Please select a category");
          return false;
        }
        // if (!listingData.subcategory_id) {
        //   toast.error("Please select a subcategory");
        //   return false;
        // }
        return true;

      case 2: // Property Images
        // Images are optional, but we can show a warning
        if (uploadedImages.length === 0) {
          // Show warning but allow to continue
          toast.warning("No images added. You can add images later.");
        }
        return true;

      case 3: // Location
        // Address is optional, but validate if any address fields are filled or if a saved address is selected
        // Check if a saved address is selected (location_address_id exists)
        if (listingData.location_address_id) {
          // Saved address is selected, validation passed
          return true;
        }
        // If no saved address, validate manual address fields
        if (!listingData.address.line1 || !listingData.address.line1.trim()) {
          toast.error("Please enter a street address or select a saved address");
          return false;
        }
        if (!listingData.address.city || !listingData.address.city.trim()) {
          toast.error("Please enter a city or select a saved address");
          return false;
        }
        // If no address fields are filled and no saved address, it's optional, allow to continue
        return true;

      case 4: // Property Amenities
        // Amenities are optional
        return true;

      case 5: // FAQs
        // FAQs are optional
        return true;

      default:
        return true;
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Validate required fields before saving
      if (!listingData.title || !listingData.title.trim()) {
        toast.error("Please enter a listing title");
        setSaving(false);
        return;
      }
      // if (!listingData.description || !listingData.description.trim()) {
      //   toast.error("Please enter a description");
      //   setSaving(false);
      //   return;
      // }
      if (!listingData.category_id) {
        toast.error("Please select a category");
        setSaving(false);
        return;
      }
      // if (!listingData.subcategory_id) {
      //   toast.error("Please select a subcategory");
      //   setSaving(false);
      //   return;
      // }

      // Create address if location data is provided (address is optional)
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
          // Address creation failed, but we can still create the listing without address
          toast.warning("Address creation failed. Creating listing without address.");
        }
      }

      // Create listing
      // Process accessibility_info: 
      // - If checkbox is enabled (checked), save the text (even if empty string)
      // - If checkbox is disabled (unchecked), save null
      let accessibilityInfoValue = null;
      if (listingData.isAccessibilityEnabled) {
        // Checkbox is checked - save the text value (trimmed)
        if (listingData.accessibilityInfo && typeof listingData.accessibilityInfo === 'string') {
          const trimmed = listingData.accessibilityInfo.trim();
          // Save trimmed value (empty string if no text entered but checkbox is checked)
          accessibilityInfoValue = trimmed;
        } else {
          // Checkbox is checked but no text - save empty string to indicate checkbox is enabled
          accessibilityInfoValue = "";
        }
      } else {
        // Checkbox is unchecked - save null
        accessibilityInfoValue = null;
      }

      const listingPayload = {
        title: listingData.title.trim(),
        type: getPropertyType(service),
        category_id: listingData.category_id || null,
        subcategory_id: listingData.subcategory_id || null,
        description: listingData.description.trim(),
        star_rating: listingData.star_rating || null,
        accessibility_info: accessibilityInfoValue,
        location_address_id: locationAddressId || null,
        status: "draft",
        amenities: listingData.amenities && Array.isArray(listingData.amenities) && listingData.amenities.length > 0
          ? listingData.amenities.filter(id => typeof id === 'number' && !isNaN(id))
          : [],
      };

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
            // Filter out empty FAQs (both question and answer must be filled)
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
    } catch (error) {
      console.error("Error saving listing:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to save listing";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const updateListingData = (field, value) => {
    setListingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateAddressData = (field, value) => {
    setListingData((prev) => {
      // If field is 'address_id', update location_address_id separately
      if (field === 'address_id' || field === 'location_address_id') {
        return {
          ...prev,
          location_address_id: value,
        };
      }
      // Otherwise, update address fields
      return {
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      };
    });
  };

  const propertySteps = [
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
          onImagesChange={(images) => setUploadedImages(images)}
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
          onUpdate={(amenities) => updateListingData("amenities", amenities)}
          accessibilityInfo={listingData.accessibilityInfo || ""}
          isAccessibilityEnabled={listingData.isAccessibilityEnabled || false}
          onAccessibilityChange={(value) => updateListingData("accessibilityInfo", value)}
          onAccessibilityEnabledChange={(enabled) => updateListingData("isAccessibilityEnabled", enabled)}
        />
      ),
    },
    {
      id: 5,
      name: "FAQs",
      content: (
        <FAQs
          faqs={listingData.faqs || []}
          onUpdate={(faqs) => updateListingData("faqs", faqs)}
        />
      ),
    },
  ];

  return (
    <VendorDashboardLayout>
      <div className="row y-gap-20 py-10 px-10 rounded-8 bg-white shadow-3">
        <h1 className="text-30 lh-14 fw-600">
          Add Your Listing
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
                // Validate current step before proceeding
                if (validateStep(activeStep)) {
                  setActiveStep(activeStep + 1);
                }
              } else {
                // Final step - validate and save
                if (validateStep(activeStep)) {
                  await handleSave();
                }
              }
            }}
            disabled={saving}
          >
            {saving ? "Saving..." : activeStep < propertySteps.length ? "Continue" : "Save"}
          </button>
        </div>
      </div>
    </VendorDashboardLayout>
  );
};

export default index;
