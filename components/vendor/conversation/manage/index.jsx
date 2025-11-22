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
  const [showScheduledModal, setShowScheduledModal] = useState(false);
  const [scheduledFormData, setScheduledFormData] = useState({
    title: "",
    trigger_event: "",
    content: "",
  });

  // Map trigger_event to display title
  const triggerEventTitles = {
    inquiry_received: "Inquiry is received",
    booking_received: "Booking is received",
    "3_days_before_checkin": "3 days before check-in date",
    "1_day_after_checkout": "1 day after check-out date",
  };


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
          title: t.title || triggerEventTitles[t.trigger_event] || t.trigger_event,
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
    setScheduledFormData({
      title: template.title || triggerEventTitles[template.trigger_event] || "",
      trigger_event: template.trigger_event || "",
      content: template.message || template.content || "",
    });
    setShowScheduledModal(true);
  };

  const handleDeleteScheduledMessage = (template) => {
    if (template.id) {
      setTemplateToDelete({ ...template, type: "scheduled_message" });
      setDeleteModalOpen(true);
    } else {
      toast.info("This is a default message. You can only edit it, not delete it.");
    }
  };

  const handleCreateScheduledMessage = () => {
    setScheduledFormData({
      title: "",
      trigger_event: "",
      content: "",
    });
    setShowScheduledModal(true);
  };

  const handleSaveScheduledMessage = async () => {
    if (!scheduledFormData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (!scheduledFormData.trigger_event) {
      toast.error("Please select a trigger event");
      return;
    }
    if (!scheduledFormData.content.trim()) {
      toast.error("Please enter message content");
      return;
    }

    try {
      if (editingTemplate && editingTemplate.id) {
        // Update existing
        await updateMessageTemplate(editingTemplate.id, {
          title: scheduledFormData.title,
          trigger_event: scheduledFormData.trigger_event,
          content: scheduledFormData.content,
        });
        toast.success("Scheduled message updated successfully");
      } else {
        // Create new
        await createMessageTemplate({
          type: "scheduled_message",
          title: scheduledFormData.title,
          trigger_event: scheduledFormData.trigger_event,
          content: scheduledFormData.content,
        });
        toast.success("Scheduled message created successfully");
      }
      setShowScheduledModal(false);
      setEditingTemplate(null);
      setScheduledFormData({ title: "", trigger_event: "", content: "" });
      loadTemplates();
    } catch (error) {
      console.error("Error saving scheduled message:", error);
      toast.error(error?.message || "Failed to save scheduled message");
    }
  };

  const handleSave = async () => {
    if (!replyText.trim()) {
      toast.error("Please enter a message");
      return;
    }

    try {
      if (editingTemplate) {
        // Update existing quick reply template
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
            toast.success("Quick reply updated successfully");
          }
        }
        // Note: Scheduled messages are handled by handleSaveScheduledMessage
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
        </div>

        <div className="col-12 d-flex sm:d-block justify-between items-center">
          <h1 className="text-20 lh-14 fw-600">Quick Replies</h1>
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

        <div className="col-12 d-flex sm:d-block justify-between items-center mt-10">
          <h1 className="text-20 lh-14 fw-600">Scheduled Messages</h1>
          <div className="flex-grow-0">
            <button
              className="button -md bg-blue-1 px-15 py-10 fw-400 text-14 text-white rounded-8"
              onClick={handleCreateScheduledMessage}
            >
              Create Scheduled Message
            </button>
          </div>
        </div>
        <div className="col-12 px-10">
          <div className="bg-white rounded-8 border-light py-5">
            {loading ? (
              <div className="d-flex justify-center py-20">
                <CircularProgress />
              </div>
            ) : scheduledMessages.length === 0 ? (
              <div className="text-16 text-light-1 px-20 py-15">
                No scheduled messages yet. Create one to get started.
              </div>
            ) : (
              scheduledMessages.map((msg, index) => (
                <React.Fragment key={msg.id || msg.trigger_event}>
                  <div className="d-flex justify-between items-start gap-2 px-20 py-15">
                    <div className="text-16 lh-14 w-25">{msg.title}</div>
                    <div className="w-75 d-flex justify-between items-start gap-2">
                      <div className="text-16 lh-14 text-light-1 flex-1">
                        {msg.message}
                      </div>
                      <div className="d-flex gap-10 items-center">
                        <button
                          className="border-0 bg-transparent cursor-pointer p-0 d-flex items-center justify-center"
                          onClick={() => handleEditScheduledMessage(msg)}
                          title="Edit"
                          style={{ width: "32px", height: "32px" }}
                        >
                          <span className="material-symbols-outlined text-blue-1" style={{ fontSize: "20px" }}>
                            edit
                          </span>
                        </button>
                        <button
                          className="border-0 bg-transparent cursor-pointer p-0 d-flex items-center justify-center"
                          onClick={() => handleDeleteScheduledMessage(msg)}
                          title="Delete"
                          style={{ width: "32px", height: "32px" }}
                        >
                          <span className="material-symbols-outlined text-red-1" style={{ fontSize: "20px" }}>
                            delete
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                  {index === scheduledMessages.length - 1 ? null : (
                    <div className="border-top-light"></div>
                  )}
                </React.Fragment>
              ))
            )}
          </div>
        </div>
      </div>
      <div style={{ height: "50px" }}></div>

      <Dialog
        open={showScheduledModal}
        onClose={() => {
          setShowScheduledModal(false);
          setEditingTemplate(null);
          setScheduledFormData({ title: "", trigger_event: "", content: "" });
        }}
        aria-labelledby="scheduled-message-dialog-title"
      >
        <div className="px-20 py-20" style={{ width: "500px" }}>
          <h1 className="text-20 fw-500 mb-10">
            {editingTemplate?.id ? "Edit" : "Create"} Scheduled Message
          </h1>
          
          <div className="mb-10">
            <label className="text-14 fw-500 mb-5 d-block">Title</label>
            <input
              type="text"
              className="text-14 border-light rounded-8 bg-white px-10 py-5 w-100"
              placeholder="e.g., Inquiry is received"
              value={scheduledFormData.title}
              onChange={(e) => setScheduledFormData({ ...scheduledFormData, title: e.target.value })}
            />
          </div>

          <div className="mb-10">
            <label className="text-14 fw-500 mb-5 d-block">Trigger Event</label>
            <select
              className="text-14 border-light rounded-8 bg-white px-10 py-5 w-100"
              value={scheduledFormData.trigger_event}
              onChange={(e) => setScheduledFormData({ ...scheduledFormData, trigger_event: e.target.value })}
            >
              <option value="">Select trigger event</option>
              <option value="inquiry_received">Inquiry is received</option>
              <option value="booking_received">Booking is received</option>
              <option value="3_days_before_checkin">3 days before check-in date</option>
              <option value="1_day_after_checkout">1 day after check-out date</option>
            </select>
          </div>

          <div className="mb-10">
            <label className="text-14 fw-500 mb-5 d-block">Message Content</label>
            <div className="d-flex items-center flex-wrap gap-2 mb-5">
              {dynamicFields.map((item, index) => (
                <span
                  className="text-12 fw-500 rounded-100 bg-blue-2 px-10 text-blue-1 cursor-pointer"
                  key={index}
                  onClick={() => setScheduledFormData({ 
                    ...scheduledFormData, 
                    content: scheduledFormData.content + item.value 
                  })}
                >
                  {item.label}
                </span>
              ))}
            </div>
            <textarea
              className="text-14 border-light rounded-8 bg-white px-10 py-5 w-100"
              style={{ minHeight: "120px" }}
              placeholder="Enter your message"
              value={scheduledFormData.content}
              onChange={(e) => setScheduledFormData({ ...scheduledFormData, content: e.target.value })}
            />
          </div>

          <div className="d-flex justify-end gap-2">
            <button
              className="text-14 border-light rounded-8 px-10 py-5"
              onClick={() => {
                setShowScheduledModal(false);
                setEditingTemplate(null);
                setScheduledFormData({ title: "", trigger_event: "", content: "" });
              }}
            >
              Cancel
            </button>
            <button
              className="text-14 bg-blue-1 text-white fw-500 rounded-8 px-10 py-5"
              onClick={handleSaveScheduledMessage}
            >
              Save
            </button>
          </div>
        </div>
      </Dialog>

      <ConfirmationModal
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title={templateToDelete?.type === "quick_reply" ? "Delete Quick Reply" : "Delete Scheduled Message"}
        message={`Are you sure you want to delete ${templateToDelete?.type === "quick_reply" ? "this quick reply" : "this scheduled message"}?`}
        itemName={templateToDelete?.content?.substring(0, 50) || templateToDelete?.title || "template"}
        loading={deleting}
        confirmLabel="Delete"
        confirmingLabel="Deleting..."
      />
    </VendorDashboardLayout>
  );
};

export default Management;
