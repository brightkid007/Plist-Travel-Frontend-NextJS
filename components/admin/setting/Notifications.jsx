import { useEffect, useState } from "react";
import { Switch } from "@mui/material";
import { BellRing } from "lucide-react";
import { toast } from "react-toastify";
import { getSystemSettings, updateSystemSettings } from "@/helpers/backend_helper";

const Notifications = () => {
  const [emailNewBookings, setEmailNewBookings] = useState(false);
  const [emailNewUsers, setEmailNewUsers] = useState(false);
  const [emailPayments, setEmailPayments] = useState(false);
  const [emailRefunds, setEmailRefunds] = useState(false);
  const [emailSupportTickets, setEmailSupportTickets] = useState(false);

  const [alertSecurity, setAlertSecurity] = useState(false);
  const [alertPerformance, setAlertPerformance] = useState(false);
  const [alertSystemErrors, setAlertSystemErrors] = useState(false);
  const [alertSystemUpdates, setAlertSystemUpdates] = useState(false);

  const [alertRecipients, setAlertRecipients] = useState("");

  const parseBool = (v, def = false) => {
    if (typeof v === "boolean") return v;
    if (v === undefined || v === null) return def;
    const s = String(v).toLowerCase();
    return s === "true" || s === "1" || s === "yes";
  };

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getSystemSettings();
        const data = response?.settings || response?.data?.settings || {};
        const g = (k) => data?.[k]?.value ?? data?.[k];

        setEmailNewBookings(parseBool(g("emailNotifyNewBookings"), false));
        setEmailNewUsers(parseBool(g("emailNotifyNewUserRegistrations"), false));
        setEmailPayments(parseBool(g("emailNotifyPaymentConfirmations"), false));
        setEmailRefunds(parseBool(g("emailNotifyRefundRequests"), false));
        setEmailSupportTickets(parseBool(g("emailNotifySupportTickets"), false));

        setAlertSecurity(parseBool(g("alertSecurityAlerts"), false));
        setAlertPerformance(parseBool(g("alertPerformanceIssues"), false));
        setAlertSystemErrors(parseBool(g("alertSystemErrors"), false));
        setAlertSystemUpdates(parseBool(g("alertSystemUpdates"), false));

        setAlertRecipients((g("alertEmailRecipients") || "").toString());
      } catch (_) {
        // keep defaults
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    try {
      await updateSystemSettings({
        emailNotifyNewBookings: String(emailNewBookings),
        emailNotifyNewUserRegistrations: String(emailNewUsers),
        emailNotifyPaymentConfirmations: String(emailPayments),
        emailNotifyRefundRequests: String(emailRefunds),
        emailNotifySupportTickets: String(emailSupportTickets),

        alertSecurityAlerts: String(alertSecurity),
        alertPerformanceIssues: String(alertPerformance),
        alertSystemErrors: String(alertSystemErrors),
        alertSystemUpdates: String(alertSystemUpdates),

        alertEmailRecipients: alertRecipients,
      });
      toast.success("Notification settings saved");
    } catch (e) {
      toast.error(typeof e === "string" ? e : "Failed to save settings");
    }
  };
  return (
    <div className="row y-gap-20 bg-white px-10 py-10 rounded-8">
      <div className="col-12">
        <div className="text-20 fw-600 lh-14 d-flex items-center gap-2">
          <BellRing size={18} /> Notification Settings
        </div>
        <div className="text-14 text-light-1">
          Configure system notifications and alerts
        </div>
      </div>

      <div className="col-12 mt-5 border-bottom-light mb-20 pb-20">
        <div className="text-18 lh-14 fw-500 mb-10">Email Notifications</div>
        <div className="d-flex items-center justify-between h-30">
          <div className="text-14 lh-12 fw-500">New Bookings</div>
          <Switch checked={emailNewBookings} onChange={(e) => setEmailNewBookings(e.target.checked)} />
        </div>
        <div className="d-flex items-center justify-between h-30">
          <div className="text-14 lh-12 fw-500">New User Registrations</div>
          <Switch checked={emailNewUsers} onChange={(e) => setEmailNewUsers(e.target.checked)} />
        </div>
        <div className="d-flex items-center justify-between h-30">
          <div className="text-14 lh-12 fw-500">Payment Confirmations</div>
          <Switch checked={emailPayments} onChange={(e) => setEmailPayments(e.target.checked)} />
        </div>
        <div className="d-flex items-center justify-between h-30">
          <div className="text-14 lh-12 fw-500">Refund Requests</div>
          <Switch checked={emailRefunds} onChange={(e) => setEmailRefunds(e.target.checked)} />
        </div>
        <div className="d-flex items-center justify-between h-30">
          <div className="text-14 lh-12 fw-500">Support Tickets</div>
          <Switch checked={emailSupportTickets} onChange={(e) => setEmailSupportTickets(e.target.checked)} />
        </div>
      </div>

      <div className="col-12 mt-5 border-bottom-light mb-20 pb-20">
        <div className="text-18 lh-14 fw-500 mb-10">System Alerts</div>
        <div className="d-flex items-center justify-between h-30">
          <div className="text-14 lh-12 fw-500">Security Alerts</div>
          <Switch checked={alertSecurity} onChange={(e) => setAlertSecurity(e.target.checked)} />
        </div>
        <div className="d-flex items-center justify-between h-30">
          <div className="text-14 lh-12 fw-500">Performance Issues</div>
          <Switch checked={alertPerformance} onChange={(e) => setAlertPerformance(e.target.checked)} />
        </div>
        <div className="d-flex items-center justify-between h-30">
          <div className="text-14 lh-12 fw-500">System Errors</div>
          <Switch checked={alertSystemErrors} onChange={(e) => setAlertSystemErrors(e.target.checked)} />
        </div>
        <div className="d-flex items-center justify-between h-30">
          <div className="text-14 lh-12 fw-500">System Updates</div>
          <Switch checked={alertSystemUpdates} onChange={(e) => setAlertSystemUpdates(e.target.checked)} />
        </div>
      </div>

      <div className="col-12 mt-5">
        <h1 className="text-14 lh-12 fw-500">Alert Email Recipients</h1>
        <input
          type="text"
          className="border-light rounded-8 h-45 px-15 text-14 w-full mt-10"
          placeholder="Enter email addresses separated by commas"
          value={alertRecipients}
          onChange={(e) => setAlertRecipients(e.target.value)}
        />
        <div className="text-12 lh-12 text-light-1 mt-5">
          Separate multiple email addresses with commas
        </div>
      </div>

      <div className="col-12 mt-5 d-flex justify-end pt-20 border-top-light">
        <button onClick={handleSave} className="bg-dark-blue text-white rounded-8 text-14 py-5 px-15 w-full">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Notifications;
