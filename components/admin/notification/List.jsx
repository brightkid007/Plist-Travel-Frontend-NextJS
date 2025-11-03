import { useState, useEffect } from "react";
import { Bell, MoreVertical, Edit, Trash2, Send } from "lucide-react";
import { getNotifications, deleteNotification, sendNotification, getNotificationById, updateNotification } from "@/helpers/backend_helper";
import { toast } from "react-toastify";
import { Dialog, Checkbox } from "@mui/material";
import FormInput from "@/components/common/form/FormInput";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const index = ({ filters = {} }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    message: "",
    audience: "",
    scheduledAt: null,
  });
  const [scheduleLater, setScheduleLater] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await getNotifications();
      const notificationsList = res?.notifications || res?.data?.notifications || res?.data || res || [];
      const mapped = notificationsList.map((n) => ({
        id: n.id,
        title: n.title || n.subject || "No title",
        audience: n.audience || n.target_audience || n.recipient_type || "All Users",
        sentDate: n.sent_at || n.sent_date || n.created_at || n.createdAt || "—",
        scheduledDate: n.scheduled_at || n.scheduled_date || null,
        status: n.status || "draft",
        opens: n.opens_count || n.opens || 0,
        clicks: n.clicks_count || n.clicks || 0,
        message: n.message || n.body || n.content || "",
      }));
      setNotifications(mapped);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to load notifications");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setNotificationToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!notificationToDelete) return;
    
    try {
      await deleteNotification(notificationToDelete);
      toast.success("Notification deleted successfully");
      loadNotifications();
      setDeleteDialogOpen(false);
      setNotificationToDelete(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to delete notification");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setNotificationToDelete(null);
  };

  const handleEditClick = async (id) => {
    try {
      const response = await getNotificationById(id);
      const notificationData = response?.notification || response?.data?.notification || response?.data || response || {};
      
      const scheduledAt = notificationData.scheduled_at || notificationData.scheduled_date;
      const hasScheduledDate = scheduledAt && new Date(scheduledAt) > new Date();

      setEditingNotification(notificationData);
      setEditFormData({
        title: notificationData.title || "",
        message: notificationData.message || notificationData.body || notificationData.content || "",
        audience: notificationData.audience || notificationData.target_audience || notificationData.recipient_type || "",
        scheduledAt: scheduledAt ? dayjs(scheduledAt) : null,
      });
      setScheduleLater(hasScheduledDate);
      setEditDialogOpen(true);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to load notification");
    }
  };

  const handleEditCancel = () => {
    setEditDialogOpen(false);
    setEditingNotification(null);
    setEditFormData({
      title: "",
      message: "",
      audience: "",
      scheduledAt: null,
    });
    setScheduleLater(false);
  };

  const handleEditSave = async () => {
    if (!editingNotification) return;

    setSaving(true);
    try {
      const payload = {
        title: editFormData.title,
        message: editFormData.message,
        body: editFormData.message,
        content: editFormData.message,
        audience: editFormData.audience || "all",
        target_audience: editFormData.audience || "all",
        recipient_type: editFormData.audience || "all",
        scheduled_at: scheduleLater && editFormData.scheduledAt 
          ? (editFormData.scheduledAt.toISOString ? editFormData.scheduledAt.toISOString() : (editFormData.scheduledAt.format ? editFormData.scheduledAt.format("YYYY-MM-DD HH:mm:ss") : dayjs(editFormData.scheduledAt).format("YYYY-MM-DD HH:mm:ss"))) 
          : null,
        scheduled_date: scheduleLater && editFormData.scheduledAt 
          ? (editFormData.scheduledAt.format ? editFormData.scheduledAt.format("YYYY-MM-DD HH:mm:ss") : dayjs(editFormData.scheduledAt).format("YYYY-MM-DD HH:mm:ss")) 
          : null,
      };

      await updateNotification(editingNotification.id, payload);
      toast.success("Notification updated successfully");
      handleEditCancel();
      loadNotifications();
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to update notification");
    } finally {
      setSaving(false);
    }
  };

  const handleSend = async (id) => {
    try {
      // Find the notification in the current list to validate it
      const notification = notifications.find(n => n.id === id);
      
      if (notification) {
        // Validate notification content using existing data
        const title = notification.title?.trim() || "";
        const message = notification.message?.trim() || "";
        
        // Check if title/message are invalid (empty or default values)
        if (!title || title === "No title" || title === "Untitled Notification" || 
            !message || message === "No message") {
          toast.error("Cannot send notification: Title and message must be valid. Please edit the notification first.");
          return;
        }
      }

      // If validation passes, send the notification
      const response = await sendNotification(id);
      const notificationStatus = response?.notification?.status || response?.data?.notification?.status || response?.status;
      const message = notificationStatus === "scheduled" 
        ? "Notification scheduled successfully!" 
        : "Notification sent successfully!";
      toast.success(message);
      loadNotifications();
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to send notification");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "—") return "—";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    } catch {
      return dateString;
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    // Search filter
    if (searchTerm) {
      const matchesSearch =
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;
    }

    // Status filter
    if (filters.status && filters.status !== "all") {
      if (n.status?.toLowerCase() !== filters.status.toLowerCase()) {
        return false;
      }
    }

    // Audience filter
    if (filters.audience && filters.audience !== "all") {
      const notificationAudience = n.audience?.toLowerCase() || "all";
      if (notificationAudience !== filters.audience.toLowerCase()) {
        return false;
      }
    }

    // Date range filter
    if (filters.startDate || filters.endDate) {
      const notificationDate = n.sentDate !== "—" ? new Date(n.sentDate) : new Date(n.scheduledDate || n.sentDate || Date.now());
      
      if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        startDate.setHours(0, 0, 0, 0);
        if (notificationDate < startDate) {
          return false;
        }
      }

      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        if (notificationDate > endDate) {
          return false;
        }
      }
    }

    return true;
  });

  if (loading) {
    return (
      <div className="d-flex justify-center items-center py-40">
        <div className="text-14 text-light-1">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="overflow-scroll scroll-bar-1">
      <div className="d-flex items-center justify-between mb-10 mt-5">
        <div className="position-relative d-flex items-center w-180 sm:w-full">
          <input
            type="text"
            placeholder="Search notifications..."
            className="border-light bg-white rounded-8 px-10 py-5 pl-30"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i
            className="icon-search text-light-1 position-absolute"
            style={{
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          ></i>
        </div>
        <button className="button border-light px-20 py-10 rounded-8">
          <Bell size={18} className="mr-10" /> View System Notifications
        </button>
      </div>
      <table className="table-2 col-12">
        <thead>
          <tr className="text-light-1 fw-600">
            <th>Title</th>
            <th>Audience</th>
            <th>Send Date</th>
            <th>Status</th>
            <th>Opens</th>
            <th>Clicks</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredNotifications.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-40">
                <div className="d-flex flex-column items-center gap-10">
                  <Bell size={32} className="text-light-1" />
                  <div className="text-16 text-light-1 fw-500">No notifications found.</div>
                  <div className="text-14 text-light-1">
                    {searchTerm ? "Try a different search term." : "Create your first notification to get started."}
                  </div>
                </div>
              </td>
            </tr>
          ) : (
            filteredNotifications.map((row) => (
              <tr key={row.id}>
                <td className="align-middle">{row.title}</td>
                <td className="align-middle">{row.audience}</td>
                <td className="align-middle">{formatDate(row.sentDate)}</td>
                <td className="align-middle">
                  <span
                    className={`rounded-100 px-10 py-5 text-center text-12 fw-500 ${
                      {
                        scheduled: "border-light text-dark-1",
                        sent: "bg-dark-blue text-white",
                        draft: "bg-light-2 text-dark-1",
                      }[row.status?.toLowerCase()] || "border-light text-dark-1"
                    }`}
                  >
                    {row.status?.charAt(0).toUpperCase() + row.status?.slice(1).toLowerCase() || "Draft"}
                  </span>
                </td>
                <td className="align-middle">{row.opens}</td>
                <td className="align-middle">{row.clicks}</td>
                <td className="align-middle px-10">
                  <div className="d-flex items-center justify-content-end">
                    {row.status?.toLowerCase() === "draft" && (
                      <button
                        onClick={() => handleSend(row.id)}
                        className="border-light rounded-8 px-10 py-10 cursor-pointer mr-5"
                        title="Send notification"
                      >
                        <Send size={14} className="text-dark-1" />
                      </button>
                    )}
                    <button
                      onClick={() => handleEditClick(row.id)}
                      className="border-light rounded-8 px-10 py-10 cursor-pointer mr-5"
                      title="Edit notification"
                    >
                      <Edit size={14} className="text-dark-1" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(row.id)}
                      className="border-light rounded-8 px-10 py-10 cursor-pointer"
                      title="Delete notification"
                    >
                      <Trash2 size={14} className="text-red-1" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <div className="px-20 py-20">
          <h2 id="delete-dialog-title" className="text-20 lh-14 fw-600 mb-10">
            Delete Notification
          </h2>
          <p id="delete-dialog-description" className="text-14 text-light-1 lh-20 mb-20">
            Are you sure you want to delete this notification? This action cannot be undone.
          </p>
          <div className="d-flex justify-end x-gap-10">
            <button
              className="border-light rounded-8 px-15 py-10 text-14 mr-10"
              onClick={handleDeleteCancel}
            >
              Cancel
            </button>
            <button
              className="bg-red-1 text-white rounded-8 px-15 py-10 text-14 fw-500"
              onClick={handleDeleteConfirm}
            >
              Delete
            </button>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={editDialogOpen}
        onClose={handleEditCancel}
        aria-labelledby="edit-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <div className="px-20 py-20">
          <h2 id="edit-dialog-title" className="text-20 lh-14 fw-600 mb-10">
            Edit Notification
          </h2>
          <div className="text-14 text-light-1 lh-14 mb-20">
            View and update notification details
          </div>

          <div className="row x-gap-10 y-gap-15">
            <FormInput
              type="text"
              label="Notification Title"
              required={true}
              placeholder="Enter notification title"
              gridClass="col-12"
              value={editFormData.title}
              onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
            />

            <FormInput
              type="textarea"
              label="Message"
              required={true}
              placeholder="Enter notification message"
              gridClass="col-12"
              value={editFormData.message}
              onChange={(e) => setEditFormData({ ...editFormData, message: e.target.value })}
            />

            <div className="col-12">
              <h1 className="text-14 lh-12 fw-500">
                Target Audience<span className="text-red-1">*</span>
              </h1>
              <select
                className="form-select w-full border-light rounded-8 text-14 px-20 py-10 mt-10"
                value={editFormData.audience}
                onChange={(e) => setEditFormData({ ...editFormData, audience: e.target.value })}
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
                    value={editFormData.scheduledAt}
                    onChange={(newValue) => {
                      setEditFormData({ ...editFormData, scheduledAt: newValue });
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

            {editingNotification && (
              <div className="col-12">
                <div className="bg-light-2 rounded-8 px-15 py-10">
                  <h3 className="text-14 fw-600 mb-10">Notification Details</h3>
                  <div className="d-flex flex-column y-gap-5">
                    <div className="d-flex items-center justify-between">
                      <span className="text-12 text-light-1">Status:</span>
                      <span className="text-12 fw-500">
                        {editingNotification.status?.charAt(0).toUpperCase() + editingNotification.status?.slice(1).toLowerCase() || "Draft"}
                      </span>
                    </div>
                    <div className="d-flex items-center justify-between">
                      <span className="text-12 text-light-1">Opens:</span>
                      <span className="text-12 fw-500">{editingNotification.opens_count || editingNotification.opens || 0}</span>
                    </div>
                    <div className="d-flex items-center justify-between">
                      <span className="text-12 text-light-1">Clicks:</span>
                      <span className="text-12 fw-500">{editingNotification.clicks_count || editingNotification.clicks || 0}</span>
                    </div>
                    {editingNotification.sent_at && (
                      <div className="d-flex items-center justify-between">
                        <span className="text-12 text-light-1">Sent At:</span>
                        <span className="text-12 fw-500">
                          {formatDate(editingNotification.sent_at)}
                        </span>
                      </div>
                    )}
                    {editingNotification.created_at && (
                      <div className="d-flex items-center justify-between">
                        <span className="text-12 text-light-1">Created At:</span>
                        <span className="text-12 fw-500">
                          {formatDate(editingNotification.created_at)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="d-flex justify-end gap-2 mt-20">
            <button
              className="border-light rounded-8 px-15 py-10 text-14"
              onClick={handleEditCancel}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              className="bg-dark-blue text-white rounded-8 px-15 py-10 text-14 fw-500"
              onClick={handleEditSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default index;
