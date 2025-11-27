"use client";

import { useRouter } from "next/navigation";
import VendorDashboardLayout from "../common/layout";
import { useMemo, useState, useEffect } from "react";
import { Menu, MenuItem } from "@mui/material";
import { getAddOnServices, deleteAddOnService, getAddOnServiceById } from "@/helpers/backend_helper";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { useVendorPermissions } from "@/hooks/useVendorPermissions";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import CustomEventCalendar from "../common/CustomEventCalendar";

const index = () => {
  const { hasPermission } = useVendorPermissions();
  const router = useRouter();
  const [addOnServices, setAddOnServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAddOnServiceId, setSelectedAddOnServiceId] = useState(null);
  const showMoreMenu = Boolean(anchorEl);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addOnServiceToDelete, setAddOnServiceToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedServiceForCalendar, setSelectedServiceForCalendar] = useState(null);
  const [loadingCalendar, setLoadingCalendar] = useState(false);
  const [calendarActiveTab, setCalendarActiveTab] = useState("events");

  // Load add-on services from backend
  useEffect(() => {
    loadAddOnServices();
  }, []);

  const loadAddOnServices = async () => {
    try {
      setLoading(true);
      const response = await getAddOnServices();
      const servicesData = response?.data || response || [];
      const servicesArray = Array.isArray(servicesData) ? servicesData : [];
      
      // Transform backend data to match UI format
      const transformedServices = servicesArray.map((service) => {
        return {
          id: service.id,
          name: service.name || "",
          description: service.name || "", // Use name as description for now (model doesn't have description)
          type: service.type || "",
          basePrice: service.base_price ? `$${parseFloat(service.base_price).toFixed(2)}` : "$0.00",
          hourAvailable: service.hours_available 
            ? `${parseFloat(service.hours_available)} ${parseFloat(service.hours_available) <= 1 ? "hour" : "hours"}`
            : "N/A",
          availabilityPerTimeframe: service.availability_per_timeframe 
            ? service.availability_per_timeframe.toString()
            : "N/A",
          requires_scheduling: service.requires_scheduling || false,
          // Calendar fields
          calendar_type: service.calendar_type || 1,
          calendar_start_date: service.calendar_start_date || null,
          calendar_end_date: service.calendar_end_date || null,
          blocked_dates: service.blocked_dates && Array.isArray(service.blocked_dates) ? service.blocked_dates : [],
          available_dates: service.available_dates && Array.isArray(service.available_dates) ? service.available_dates : [],
          rawData: service, // Keep raw data for edit
        };
      });
      
      setAddOnServices(transformedServices);
    } catch (error) {
      console.error("Error loading add-on services:", error);
      if (error?.response?.status === 404 || error?.status === 404) {
        setAddOnServices([]);
      } else {
        toast.error(error?.message || "Failed to load add-on services");
        setAddOnServices([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event, addOnServiceId) => {
    setAnchorEl(event.currentTarget);
    setSelectedAddOnServiceId(addOnServiceId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAddOnServiceId(null);
  };

  const handleDeleteClick = (addOnServiceId) => {
    const service = addOnServices.find((s) => s.id === addOnServiceId);
    setAddOnServiceToDelete(service);
    setDeleteModalOpen(true);
    handleMenuClose();
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setAddOnServiceToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!addOnServiceToDelete) return;

    try {
      setDeleting(true);
      await deleteAddOnService(addOnServiceToDelete.id);
      toast.success("Add-on service deleted successfully");
      await loadAddOnServices();
      setDeleteModalOpen(false);
      setAddOnServiceToDelete(null);
    } catch (error) {
      console.error("Error deleting add-on service:", error);
      toast.error(error?.message || "Failed to delete add-on service");
    } finally {
      setDeleting(false);
    }
  };

  const handleEditClick = (addOnServiceId) => {
    const service = addOnServices.find((s) => s.id === addOnServiceId);
    if (service) {
      router.push(`/vendor/addon/add?id=${addOnServiceId}`);
    }
    handleMenuClose();
  };

  return (
    <VendorDashboardLayout>
      <div className="row y-gap-20 justify-between items-center mb-5">
        <div className="col-auto">
          <h1 className="text-30 lh-14 fw-600">Add-On Services Management</h1>
          <div className="text-15 text-light-1">
            Manage your Add-On services, pricing, and availability.
          </div>
        </div>
        <div className="col-auto ms-auto">
          <button
            className="button -md bg-blue-1 px-15 py-10 fw-400 text-14 text-white rounded-8"
            onClick={() => {
              if (hasPermission("addon_services_management", "create")) {
                router.push("/vendor/addon/add");
              }
            }}
            disabled={!hasPermission("addon_services_management", "create")}
            style={{ opacity: !hasPermission("addon_services_management", "create") ? 0.5 : 1, cursor: !hasPermission("addon_services_management", "create") ? "not-allowed" : "pointer" }}
          >
            New Add-on Service
          </button>
        </div>
      </div>

      <div className="px-15 px-15 py-10 rounded-8 bg-white shadow-3 mb-10">
        <div className="overflow-scroll scroll-bar-1 pt-0">
          <table className="table-2 col-12 text-14">
            <thead className="text-nowrap">
              <tr className="text-light-1 fw-600">
                <th>Name</th>
                <th>Description</th>
                <th>Type</th>
                <th>Base Price</th>
                <th>Hour Available</th>
                <th>Availability Per Timeframe</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-40">
                    <CircularProgress size={24} />
                    <span className="text-14 text-light-1 ml-10">Loading add-on services...</span>
                  </td>
                </tr>
              ) : addOnServices.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-40">
                    <div className="text-16 text-light-1">
                      No add-on services found. Create your first add-on service to get started.
                    </div>
                  </td>
                </tr>
              ) : (
                addOnServices.map((row) => (
                  <tr key={row.id}>
                    <td className="align-middle">{row.name}</td>
                    <td className="align-middle">{row.description}</td>
                    <td className="align-middle">{row.type || "N/A"}</td>
                    <td className="align-middle">{row.basePrice}</td>
                    <td className="align-middle">{row.hourAvailable}</td>
                    <td className="align-middle">
                      {row.availabilityPerTimeframe}
                    </td>
                    <td className="align-middle">
                      <span
                        className="material-symbols-outlined cursor-pointer"
                        onClick={(event) => handleMenuOpen(event, row.id)}
                      >
                        more_horiz
                      </span>
                      <Menu
                        anchorEl={anchorEl}
                        open={showMoreMenu && selectedAddOnServiceId === row.id}
                        onClose={handleMenuClose}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                      >
                        <MenuItem
                          onClick={() => {
                            if (hasPermission("addon_services_management", "view")) {
                              setSelectedServiceForCalendar(row.id);
                              setCalendarActiveTab("availability"); // Switch to availability tab
                              handleMenuClose();
                            }
                          }}
                          className="text-12"
                          disabled={!hasPermission("addon_services_management", "view")}
                        >
                          View Calendar
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            if (hasPermission("addon_services_management", "update")) {
                              handleEditClick(row.id);
                            }
                          }}
                          className="text-12"
                          disabled={!hasPermission("addon_services_management", "update")}
                        >
                          Edit
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            if (hasPermission("addon_services_management", "delete")) {
                              handleDeleteClick(row.id);
                            }
                          }}
                          className="text-12 text-red-1"
                          disabled={!hasPermission("addon_services_management", "delete")}
                        >
                          Delete
                        </MenuItem>
                      </Menu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AvailableCalendar 
        selectedServiceId={selectedServiceForCalendar}
        onServiceChange={setSelectedServiceForCalendar}
        addOnServices={addOnServices}
        activeTab={calendarActiveTab}
        onTabChange={setCalendarActiveTab}
      />

      <ConfirmationModal
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Add-On Service"
        message={`Are you sure you want to delete the add-on service "${addOnServiceToDelete?.name || `#${addOnServiceToDelete?.id}`}"?`}
        itemName={addOnServiceToDelete?.name || `Add-On Service #${addOnServiceToDelete?.id}`}
        loading={deleting}
        confirmLabel="Delete"
        confirmingLabel="Deleting..."
      />
    </VendorDashboardLayout>
  );
};

const AvailableCalendar = ({ selectedServiceId, onServiceChange, addOnServices, activeTab: externalActiveTab, onTabChange }) => {
  const [selectedService, setSelectedService] = useState(null);
  const [events, setEvents] = useState([]);
  const [internalActiveTab, setInternalActiveTab] = useState("events");
  
  // Use external activeTab if provided, otherwise use internal state
  const activeTab = externalActiveTab !== undefined ? externalActiveTab : internalActiveTab;
  const setActiveTab = onTabChange || setInternalActiveTab;

  // Load selected service data
  useEffect(() => {
    if (selectedServiceId && addOnServices && addOnServices.length > 0) {
      const service = addOnServices.find((s) => s.id === selectedServiceId);
      setSelectedService(service || null);
      
      if (service) {
        generateCalendarEvents(service);
      }
    } else {
      setSelectedService(null);
      setEvents([]);
    }
  }, [selectedServiceId, addOnServices]);

  const generateCalendarEvents = (service) => {
    const calendarEvents = [];
    
    // Add start/end date range event if set
    if (service.calendar_start_date && service.calendar_end_date) {
      const calendarType = service.calendar_type || 1;
      calendarEvents.push({
        title: calendarType === 1 ? "Open Calendar Period" : "Blocked Calendar Period",
        start: service.calendar_start_date,
        end: service.calendar_end_date,
        backgroundColor: calendarType === 1 ? "#4CAF50" : "#F44336",
      });
    }
    
    // Add blocked dates as events (only if calendar type is Open)
    if (service.calendar_type === 1 && service.blocked_dates && Array.isArray(service.blocked_dates)) {
      service.blocked_dates.forEach(date => {
        calendarEvents.push({
          title: "Blocked",
          start: date,
          backgroundColor: "#F44336",
          display: "background",
        });
      });
    }
    
    // Add available dates as events (only if calendar type is Blocked)
    if (service.calendar_type === 2 && service.available_dates && Array.isArray(service.available_dates)) {
      service.available_dates.forEach(date => {
        calendarEvents.push({
          title: "Available",
          start: date,
          backgroundColor: "#4CAF50",
          display: "background",
        });
      });
    }
    
    setEvents(calendarEvents);
  };

  function renderEventContent(eventInfo) {
    return <span className="text-14 fw-500 lh-1">{eventInfo.event.title}</span>;
  }

  const tabs = [
    {
      label: "Events",
      value: "events",
      content: <CustomEventCalendar />,
    },
    {
      label: "Availability",
      value: "availability",
      content: (
        <div className="px-20">
          {selectedService ? (
            <>
              <div className="mb-20">
                <h3 className="text-16 fw-600 mb-10">Service: {selectedService.name}</h3>
                <p className="text-14 text-light-1">
                  Calendar Type: {selectedService.calendar_type === 1 ? "Open Calendar" : "Blocked Calendar"}
                  {selectedService.calendar_start_date && selectedService.calendar_end_date && (
                    <> | Period: {new Date(selectedService.calendar_start_date).toLocaleDateString()} - {new Date(selectedService.calendar_end_date).toLocaleDateString()}</>
                  )}
                </p>
              </div>
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin]}
                initialView="dayGridMonth"
                weekends={true}
                headerToolbar={{
                  start: "prev,next,today",
                  center: "title",
                  end: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                events={events}
                eventContent={renderEventContent}
              />
            </>
          ) : (
            <div className="text-center py-40">
              <p className="text-16 text-light-1">
                Please select an add-on service from the table above to view its calendar
              </p>
            </div>
          )}
        </div>
      ),
    },
  ];
  return (
    <div className="bg-white border-light rounded-8 py-20 px-20">
      <div className="d-flex">
        <div className="px-5 mb-10 py-5 bg-light-2 rounded-8">
          {tabs.map((item) => (
            <button
              className={`text-14 px-10 fw-500 py-5 rounded-8 ${
                activeTab === item.value ? "bg-white" : "text-light-1"
              }`}
              key={item.value}
              onClick={() => setActiveTab(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="border-light rounded-8 py-20">
        {tabs.map((item) => (
          item.value == activeTab && (
            <div key={item.value}>
              {item.content}
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default index;
