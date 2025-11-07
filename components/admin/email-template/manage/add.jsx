"use client";

import AgentDashboardLayout from "../../common/layout";
import { Copy, Eye } from "lucide-react";
import { Telegram } from "@mui/icons-material";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Dialog } from "@mui/material";
import { createEmailTemplate, updateEmailTemplate, getEmailTemplateById } from "@/helpers/backend_helper";
import { toast } from "react-toastify";

const index = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditMode = !!editId;

  const dynamicFields = [
    { value: "{{client_name}}", label: "Client's full name" },
    { value: "{{booking_id}}", label: "Booking reference number" },
    { value: "{{booking_date}}", label: "Date of booking" },
    { value: "{{travel_date}}", label: "Date of travel" },
    { value: "{{service_type}}", label: "Type of service booked" },
    { value: "{{service_details}}", label: "Details of the service" },
    { value: "{{total_amount}}", label: "Total amount" },
  ];

  const contentTextareaRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "Booking",
    subject: "",
    content: "",
  });

  const [type, setType] = useState("text"); // "text" or "html"
  const [status, setStatus] = useState("Active");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [testEmail, setTestEmail] = useState("");

  // Load template data when in edit mode
  useEffect(() => {
    const loadTemplateData = async () => {
      if (!isEditMode || !editId) return;

      try {
        setLoadingData(true);
        const res = await getEmailTemplateById(editId);
        const template = res?.email_template || res?.data?.email_template || res?.data || res || {};

        setFormData({
          name: template.name || "",
          category: template.category || "Booking",
          subject: template.subject || "",
          content: template.content || template.body || "",
        });
        setType(template.type || "text");
        setStatus(template.status || "Active");
      } catch (error) {
        toast.error(error?.message || "Failed to load template");
        router.push("/admin/email-template");
      } finally {
        setLoadingData(false);
      }
    };

    loadTemplateData();
  }, [isEditMode, editId, router]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePlaceholderClick = (placeholder) => {
    // Copy to clipboard
    navigator.clipboard.writeText(placeholder);
    toast.success("Placeholder copied to clipboard!");

    // Insert into content textarea at cursor position
    const textarea = contentTextareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = formData.content;
      const newText = text.substring(0, start) + placeholder + text.substring(end);
      handleChange("content", newText);
      
      // Set cursor position after inserted text
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + placeholder.length, start + placeholder.length);
      }, 0);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      category: "Booking",
      subject: "",
      content: "",
    });
    setType("text");
    toast.info("Form reset");
  };

  const handlePreview = () => {
    if (!formData.subject.trim() || !formData.content.trim()) {
      toast.error("Please fill in subject and content to preview");
      return;
    }
    setPreviewOpen(true);
  };

  const handleSave = async () => {
    // Validation
    if (!formData.name.trim()) {
      toast.error("Please enter a template name");
      return;
    }
    if (!formData.subject.trim()) {
      toast.error("Please enter an email subject");
      return;
    }
    if (!formData.content.trim()) {
      toast.error("Please enter email content");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        subject: formData.subject.trim(),
        body: formData.content.trim(),
        content: formData.content.trim(),
        type: type,
        status: status,
      };

      if (isEditMode && editId) {
        await updateEmailTemplate(editId, payload);
        toast.success("Email template updated successfully!");
      } else {
        await createEmailTemplate(payload);
        toast.success("Email template created successfully!");
      }
      router.push("/admin/email-template");
    } catch (error) {
      toast.error(error?.message || `Failed to ${isEditMode ? "update" : "create"} email template`);
    } finally {
      setLoading(false);
    }
  };

  const handleSendTestEmail = () => {
    if (!testEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }
    // TODO: Implement test email functionality if backend supports it
    toast.info("Test email functionality coming soon");
  };

  return (
    <AgentDashboardLayout>
      <div className="row y-gap-10 x-gap-10 items-center mb-10">
        <div className="col-auto">
          <h1 className="text-30 lh-14 fw-600">Email Templates</h1>
          <div className="text-14 lh-14 text-light-1">
            Create and manage email templates for client communications
          </div>
        </div>
        <div className="col-auto ms-auto">
          <button
            className="button border-light px-15 py-10 rounded-8"
            onClick={() => router.push("/admin/email-template")}
          >
            Back
          </button>
        </div>
      </div>

      <div className="row y-gap-10 x-gap-10 mt-10">
        <div className="col-sm-6">
          <div className="bg-white rounded-8 border-light px-20 py-15 h-100">
            <h1 className="text-24 lh-14 fw-500">{isEditMode ? "Edit Template" : "Create New Template"}</h1>
            <div className="text-14 lh-14 text-light-1">
              {isEditMode ? "Update email template for client communications" : "Create a new email template for client communications"}
            </div>
            {loadingData && (
              <div className="text-14 text-light-1 mt-10">Loading template data...</div>
            )}
            <div className="row y-gap-10 x-gap-10 mt-10">
              <div className="col-sm-6">
                <h1 className="text-14 lh-14 fw-500">
                  Template Name<span className="text-red-1">*</span>
                </h1>
                <input
                  className="border-light rounded-8 h-45 px-15 w-100 mt-5"
                  type="text"
                  placeholder="e.g. Booking Confirmation"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>

              <div className="col-sm-6">
                <h1 className="text-14 lh-14 fw-500">
                  Category<span className="text-red-1">*</span>
                </h1>
                <select
                  className="form-select rounded-8 border-light h-45 px-15 w-100 mt-5"
                  value={formData.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                >
                  <option value="Booking">Booking</option>
                  <option value="Payment">Payment</option>
                  <option value="User">User</option>
                  <option value="Refund">Refund</option>
                  <option value="Technical">Technical</option>
                  <option value="Commission">Commission</option>
                </select>
              </div>

              <div className="col-12">
                <h1 className="text-14 lh-14 fw-500">
                  Email Subject<span className="text-red-1">*</span>
                </h1>
                <input
                  className="border-light rounded-8 py-5 px-15 w-100 mt-5"
                  type="text"
                  placeholder="e.g. Your booking has been confirmed"
                  value={formData.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                />
              </div>

              <div className="col-sm-6">
                <h1 className="text-14 lh-14 fw-500">
                  Template Type<span className="text-red-1">*</span>
                </h1>
                <select
                  className="form-select rounded-8 border-light h-45 px-15 w-100 mt-5"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="text">Text</option>
                  <option value="html">HTML</option>
                </select>
              </div>

              <div className="col-sm-6">
                <h1 className="text-14 lh-14 fw-500">
                  Status<span className="text-red-1">*</span>
                </h1>
                <select
                  className="form-select rounded-8 border-light h-45 px-15 w-100 mt-5"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="col-12">
                <h1 className="text-14 lh-14 fw-500">
                  Email Content<span className="text-red-1">*</span>
                </h1>
                <textarea
                  ref={contentTextareaRef}
                  className="border-light rounded-8 py-5 px-15 w-100 mt-5"
                  placeholder="Enter your email content here..."
                  rows={8}
                  value={formData.content}
                  onChange={(e) => handleChange("content", e.target.value)}
                />
              </div>

              <div className="row x-gap-10 y-gap-10 mt-10">
                <div className="col-sm-auto">
                  <button
                    className="text-14 fw-500 border-light rounded-8 px-15 py-5"
                    onClick={handleReset}
                    disabled={loading}
                  >
                    Reset
                  </button>
                </div>
                <div className="col-sm-auto ms-auto">
                  <button
                    className="text-14 fw-500 border-light rounded-8 px-15 py-5 d-flex items-center gap-1"
                    onClick={handlePreview}
                    disabled={loading}
                  >
                    <Eye size={18} /> Preview
                  </button>
                </div>
                <div className="col-sm-auto">
                  <button
                    className="text-14 bg-blue-1 text-white rounded-8 px-15 py-5 fw-400"
                    onClick={handleSave}
                    disabled={loading || loadingData}
                  >
                    {loading ? (isEditMode ? "Updating..." : "Saving...") : (isEditMode ? "Update Template" : "Save Template")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-6">
          <div className="bg-white rounded-8 border-light px-20 py-15 h-100">
            <h1 className="text-24 lh-14 fw-500">Placeholders</h1>
            <div className="text-14 lh-14 text-light-1">
              Insert dynamic content in your template
            </div>
            <div className="text-14 lh-14 fw-500 mt-10">
              Available Placeholders
            </div>
            {dynamicFields.map((item, index) => (
              <button
                className="text-14 border-light bg-white rounded-8 w-100 px-15 py-5 fw-400 mt-10 cursor-pointer"
                key={index}
                onClick={() => handlePlaceholderClick(item.value)}
                title="Click to insert placeholder"
              >
                <div className="d-flex justify-between items-center">
                  <div className="d-flex flex-column items-start">
                    <div className="text-14 lh-14">{item.value}</div>
                    <div className="text-12 lh-14 text-light-1">
                      {item.label}
                    </div>
                  </div>
                  <Copy size={16} className="text-light-1" />
                </div>
              </button>
            ))}

            <div className="text-14 lh-14 fw-500 mt-15">Send Test Email</div>

            <div className="d-flex items-center gap-2 mt-5">
              <input
                type="email"
                className="border-light rounded-8 px-15 w-100 h-45"
                placeholder="Enter email address"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
              <button
                className="text-14 border-light rounded-8 size-45 fw-400 cursor-pointer"
                onClick={handleSendTestEmail}
                disabled={loading}
                title="Send test email"
              >
                <Telegram />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
        <div className="px-20 py-20">
          <h1 className="text-20 fw-500 mb-10">Email Template Preview</h1>
          <div className="mb-10">
            <div className="text-14 text-light-1 mb-5">
              <strong>Subject:</strong> {formData.subject || "—"}
            </div>
            <div className="text-14 text-light-1">
              <strong>Category:</strong> {formData.category}
            </div>
          </div>
          <div className="border-light rounded-8 p-15 bg-light-2">
            {type === "text" ? (
              <div
                className="text-14 lh-20"
                dangerouslySetInnerHTML={{
                  __html: (formData.content || "").replace(/\n/g, "<br/>"),
                }}
              />
            ) : (
              <div
                className="text-14"
                dangerouslySetInnerHTML={{
                  __html: formData.content || "",
                }}
              />
            )}
          </div>
          <div className="d-flex justify-end mt-20">
            <button
              className="border-light rounded-8 px-15 py-10 text-14"
              onClick={() => setPreviewOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </Dialog>
    </AgentDashboardLayout>
  );
};

export default index;
