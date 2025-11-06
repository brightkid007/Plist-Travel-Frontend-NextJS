"use client";

import { useState, useEffect } from "react";
import DashboardCard from "../common/DashboardCard";
import AdminDashboardLayout from "../common/layout";
import data from "./data";
import { Drawer, Dialog } from "@mui/material";
import { Filter } from "lucide-react";
import TicketList from "./TicketList";
import Conversation from "./Conversation";
import { ChatBubbleOutline } from "@mui/icons-material";
import { getConversations, createConversation, getAdminUsers } from "@/helpers/backend_helper";
import { toast } from "react-toastify";
import FormInput from "@/components/common/form/FormInput";
import DatePicker, { DateObject } from "react-multi-date-picker";

// Ticket Filter Component
const TicketFilter = ({ filters, onFilterChange }) => {
  const handleChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <div className="d-flex flex-column y-gap-15">
      <div>
        <h3 className="text-14 fw-600 mb-10">Status</h3>
        <select
          className="form-select rounded-8 border-light py-10 px-15 w-100 text-14"
          value={filters.status}
          onChange={(e) => handleChange("status", e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div>
        <h3 className="text-14 fw-600 mb-10">Priority</h3>
        <select
          className="form-select rounded-8 border-light py-10 px-15 w-100 text-14"
          value={filters.priority}
          onChange={(e) => handleChange("priority", e.target.value)}
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      <div>
        <h3 className="text-14 fw-600 mb-10">Ticket Type</h3>
        <select
          className="form-select rounded-8 border-light py-10 px-15 w-100 text-14"
          value={filters.type}
          onChange={(e) => handleChange("type", e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="support">Support</option>
          <option value="general">General</option>
          <option value="booking">Booking</option>
          <option value="complaint">Complaint</option>
          <option value="inquiry">Inquiry</option>
        </select>
      </div>

      <div>
        <h3 className="text-14 fw-600 mb-10">Date Range</h3>
        <div className="d-flex flex-column y-gap-10">
          <div>
            <label className="text-12 text-light-1 mb-5 d-block">Start Date</label>
            <div className="border-light rounded-8 py-10 px-15 w-100 cursor-text text-light-1 bg-white">
              <DatePicker
                inputClass="custom_input-picker"
                containerClassName="custom_container-picker"
                value={filters.startDate ? new DateObject(filters.startDate) : null}
                onChange={(date) => {
                  handleChange("startDate", date ? date.format("YYYY-MM-DD") : null);
                }}
                numberOfMonths={1}
                offsetY={10}
                format="MMM DD, YYYY"
                placeholder="Select start date"
              />
            </div>
          </div>
          <div>
            <label className="text-12 text-light-1 mb-5 d-block">End Date</label>
            <div className="border-light rounded-8 py-10 px-15 w-100 cursor-text text-light-1 bg-white">
              <DatePicker
                inputClass="custom_input-picker"
                containerClassName="custom_container-picker"
                value={filters.endDate ? new DateObject(filters.endDate) : null}
                onChange={(date) => {
                  handleChange("endDate", date ? date.format("YYYY-MM-DD") : null);
                }}
                numberOfMonths={1}
                offsetY={10}
                format="MMM DD, YYYY"
                placeholder="Select end date"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const index = () => {
  const [openFilter, setOpenFilter] = useState(false);
  const [openNewTicket, setOpenNewTicket] = useState(false);
  const [cards, setCards] = useState(data);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [loadingTicket, setLoadingTicket] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    type: "all",
    startDate: null,
    endDate: null,
  });
  const [formData, setFormData] = useState({
    name: "",
    user_list: "",
    type: "support",
    priority: "medium",
    status: "open",
  });

  const handleClose = () => {
    setOpenFilter(false);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      status: "all",
      priority: "all",
      type: "all",
      startDate: null,
      endDate: null,
    });
  };

  const handleApplyFilters = () => {
    setOpenFilter(false);
  };

  const handleCloseNewTicket = () => {
    setOpenNewTicket(false);
    setFormData({
      name: "",
      user_list: "",
      type: "support",
      priority: "medium",
      status: "open",
    });
  };

  // Load conversations and tickets
  const loadConversations = async () => {
    try {
      setLoadingTickets(true);
      const res = await getConversations();
      const conversations = res?.conversations || res?.data?.conversations || res?.data || res || [];
      
      // Map conversations to tickets format
      const mapped = (Array.isArray(conversations) ? conversations : []).map((c) => ({
        ticket_id: c.ticket_id || c.id || `TKT-${c.id}`,
        customer_name: c.user?.user_profile?.first_name && c.user?.user_profile?.last_name
          ? `${c.user.user_profile.first_name} ${c.user.user_profile.last_name}`
          : c.user?.email?.split("@")[0] || "Unknown",
        customer_email: c.user?.email || "—",
        issue: c.subject || c.name || c.ticket_id || "No subject",
        ticket_type: c.type || c.category || "Other",
        status: c.status || "Open",
        priority: c.priority || "Medium",
        last_updated: c.updated_at || c.updatedAt || c.created_at || c.createdAt || "—",
        conversation_id: c.id,
      }));
      
      setTickets(mapped);

      // Update cards
      const total = conversations.length || 0;
      const open = conversations.filter((c) => c.status === "Open" || c.status === "open").length;
      const inProgress = conversations.filter((c) => c.status === "In Progress" || c.status === "in_progress").length;
      const resolved = conversations.filter((c) => c.status === "Resolved" || c.status === "resolved").length;

      setCards([
        { ...data[0], amount: String(total) },
        { ...data[1], amount: String(open + inProgress) },
        data[2],
        { ...data[3], amount: resolved > 0 ? `${Math.round((resolved / total) * 100)}%` : "0%" },
      ]);
    } catch (_) {
      setTickets([]);
      // keep defaults for cards
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  // Load customers when new ticket dialog opens
  useEffect(() => {
    if (openNewTicket) {
      const loadCustomers = async () => {
        try {
          setLoadingCustomers(true);
          const res = await getAdminUsers({ role: "customer" });
          const users = res?.users || res?.data?.users || res?.data || res || [];
          setCustomers(users);
        } catch (error) {
          toast.error("Failed to load customers");
        } finally {
          setLoadingCustomers(false);
        }
      };
      loadCustomers();
    }
  }, [openNewTicket]);

  const handleCreateTicket = async () => {
    if (!formData.user_list) {
      toast.error("Please select a customer");
      return;
    }
    if (!formData.name) {
      toast.error("Please enter a subject");
      return;
    }

    setLoadingTicket(true);
    try {
      const payload = {
        name: formData.name,
        user_list: formData.user_list,
        type: formData.type,
        priority: formData.priority,
        status: formData.status,
      };
      const res = await createConversation(payload);
      toast.success("Ticket created successfully!");
      handleCloseNewTicket();
      // Refresh conversations and tickets
      await loadConversations();
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to create ticket");
    } finally {
      setLoadingTicket(false);
    }
  };

  const [activeTab, setActiveTab] = useState("tickets");
  const tabs = [
    { label: "Tickets", value: "tickets" },
    { label: "Conversation", value: "conversation" },
  ];

  // Check if any filters are active
  const hasActiveFilters = 
    filters.status !== "all" ||
    filters.priority !== "all" ||
    filters.type !== "all" ||
    filters.startDate !== null ||
    filters.endDate !== null;

  // Apply filters to tickets
  const filteredTickets = tickets.filter((ticket) => {
    // Status filter
    if (filters.status !== "all") {
      const ticketStatus = ticket.status?.toLowerCase();
      const filterStatus = filters.status.toLowerCase();
      if (ticketStatus !== filterStatus) return false;
    }

    // Priority filter
    if (filters.priority !== "all") {
      const ticketPriority = ticket.priority?.toLowerCase();
      const filterPriority = filters.priority.toLowerCase();
      if (ticketPriority !== filterPriority) return false;
    }

    // Type filter
    if (filters.type !== "all") {
      const ticketType = ticket.ticket_type?.toLowerCase();
      const filterType = filters.type.toLowerCase();
      if (!ticketType?.includes(filterType)) return false;
    }

    // Date range filter
    if (filters.startDate || filters.endDate) {
      const ticketDate = new Date(ticket.last_updated);
      if (isNaN(ticketDate.getTime())) return false;

      if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        startDate.setHours(0, 0, 0, 0);
        if (ticketDate < startDate) return false;
      }

      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        if (ticketDate > endDate) return false;
      }
    }

    return true;
  });

  return (
    <AdminDashboardLayout>
      <div className="row y-gap-15 x-gap-10 items-center mb-5">
        <div className="col-auto">
          <h1 className="text-30 lh-14 fw-600">Customer Support</h1>
          <div className="text-14 text-light-1 lh-14">
            Manage support tickets and customer inquiries.
          </div>
        </div>
        <div className="col-auto ms-auto d-flex items-center gap-10">
          <button
            className={`button px-15 py-10 rounded-8 ${
              hasActiveFilters 
                ? "bg-blue-1 text-white" 
                : "border-blue-1 text-blue-1"
            }`}
            onClick={() => setOpenFilter(true)}
          >
            <Filter size={18} className="mr-10" /> Filter
            {hasActiveFilters && <span className="ml-5">({Object.values(filters).filter(v => v !== "all" && v !== null).length})</span>}
          </button>
          <Drawer anchor="right" open={openFilter} onClose={handleClose}>
            <div className="w-400 rounded-left rounded-8 bg-white px-20 py-20 h-100 d-flex flex-column justify-between">
              <div className="overflow-y-auto flex-grow-1">
                <h2 className="text-20 fw-600 mb-20">Filter Tickets</h2>
                <TicketFilter filters={filters} onFilterChange={handleFilterChange} />
              </div>
              <div className="col-12 d-flex justify-end gap-2 mt-20 pt-20 border-top-light">
                <button
                  className="border-light rounded-8 py-5 px-15 text-14"
                  onClick={handleResetFilters}
                >
                  Reset
                </button>
                <button
                  className="bg-blue-1 text-white rounded-8 py-5 px-15 text-14"
                  onClick={handleApplyFilters}
                >
                  Apply
                </button>
              </div>
            </div>
          </Drawer>
        </div>
        <div className="col-auto">
          <button 
            className="button bg-dark-blue text-white px-20 py-10 rounded-8"
            onClick={() => setOpenNewTicket(true)}
          >
            <ChatBubbleOutline className="mr-10 text-18" /> New Ticket
          </button>
        </div>
      </div>

      <DashboardCard data={cards} />

      <div className="row px-10 mb-20 mt-20">
        {tabs.map((item) => (
          <div className="col-auto px-5" key={item.value}>
            <button
              className={`text-14 px-10 fw-500 py-5 rounded-8 ${activeTab === item.value ? "bg-white" : "text-light-1"
                }`}
              onClick={() => setActiveTab(item.value)}
            >
              {item.label}
            </button>
          </div>
        ))}
      </div>

      <div className="py-20 px-30 rounded-8 bg-white shadow-3 h-100">
        {activeTab === "tickets" ? (
          <TicketList 
            tickets={filteredTickets}
            loading={loadingTickets}
            onSelectTicket={(conversationId) => {
              setSelectedTicketId(conversationId);
              setActiveTab("conversation");
            }} 
          />
        ) : (
          <Conversation 
            ticketId={selectedTicketId}
            onStatusUpdated={(newStatus) => {
              setTickets((prev) => prev.map((t) => 
                t.conversation_id === selectedTicketId 
                  ? { ...t, status: newStatus, last_updated: new Date().toISOString() } 
                  : t
              ));
            }}
          />
        )}
      </div>

      {/* New Ticket Dialog */}
      <Dialog
        open={openNewTicket}
        onClose={handleCloseNewTicket}
        aria-labelledby="new-ticket-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <div className="px-20 py-20">
          <h1 className="text-20 lh-14 fw-500 mb-5">Create New Ticket</h1>
          <div className="text-12 text-light-1 lh-14 mb-20">
            Create a new support ticket for a customer
          </div>

          <div className="row x-gap-10 y-gap-15">
            <FormInput
              label="Subject"
              required={true}
              type="text"
              placeholder="Enter ticket subject"
              gridClass="col-12"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <div className="col-12">
              <h1 className="text-14 lh-14 fw-500 mb-5">
                Customer<span className="text-red-1">*</span>
              </h1>
              <select
                className="form-select rounded-8 border-light py-10 px-15 w-100"
                value={formData.user_list}
                onChange={(e) => setFormData({ ...formData, user_list: e.target.value })}
                disabled={loadingCustomers}
              >
                <option value="">Select a customer</option>
                {customers.map((customer) => {
                  const name = customer.profile?.first_name && customer.profile?.last_name
                    ? `${customer.profile.first_name} ${customer.profile.last_name}`
                    : customer.email || `User ${customer.id}`;
                  return (
                    <option key={customer.id} value={String(customer.id)}>
                      {name} ({customer.email})
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="col-sm-6">
              <h1 className="text-14 lh-14 fw-500 mb-5">
                Type<span className="text-red-1">*</span>
              </h1>
              <select
                className="form-select rounded-8 border-light py-10 px-15 w-100"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="support">Support</option>
                <option value="general">General</option>
                <option value="booking">Booking</option>
                <option value="complaint">Complaint</option>
                <option value="inquiry">Inquiry</option>
              </select>
            </div>

            <div className="col-sm-6">
              <h1 className="text-14 lh-14 fw-500 mb-5">
                Priority<span className="text-red-1">*</span>
              </h1>
              <select
                className="form-select rounded-8 border-light py-10 px-15 w-100"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="col-12">
              <h1 className="text-14 lh-14 fw-500 mb-5">
                Status<span className="text-red-1">*</span>
              </h1>
              <select
                className="form-select rounded-8 border-light py-10 px-15 w-100"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="d-flex justify-end gap-2 mt-20">
            <button
              className="text-14 border-light rounded-8 px-15 py-8"
              onClick={handleCloseNewTicket}
              disabled={loadingTicket}
            >
              Cancel
            </button>
            <button
              className="text-14 bg-blue-1 text-white fw-500 rounded-8 px-15 py-8"
              onClick={handleCreateTicket}
              disabled={loadingTicket}
            >
              {loadingTicket ? "Creating..." : "Create Ticket"}
            </button>
          </div>
        </div>
      </Dialog>
    </AdminDashboardLayout>
  );
};

export default index;
