import { useState, useEffect, useRef } from "react";
import { Checkbox } from "@mui/material";
import { CircularProgress } from "@mui/material";

const Amenities = ({ amenitiesList = [], selectedAmenities = [], onUpdate, accessibilityInfo = "", isAccessibilityEnabled: propIsAccessibilityEnabled = false, onAccessibilityChange, onAccessibilityEnabledChange }) => {
  const [selectedIds, setSelectedIds] = useState(selectedAmenities);
  const [loading, setLoading] = useState(false);
  
  // For accessibility checkbox: if parent controls it, use prop directly (no state)
  // Otherwise, use local state (backward compatibility)
  const isParentControlled = !!onAccessibilityEnabledChange;
  const [localIsAccessibilityEnabled, setLocalIsAccessibilityEnabled] = useState(() => {
    // Only use local state if parent doesn't control it
    if (!isParentControlled) {
      return !!(accessibilityInfo && accessibilityInfo.trim());
    }
    return false; // Not used when parent controls
  });
  
  // Use prop value when parent controls, otherwise use local state
  const isAccessibilityEnabled = isParentControlled 
    ? propIsAccessibilityEnabled 
    : localIsAccessibilityEnabled;

  // Initialize selected amenities from props
  // Use ref to track previous value to avoid unnecessary updates
  const prevSelectedAmenities = useRef(selectedAmenities);
  
  useEffect(() => {
    // Only update if selectedAmenities actually changed
    const isEqual = JSON.stringify(prevSelectedAmenities.current) === JSON.stringify(selectedAmenities);
    if (!isEqual) {
      if (selectedAmenities && Array.isArray(selectedAmenities)) {
        // If selectedAmenities is an array of IDs
        if (selectedAmenities.length > 0 && typeof selectedAmenities[0] === 'number') {
          setSelectedIds(selectedAmenities);
        } 
        // If selectedAmenities is an array of objects with id property
        else if (selectedAmenities.length > 0 && selectedAmenities[0]?.id) {
          setSelectedIds(selectedAmenities.map(a => a.id));
        } else if (selectedAmenities.length === 0) {
          // If empty array, clear selection
          setSelectedIds([]);
        }
      }
      prevSelectedAmenities.current = selectedAmenities;
    }
  }, [selectedAmenities]);

  // Sync local state with accessibilityInfo when not parent-controlled (backward compatibility)
  useEffect(() => {
    if (!isParentControlled) {
      const hasValue = accessibilityInfo !== null && accessibilityInfo !== undefined;
      if (hasValue !== localIsAccessibilityEnabled) {
        setLocalIsAccessibilityEnabled(hasValue);
      }
    }
  }, [accessibilityInfo, isParentControlled, localIsAccessibilityEnabled]);

  // Track when selectedIds change and notify parent after render
  const prevSelectedIds = useRef(selectedIds);
  const isInitialMount = useRef(true);
  
  useEffect(() => {
    // Skip on initial mount to avoid calling parent during initial render
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevSelectedIds.current = selectedIds;
      return;
    }
    
    // Only notify parent if selectedIds actually changed and onUpdate is provided
    if (onUpdate) {
      const hasChanged = JSON.stringify(prevSelectedIds.current) !== JSON.stringify(selectedIds);
      if (hasChanged) {
        // Schedule update after render to avoid React warning
        // Using requestAnimationFrame ensures this runs after the current render cycle
        requestAnimationFrame(() => {
          onUpdate(selectedIds);
        });
        prevSelectedIds.current = selectedIds;
      }
    }
  }, [selectedIds, onUpdate]);

  const handleAmenityToggle = (amenityId) => {
    setSelectedIds((prev) => {
      const newSelected = prev.includes(amenityId)
        ? prev.filter((id) => id !== amenityId)
        : [...prev, amenityId];
      return newSelected;
    });
  };

  const handleAccessibilityCheckboxChange = (event) => {
    const checked = event.target.checked;
    
    // Update local state if not parent-controlled (backward compatibility)
    if (!isParentControlled) {
      setLocalIsAccessibilityEnabled(checked);
    }
    
    // Notify parent of checkbox state change (if parent controls it)
    // This is called from an event handler, so it's safe to call parent state setters
    if (onAccessibilityEnabledChange) {
      onAccessibilityEnabledChange(checked);
    }
    
    // If unchecked, clear the accessibility info and disable textarea
    if (!checked) {
      if (onAccessibilityChange) {
        onAccessibilityChange("");
      }
    }
    // If checked, textarea will be enabled and user can type
    // Note: We don't clear the text when checked - user might have text already
  };

  const handleAccessibilityChange = (value) => {
    // Only update if checkbox is enabled
    if (isAccessibilityEnabled && onAccessibilityChange) {
      onAccessibilityChange(value);
    }
  };

  if (loading && amenitiesList.length === 0) {
    return (
      <div className="d-flex justify-center items-center py-40">
        <CircularProgress size={24} />
        <span className="ml-10 text-14">Loading amenities...</span>
      </div>
    );
  }

  return (
    <div className="row y-gap-10 x-gap-20">
      <h1 className="text-20 lh-14 fw-600">Amenities and Features</h1>
      <div className="text-16 lh-14 fw-500">Amenities</div>
      {amenitiesList.length === 0 ? (
        <div className="col-12 d-flex flex-column items-center justify-center py-20">
          <span className="material-symbols-outlined text-32 text-light-1 mb-10">
            info
          </span>
          <div className="text-14 text-light-1">No amenities available</div>
        </div>
      ) : (
        <div className="col-12">
          <div className="row y-gap-10 x-gap-10">
            {amenitiesList.map((amenity) => (
              <div className="col-sm-4 mt-5" key={amenity.id}>
                <div className="form-checkbox d-flex items-center">
                  <input
                    type="checkbox"
                    name={`amenity-${amenity.id}`}
                    checked={selectedIds.includes(amenity.id)}
                    onChange={() => handleAmenityToggle(amenity.id)}
                  />
                  <div className="form-checkbox__mark">
                    <div className="form-checkbox__icon icon-check" />
                  </div>
                  <div className="text-14 fw-500 ml-10">{amenity.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="text-16 lh-14 fw-500 mt-10">Other Features</div>
      <div className="px-10 mt-5">
        <div className="d-flex items-center gap-1">
          <Checkbox 
            className="px-0 py-0" 
            checked={isAccessibilityEnabled}
            onChange={handleAccessibilityCheckboxChange}
          />
          <h1 className="text-14 lh-12 fw-500">Accessibility Info</h1>
        </div>
        <textarea
          rows={2}
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder={isAccessibilityEnabled ? "Describe Accessibility" : "Enable accessibility info to add description"}
          value={accessibilityInfo || ""}
          onChange={(e) => handleAccessibilityChange(e.target.value)}
          disabled={!isAccessibilityEnabled}
          style={{
            opacity: isAccessibilityEnabled ? 1 : 0.6,
            cursor: isAccessibilityEnabled ? 'text' : 'not-allowed',
            backgroundColor: isAccessibilityEnabled ? 'transparent' : '#f5f5f5'
          }}
        />
      </div>
    </div>
  );
};

export default Amenities;

