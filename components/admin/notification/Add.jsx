import FormInput from "@/components/common/form/FormInput";
import { Checkbox } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from "react";
import { createNotification } from "@/helpers/backend_helper";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const NotificationComposer = ({ onSuccess }) => {
  const [scheduleLater, setScheduleLater] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    audience: "",
    scheduledAt: null,
  });

  const isFormValid = () => {
    return formData.title.trim() && formData.message.trim();
  };

  const isFormEmpty = () => {
    return !formData.title.trim() && !formData.message.trim() && !formData.audience;
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      message: "",
      audience: "",
      scheduledAt: null,
    });
    setScheduleLater(false);
    if (onSuccess) onSuccess();
  };

  const handleSaveDraft = async () => {
    setLoading(true);
    try {
      const payload = {
        title: formData.title.trim() || "",
        message: formData.message.trim() || "",
        body: formData.message.trim() || "",
        content: formData.message.trim() || "",
        audience: formData.audience || "all",
        target_audience: formData.audience || "all",
        recipient_type: formData.audience || "all",
        push_notification: true,
        status: "draft",
        scheduled_at: scheduleLater && formData.scheduledAt ? (formData.scheduledAt.toISOString ? formData.scheduledAt.toISOString() : formData.scheduledAt.format("YYYY-MM-DD HH:mm:ss")) : null,
        scheduled_date: scheduleLater && formData.scheduledAt ? (formData.scheduledAt.format ? formData.scheduledAt.format("YYYY-MM-DD HH:mm:ss") : dayjs(formData.scheduledAt).format("YYYY-MM-DD HH:mm:ss")) : null,
      };
      await createNotification(payload);
      toast.success("Notification saved as draft");
      // Reset form
      setFormData({
        title: "",
        message: "",
        audience: "",
        scheduledAt: null,
      });
      setScheduleLater(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to save notification");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a notification title");
      return;
    }
    if (!formData.message.trim()) {
      toast.error("Please enter a notification message");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        message: formData.message,
        body: formData.message,
        content: formData.message,
        audience: formData.audience || "all",
        target_audience: formData.audience || "all",
        recipient_type: formData.audience || "all",
        push_notification: true,
        status: scheduleLater && formData.scheduledAt ? "scheduled" : "sent",
        scheduled_at: scheduleLater && formData.scheduledAt ? (formData.scheduledAt.toISOString ? formData.scheduledAt.toISOString() : formData.scheduledAt.toString()) : null,
        scheduled_date: scheduleLater && formData.scheduledAt ? (formData.scheduledAt.format ? formData.scheduledAt.format("YYYY-MM-DD HH:mm:ss") : dayjs(formData.scheduledAt).format("YYYY-MM-DD HH:mm:ss")) : null,
      };
      await createNotification(payload);
      toast.success(scheduleLater ? "Notification scheduled successfully" : "Notification sent successfully");
      // Reset form
      setFormData({
        title: "",
        message: "",
        audience: "",
        scheduledAt: null,
      });
      setScheduleLater(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to send notification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row x-gap-20 y-gap-20">
      <div className="col-12 mt-10">
        <h1 className="text-20 lh-14 fw-600">Notification Composer</h1>
        <div className="text-14 text-light-1 lh-14">
          Create and send notifications to users
        </div>
      </div>

      <FormInput
        type="text"
        label="Notification Title"
        required={true}
        placeholder="Enter notification title"
        gridClass="col-12"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />

      <FormInput
        type="textarea"
        label="Message"
        required={true}
        placeholder="Enter notification message"
        gridClass="col-12"
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
      />

      <div className="col-12">
        <h1 className="text-14 lh-12 fw-500">
          Target Audience<span className="text-red-1">*</span>
        </h1>
        <select
          className="form-select w-full border-light rounded-8 text-14 px-20 py-10 mt-10"
          value={formData.audience}
          onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
        >
          <option value="">Select audience</option>
          <option value="all">All Users</option>
          <option value="customer">Customers</option>
          <option value="vendor">Vendors</option>
          <option value="agent">Agents</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <div className="col-12">
        <h1 className="text-14 lh-12 fw-500">Scheduling</h1>
        <div className="d-flex gap-2 items-center mt-5 mb-5">
          <Checkbox
            className="px-0 py-0"
            checked={scheduleLater}
            onChange={(e) => setScheduleLater(e.target.checked)}
          />
          <div className="text-14 lh-14 fw-500">Schedule for later</div>
        </div>
        {scheduleLater && (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              value={formData.scheduledAt ? dayjs(formData.scheduledAt) : null}
              onChange={(newValue) => {
                setFormData({ ...formData, scheduledAt: newValue });
              }}
              slotProps={{
                textField: {
                  sx: {
                    width: "100%",
                    "& .MuiPickersInputBase-root": { height: 45 },
                  },
                },
              }}
            />
          </LocalizationProvider>
        )}
      </div>

      <div className="col-12 mt-5 d-flex justify-end gap-3 mb-10">
        <button
          className="border-light rounded-8 text-14 py-5 px-15 w-full"
          onClick={isFormValid() ? handleSaveDraft : handleCancel}
          disabled={loading}
        >
          {loading ? "Saving..." : isFormValid() ? "Save as Draft" : "Cancel"}
        </button>
        <button
          className="bg-dark-blue text-white rounded-8 text-14 py-5 px-15 w-full"
          onClick={isFormValid() ? handleSend : handleSaveDraft}
          disabled={loading}
        >
          {loading 
            ? (scheduleLater ? "Scheduling..." : "Sending...") 
            : isFormValid() 
              ? (scheduleLater ? "Schedule Notification" : "Send Notification")
              : "Draft"}
        </button>
      </div>
    </div>
  );
};

export default NotificationComposer;
