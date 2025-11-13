import { useEffect, useState } from "react";
import { getCurrentUser, updateCurrentUser } from "@/helpers/backend_helper";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";

const TechnicalSupport = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [supportInfo, setSupportInfo] = useState({
    technicalSupport: {
      contactName: "",
      email: "",
      phone: "",
      responseTime: "",
    },
    customerService: {
      contactName: "",
      email: "",
      phone: "",
      responseTime: "",
    },
    escalation: {
      contactName: "",
      email: "",
      phone: "",
      responseTime: "",
      procedures: "",
    },
    hours: {
      technical: {
        days: [],
        startTime: "",
        endTime: "",
        timeZone: "",
      },
      customer: {
        days: [],
        startTime: "",
        endTime: "",
        timeZone: "",
      },
    },
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await getCurrentUser();
        const data = res?.data || res || {};
        const profile = data.profile || {};
        if (profile.support_info) {
          setSupportInfo((prev) => ({
            ...prev,
            ...profile.support_info,
          }));
        }
      } catch (e) {
        toast.error(e?.message || "Failed to load support info");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const setField = (path, value) => {
    setSupportInfo((prev) => {
      const copy = { ...prev };
      let ref = copy;
      for (let i = 0; i < path.length - 1; i++) {
        ref[path[i]] = { ...(ref[path[i]] || {}) };
        ref = ref[path[i]];
      }
      ref[path[path.length - 1]] = value;
      return copy;
    });
  };

  const toggleDay = (section, day) => {
    setSupportInfo((prev) => {
      const days = prev.hours[section].days || [];
      const next = days.includes(day) ? days.filter((d) => d !== day) : [...days, day];
      return {
        ...prev,
        hours: {
          ...prev.hours,
          [section]: {
            ...prev.hours[section],
            days: next,
          },
        },
      };
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = { support_info: supportInfo };
      await updateCurrentUser(payload);
      toast.success("Support information saved");
    } catch (e) {
      toast.error(e?.message || "Failed to save support information");
    } finally {
      setSaving(false);
    }
  };
  const supportFields = [
    {
      section: "Technical Support",
      fields: [
        {
          label: "Contact Name",
          placeholder: "Enter contact name",
          type: "text",
          value: supportInfo.technicalSupport.contactName,
          onChange: (v) => setField(["technicalSupport", "contactName"], v),
        },
        { label: "Email", placeholder: "Enter email address", type: "text", value: supportInfo.technicalSupport.email, onChange: (v) => setField(["technicalSupport", "email"], v) },
        { label: "Phone", placeholder: "Enter phone number", type: "text", value: supportInfo.technicalSupport.phone, onChange: (v) => setField(["technicalSupport", "phone"], v) },
        { label: "Expected Response Time", type: "select", value: supportInfo.technicalSupport.responseTime, onChange: (v) => setField(["technicalSupport", "responseTime"], v) },
      ],
    },
    {
      section: "Customer Service",
      fields: [
        {
          label: "Contact Name",
          placeholder: "Enter contact name",
          type: "text",
          value: supportInfo.customerService.contactName,
          onChange: (v) => setField(["customerService", "contactName"], v),
        },
        { label: "Email", placeholder: "Enter email address", type: "text", value: supportInfo.customerService.email, onChange: (v) => setField(["customerService", "email"], v) },
        { label: "Phone", placeholder: "Enter phone number", type: "text", value: supportInfo.customerService.phone, onChange: (v) => setField(["customerService", "phone"], v) },
        { label: "Expected Response Time", type: "select", value: supportInfo.customerService.responseTime, onChange: (v) => setField(["customerService", "responseTime"], v) },
      ],
    },
  ];

  const escalationFields = [
    {
      label: "Primary Escalation Contact",
      placeholder: "Enter contact name",
      type: "text",
      value: supportInfo.escalation.contactName,
      onChange: (v) => setField(["escalation", "contactName"], v),
    },
    { label: "Escalation Email", placeholder: "Enter email address", type: "text", value: supportInfo.escalation.email, onChange: (v) => setField(["escalation", "email"], v) },
    { label: "Escalation Phone", placeholder: "Enter phone number", type: "text", value: supportInfo.escalation.phone, onChange: (v) => setField(["escalation", "phone"], v) },
    { label: "Expected Response Time", type: "select", value: supportInfo.escalation.responseTime, onChange: (v) => setField(["escalation", "responseTime"], v) },
  ];

  return (
    <div className="row y-gap-15 bg-white px-10 py-20 rounded-8">
      <div className="text-20 fw-600 lh-1">Technical & Support Details</div>
      <div className="text-12 text-light-1 lh-1 mb-20">
        Manage your technical support and customer service information.
      </div>
      {loading ? (
        <div className="col-12 mt-5 d-flex items-center gap-10">
          <CircularProgress size={20} thickness={5} />
          <div className="text-16 text-light-1">Loading support info...</div>
        </div>
      ) : (
        <>
          {supportFields.map((group, groupIdx) =>
            group.fields.map((field, idx) => (
              <div className="col-sm-6" key={`${groupIdx}-${idx}`}>
                <h1 className="text-13 lh-14 fw-500">
                  {field.type === "select" ? "" : group.section} {field.label}
                </h1>
                {field.type === "select" ? (
                  <select
                    className="form-select rounded-8 border-light justify-between py-10 mt-5 px-20 w-full text-14"
                    value={field.value || ""}
                    onChange={(e) => field.onChange && field.onChange(e.target.value)}
                    disabled={saving}
                  >
                    <option value="">Select response time</option>
                    <option value="1-2 hours">1-2 hours</option>
                    <option value="4 hours">4 hours</option>
                    <option value="8 hours">8 hours</option>
                    <option value="24 hours">24 hours</option>
                  </select>
                ) : (
                  <input
                    className="border-light rounded-8 py-5 px-15 w-full mt-5"
                    type={field.type}
                    placeholder={field.placeholder}
                    value={field.value || ""}
                    onChange={(e) => field.onChange && field.onChange(e.target.value)}
                    disabled={saving}
                  />
                )}
              </div>
            ))
          )}

          {/* Support Hours */}
          <div className="text-18 fw-500 mt-10 col-auto">Support Hours</div>
          <div className="col-12 px-30">
            <div className="row y-gap-10 py-10 border-light rounded-8">
              <div className="col-md-6 col-sm-12">
                <div className="row y-gap-5">
                  <div className="text-16 lh-1 fw-500">Technical Support Hours</div>
                  <SupportHours
                    data={supportInfo.hours.technical}
                    onToggleDay={(day) => toggleDay("technical", day)}
                    onChange={(k, v) => setField(["hours", "technical", k], v)}
                    disabled={saving}
                  />
                </div>
              </div>
              <div className="col-md-6 col-sm-12">
                <div className="row y-gap-5">
                  <div className="text-16 lh-1 fw-500">Customer Service Hours</div>
                  <SupportHours
                    data={supportInfo.hours.customer}
                    onToggleDay={(day) => toggleDay("customer", day)}
                    onChange={(k, v) => setField(["hours", "customer", k], v)}
                    disabled={saving}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Escalation Procedures */}
          <div className="text-18 fw-500 mt-15 col-auto">Escalation Procedures</div>
          <div className="col-12 py-0">
            <textarea
              className="border-light rounded-8 py-5 px-15 w-full"
              rows={5}
              type="text"
              placeholder="Describe your escalation procedures..."
              value={supportInfo.escalation.procedures || ""}
              onChange={(e) => setField(["escalation", "procedures"], e.target.value)}
              disabled={saving}
            />
          </div>

          {escalationFields.map((field, idx) => (
            <div className="col-sm-6" key={idx}>
              <h1 className="text-13 lh-14 fw-500">{field.label}</h1>
              {field.type === "select" ? (
                <select
                  className="form-select rounded-8 border-light justify-between py-10 mt-5 px-20 w-full text-14"
                  value={field.value || ""}
                  onChange={(e) => field.onChange && field.onChange(e.target.value)}
                  disabled={saving}
                >
                  <option value="">Select response time</option>
                  <option value="1-2 hours">1-2 hours</option>
                  <option value="4 hours">4 hours</option>
                  <option value="8 hours">8 hours</option>
                  <option value="24 hours">24 hours</option>
                </select>
              ) : (
                <input
                  className="border-light rounded-8 py-5 px-15 w-full mt-5"
                  type={field.type}
                  placeholder={field.placeholder}
                  value={field.value || ""}
                  onChange={(e) => field.onChange && field.onChange(e.target.value)}
                  disabled={saving}
                />
              )}
            </div>
          ))}

          <div className="d-flex justify-end mt-20 border-top-light pt-15">
            <button
              className="button border-light rounded-8 text-12 py-10 px-15 mr-10"
              onClick={() => window?.location?.reload()}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              className="button bg-blue-1 text-white rounded-8 text-12 py-10 px-15"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const SupportHours = ({ data, onToggleDay, onChange, disabled }) => {
  const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  return (
    <>
      <div className="text-15 lh-15 fw-500 mt-10">Days Available</div>
      {weekdays.map((day, index) => (
        <div className="col-xl-3 col-lg-6 col-sm-6" key={index}>
          <div className="form-checkbox d-flex items-center">
            <input
              type="checkbox"
              checked={(data?.days || []).includes(day)}
              onChange={() => onToggleDay && onToggleDay(day)}
              disabled={disabled}
            />
            <div className="form-checkbox__mark">
              <div className="form-checkbox__icon icon-check" />
            </div>
            <div className="text-15 ml-10">{day.substring(0, 3)}</div>
          </div>
        </div>
      ))}
      <div className="col-xl-3 col-lg-6 col-sm-6"></div>

      <div className="col-sm-6 mt-10">
        <h1 className="text-15 lh-14 fw-500">Start Time</h1>
        <select
          className="form-select rounded-8 border-light justify-between py-10 mt-5 px-20 w-full text-14"
          value={data?.startTime || ""}
          onChange={(e) => onChange && onChange("startTime", e.target.value)}
          disabled={disabled}
        >
          <option value="">Select time</option>
          <option value="08:00">08:00</option>
          <option value="09:00">09:00</option>
          <option value="10:00">10:00</option>
          <option value="11:00">11:00</option>
          <option value="12:00">12:00</option>
          <option value="13:00">13:00</option>
          <option value="14:00">14:00</option>
          <option value="15:00">15:00</option>
          <option value="16:00">16:00</option>
          <option value="17:00">17:00</option>
        </select>
      </div>

      <div className="col-sm-6 mt-10">
        <h1 className="text-15 lh-14 fw-500">End Time</h1>
        <select
          className="form-select rounded-8 border-light justify-between py-10 mt-5 px-20 w-full text-14"
          value={data?.endTime || ""}
          onChange={(e) => onChange && onChange("endTime", e.target.value)}
          disabled={disabled}
        >
          <option value="">Select time</option>
          <option value="16:00">16:00</option>
          <option value="17:00">17:00</option>
          <option value="18:00">18:00</option>
          <option value="19:00">19:00</option>
          <option value="20:00">20:00</option>
          <option value="21:00">21:00</option>
          <option value="22:00">22:00</option>
        </select>
      </div>

      <div className="col-12 mt-10">
        <h1 className="text-15 lh-14 fw-500">Time Zone</h1>
        <select
          className="form-select rounded-8 border-light justify-between py-10 mt-5 px-20 w-full text-14"
          value={data?.timeZone || ""}
          onChange={(e) => onChange && onChange("timeZone", e.target.value)}
          disabled={disabled}
        >
          <option value="">Select time zone</option>
          <option value="UTC-12:00">UTC-12:00 (Baker Island Time)</option>
          <option value="UTC-11:00">UTC-11:00 (Hawaii-Aleutian Standard Time)</option>
          <option value="UTC-10:00">UTC-10:00 (Hawaii Standard Time)</option>
          <option value="UTC-09:30">UTC-09:30 (Marquesas Time)</option>
          <option value="UTC-09:00">UTC-09:00 (Alaska Standard Time)</option>
          <option value="UTC-08:00">UTC-08:00 (Pacific Standard Time)</option>
          <option value="UTC-07:00">UTC-07:00 (Mountain Standard Time)</option>
          <option value="UTC-06:00">UTC-06:00 (Central Standard Time)</option>
          <option value="UTC-05:00">UTC-05:00 (Eastern Standard Time)</option>
          <option value="UTC-04:00">UTC-04:00 (Atlantic Standard Time)</option>
          <option value="UTC-03:30">UTC-03:30 (Newfoundland Standard Time)</option>
          <option value="UTC-03:00">UTC-03:00 (Argentina Time)</option>
          <option value="UTC-02:00">UTC-02:00 (South Georgia Time)</option>
          <option value="UTC-01:00">UTC-01:00 (Cape Verde Time)</option>
          <option value="UTC">UTC (Coordinated Universal Time)</option>
          <option value="UTC+01:00">UTC+01:00 (Central European Time)</option>
          <option value="UTC+02:00">UTC+02:00 (Eastern European Time)</option>
          <option value="UTC+03:00">UTC+03:00 (Moscow Time)</option>
          <option value="UTC+03:30">UTC+03:30 (Iran Standard Time)</option>
          <option value="UTC+04:00">UTC+04:00 (Gulf Standard Time)</option>
          <option value="UTC+04:30">UTC+04:30 (Afghanistan Time)</option>
          <option value="UTC+05:00">UTC+05:00 (Pakistan Standard Time)</option>
          <option value="UTC+05:30">UTC+05:30 (India Standard Time)</option>
          <option value="UTC+05:45">UTC+05:45 (Nepal Time)</option>
          <option value="UTC+06:00">UTC+06:00 (Bangladesh Standard Time)</option>
          <option value="UTC+06:30">UTC+06:30 (Myanmar Time)</option>
          <option value="UTC+07:00">UTC+07:00 (Indochina Time)</option>
          <option value="UTC+08:00">UTC+08:00 (China Standard Time)</option>
          <option value="UTC+08:45">UTC+08:45 (Australian Central Western Time)</option>
          <option value="UTC+09:00">UTC+09:00 (Japan Standard Time)</option>
          <option value="UTC+09:30">UTC+09:30 (Australian Central Standard Time)</option>
          <option value="UTC+10:00">UTC+10:00 (Australian Eastern Standard Time)</option>
          <option value="UTC+10:30">UTC+10:30 (Lord Howe Standard Time)</option>
          <option value="UTC+11:00">UTC+11:00 (Solomon Islands Time)</option>
          <option value="UTC+12:00">UTC+12:00 (New Zealand Standard Time)</option>
          <option value="UTC+12:45">UTC+12:45 (Chatham Standard Time)</option>
          <option value="UTC+13:00">UTC+13:00 (Tonga Time)</option>
          <option value="UTC+14:00">UTC+14:00 (Line Islands Time)</option>
        </select>
      </div>
    </>
  );
}

export default TechnicalSupport;
