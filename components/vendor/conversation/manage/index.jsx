"use client";

import React, { useState, useEffect } from "react";
import VendorDashboardLayout from "../../common/layout";
import { Dialog } from "@mui/material";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import {
  getMessageTemplates,
  createMessageTemplate,
  updateMessageTemplate,
  deleteMessageTemplate,
} from "@/helpers/backend_helper";

const Management = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [quickReplies, setQuickReplies] = useState([]);
  const [scheduledMessages, setScheduledMessages] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Map trigger_event to display title
  const triggerEventTitles = {
    inquiry_received: "Inquiry is received",
    booking_received: "Booking is received",
    "3_days_before_checkin": "3 days before check-in date",
    "1_day_after_checkout": "1 day after check-out date",
  };

  // Default scheduled messages with their trigger events
  const defaultScheduledMessages = [
    {
      title: "Inquiry is received",
      trigger_event: "inquiry_received",
      message: "Thank you for reaching out. A representative will get back to you shortly.",
    },
    {
      title: "Booking is received",
      trigger_event: "booking_received",
      message: "Your booking has been received and is being processed.",
    },
    {
      title: "3 days before check-in date",
      trigger_event: "3_days_before_checkin",
      message: "We look forward to your upcoming stay with us. See you soon!",
    },
    {
      title: "1 day after check-out date",
      trigger_event: "1_day_after_checkout",
      message: "Thank you for choosing us. We hope to welcome you back!",
    },
  ];

  // Load message templates
  const loadTemplates = async () => {
    try {
      setLoading(true);
      const response = await getMessageTemplates({ vendor_id: user?.id });
      const data = response?.message_templates || response?.data?.message_templates || [];
      
      // Separate quick replies and scheduled messages
      const quickReplyTemplates = data
        .filter((t) => t.type === "quick_reply")
        .map((t) => t.content);
      
      const scheduledMessageTemplates = data
        .filter((t) => t.type === "scheduled_message")
        .map((t) => ({
          id: t.id,
          title: triggerEventTitles[t.trigger_event] || t.title || t.trigger_event,
          trigger_event: t.trigger_event,
          message: t.content,
        }));

      setQuickReplies(quickReplyTemplates);
      setScheduledMessages(scheduledMessageTemplates);
    } catch (error) {
      console.error("Error loading templates:", error);
      toast.error(error?.message || "Failed to load message templates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadTemplates();
    }
  }, [user?.id]);

  const handleClose = () => {
    setShowModal(false);
    setEditingTemplate(null);
    setReplyText("");
  };

  const handleEditQuickReply = (index) => {
    const template = quickReplies[index];
    setEditingTemplate({ type: "quick_reply", index, content: template });
    setReplyText(template);
    setShowModal(true);
  };

  const handleEditScheduledMessage = (template) => {
    setEditingTemplate({ type: "scheduled_message", id: template.id, ...template });
    setReplyText(template.message);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!replyText.trim()) {
      toast.error("Please enter a message");
      return;
    }

    try {
      if (editingTemplate) {
        // Update existing template
        if (editingTemplate.type === "quick_reply") {
          // For quick replies, we need to find the template ID
          const response = await getMessageTemplates({ 
            vendor_id: user?.id, 
            type: "quick_reply" 
          });
          const templates = response?.message_templates || response?.data?.message_templates || [];
          const template = templates[editingTemplate.index];
          if (template) {
            await updateMessageTemplate(template.id, { content: replyText });
          }
        } else {
          // Scheduled message - update if exists, create if not
          if (editingTemplate.id) {
            await updateMessageTemplate(editingTemplate.id, { content: replyText });
          } else {
            // Create new scheduled message template
            await createMessageTemplate({
              type: "scheduled_message",
              title: editingTemplate.title,
              trigger_event: editingTemplate.trigger_event,
              content: replyText,
            });
          }
        }
        toast.success("Template updated successfully");
      } else {
        // Create new quick reply
        await createMessageTemplate({
          type: "quick_reply",
          content: replyText,
        });
        toast.success("Quick reply created successfully");
      }
      handleClose();
      loadTemplates();
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error(error?.message || "Failed to save template");
    }
  };

  const handleDeleteQuickReply = async (index) => {
    try {
      const response = await getMessageTemplates({ 
        vendor_id: user?.id, 
        type: "quick_reply" 
      });
      const templates = response?.message_templates || response?.data?.message_templates || [];
      const template = templates[index];
      if (template) {
        setTemplateToDelete({ ...template, index, type: "quick_reply" });
        setDeleteModalOpen(true);
      }
    } catch (error) {
      console.error("Error loading template:", error);
      toast.error("Failed to load template");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!templateToDelete) return;

    try {
      setDeleting(true);
      await deleteMessageTemplate(templateToDelete.id);
      toast.success(templateToDelete.type === "quick_reply" ? "Quick reply deleted successfully" : "Scheduled message deleted successfully");
      setDeleteModalOpen(false);
      setTemplateToDelete(null);
      loadTemplates();
    } catch (error) {
      console.error("Error deleting template:", error);
      toast.error(error?.message || "Failed to delete template");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setTemplateToDelete(null);
  };

  const dynamicFields = [
    { value: "{{property_name}}", label: "Name of booked property" },
    { value: "{{guest_first_name}}", label: "Guest First Name" },
    { value: "{{guest_last_name}}", label: "Guest Last Name" },
    { value: "{{check_in_date}}", label: "Check-in Date" },
    { value: "{{check_in_time}}", label: "Check-in Time" },
    { value: "{{check_out_date}}", label: "Check-out Date" },
    { value: "{{check_out_time}}", label: "Check-out Time" },
    { value: "{{booking_id}}", label: "Booking ID" },
    { value: "{{nights}}", label: "Total nights booked" },
  ];

  return (
    <VendorDashboardLayout>
      <div className="row y-gap-10 x-gap-20 justify-between">
        <div className="col-12 d-flex sm:d-block justify-between items-center mb-10">
          <div className="flex-shrink-0">
            <h1 className="text-30 lh-14 fw-600">Message Management</h1>
            <div className="text-15 text-light-1">
              Allow vendors to create quick replies and scheduled messages.
            </div>
          </div>
          <div className="flex-grow-0">
            <button
              className="button -md bg-blue-1 px-15 py-10 fw-400 text-14 text-white rounded-8"
              onClick={() => {
                setEditingTemplate(null);
                setReplyText("");
                setShowModal(true);
              }}
            >
              Create quick reply
            </button>
          </div>
        </div>

        <h1 className="text-20 lh-14 fw-600">Quick Replies</h1>
        <div className="col-12 px-10">
          <div className="bg-white rounded-8 border-light py-5">
            {loading ? (
              <div className="d-flex justify-center py-20">
                <CircularProgress />
              </div>
            ) : quickReplies.length === 0 ? (
              <div className="text-16 text-light-1 px-20 py-15">
                No quick replies yet. Create one to get started.
              </div>
            ) : (
              quickReplies.map((item, index) => (
                <React.Fragment key={index}>
                  <div className="d-flex justify-between items-start gap-2 px-20 py-15">
                    <div className="text-16 lh-14 flex-1">{item}</div>
                    <div className="d-flex gap-10 items-center">
                      <button
                        className="border-0 bg-transparent cursor-pointer p-0 d-flex items-center justify-center"
                        onClick={() => handleEditQuickReply(index)}
                        title="Edit"
                        style={{ width: "32px", height: "32px" }}
                      >
                        <span className="material-symbols-outlined text-blue-1" style={{ fontSize: "20px" }}>
                          edit
                        </span>
                      </button>
                      <button
                        className="border-0 bg-transparent cursor-pointer p-0 d-flex items-center justify-center"
                        onClick={() => handleDeleteQuickReply(index)}
                        title="Delete"
                        style={{ width: "32px", height: "32px" }}
                      >
                        <span className="material-symbols-outlined text-red-1" style={{ fontSize: "20px" }}>
                          delete
                        </span>
                      </button>
                    </div>
                  </div>
                  {index === quickReplies.length - 1 ? null : (
                    <div className="border-top-light"></div>
                  )}
                </React.Fragment>
              ))
            )}
          </div>
        </div>

        <Dialog
          open={showModal}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-title"
        >
          <div className="px-20 py-20" style={{ width: "500px" }}>
            <h1 className="text-20 fw-500 mb-10">
              {editingTemplate ? "Edit" : "Create"} {editingTemplate?.type === "scheduled_message" ? "Scheduled Message" : "Quick Reply"}
            </h1>
            <div className="d-flex items-center flex-wrap gap-2 mb-10">
              {dynamicFields.map((item, index) => (
                <span
                  className="text-12 fw-500 rounded-100 bg-blue-2 px-10 text-blue-1 cursor-pointer"
                  key={index}
                  onClick={() => setReplyText(replyText + item.value)}
                >
                  {item.label}
                </span>
              ))}
            </div>
            <textarea
              className="text-14 border-light rounded-8 bg-white px-10 py-5 mb-10"
              style={{ width: "100%", minHeight: "120px" }}
              placeholder="Enter your message"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <div className="d-flex justify-end gap-2">
              <button
                className="text-14 border-light rounded-8 px-10 py-5"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                className="text-14 bg-blue-1 text-white fw-500 rounded-8 px-10 py-5"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </Dialog>

        <h1 className="text-20 lh-14 fw-600">Scheduled Messages</h1>
        <div className="col-12 px-10">
          <div className="bg-white rounded-8 border-light py-5">
            {loading ? (
              <div className="d-flex justify-center py-20">
                <CircularProgress />
              </div>
            ) : (
              defaultScheduledMessages.map((defaultMsg, index) => {
                const savedMsg = scheduledMessages.find(
                  (m) => m.trigger_event === defaultMsg.trigger_event
                );
                const displayMsg = savedMsg || defaultMsg;
                
                return (
                  <React.Fragment key={defaultMsg.trigger_event}>
                    <div className="d-flex justify-between items-start gap-2 px-20 py-15">
                      <div className="text-16 lh-14 w-25">{displayMsg.title}</div>
                      <div className="w-75 d-flex justify-between items-start gap-2">
                        <div className="text-16 lh-14 text-light-1 flex-1">
                          {displayMsg.message}
                        </div>
                        <button
                          className="border-0 bg-transparent cursor-pointer p-0 d-flex items-center justify-center"
                          onClick={() => handleEditScheduledMessage(displayMsg)}
                          title="Edit"
                          style={{ width: "32px", height: "32px" }}
                        >
                          <span className="material-symbols-outlined text-blue-1" style={{ fontSize: "20px" }}>
                            edit
                          </span>
                        </button>
                      </div>
                    </div>
                    {index === defaultScheduledMessages.length - 1 ? null : (
                      <div className="border-top-light"></div>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </div>
        </div>
      </div>
      <div style={{ height: "50px" }}></div>

      <ConfirmationModal
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title={templateToDelete?.type === "quick_reply" ? "Delete Quick Reply" : "Delete Scheduled Message"}
        message={`Are you sure you want to delete ${templateToDelete?.type === "quick_reply" ? "this quick reply" : "this scheduled message"}?`}
        itemName={templateToDelete?.content?.substring(0, 50) || "template"}
        loading={deleting}
        confirmLabel="Delete"
        confirmingLabel="Deleting..."
      />
    </VendorDashboardLayout>
  );
};

export default Management;
