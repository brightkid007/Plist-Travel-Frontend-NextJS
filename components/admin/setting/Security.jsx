import { useEffect, useState } from "react";
import { Switch } from "@mui/material";
import { Shield } from "lucide-react";
import { toast } from "react-toastify";
import { getSystemSettings, updateSystemSettings } from "@/helpers/backend_helper";

const Security = () => {
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [strongPassword, setStrongPassword] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [maxFailedAttempts, setMaxFailedAttempts] = useState(5);
  const [ipRestriction, setIpRestriction] = useState(false);
  const [enforceSSL, setEnforceSSL] = useState(true);

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

        setTwoFactorAuth(parseBool(g("twoFactorAuth"), false));
        setStrongPassword(parseBool(g("strongPasswordPolicy"), false));
        setSessionTimeout(parseInt(g("sessionTimeoutMinutes") || 30, 10));
        setMaxFailedAttempts(parseInt(g("maxFailedLoginAttempts") || 5, 10));
        setIpRestriction(parseBool(g("ipRestrictionEnabled"), false));
        setEnforceSSL(parseBool(g("enforceSSL"), true));
      } catch (_) {
        // keep defaults
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    try {
      await updateSystemSettings({
        twoFactorAuth: String(twoFactorAuth),
        strongPasswordPolicy: String(strongPassword),
        sessionTimeoutMinutes: String(sessionTimeout),
        maxFailedLoginAttempts: String(maxFailedAttempts),
        ipRestrictionEnabled: String(ipRestriction),
        enforceSSL: String(enforceSSL),
      });
      toast.success("Security settings saved");
    } catch (e) {
      toast.error(e?.message || "Failed to save settings");
    }
  };
  return (
    <div className="row y-gap-20 bg-white px-10 py-10 rounded-8">
      <div className="col-12">
        <div className="text-20 fw-600 lh-14 d-flex items-center gap-2">
          <Shield size={18} /> Security Settings
        </div>
        <div className="text-14 text-light-1">
          Configure security and authentication options
        </div>
      </div>

      <div className="col-12 mt-5 d-flex items-center justify-between">
        <div className="d-flex flex-column gap-2">
          <div className="text-14 lh-12 fw-500">Two-Factor Authentication</div>
          <div className="text-14 lh-12 text-light-1">
            Require two-factor authentication for all admin users
          </div>
        </div>
        <Switch checked={twoFactorAuth} onChange={(e) => setTwoFactorAuth(e.target.checked)} />
      </div>

      <div className="col-12 mt-5 d-flex items-center justify-between">
        <div className="d-flex flex-column gap-2">
          <div className="text-14 lh-12 fw-500">Strong Password Policy</div>
          <div className="text-14 lh-12 text-light-1">
            Enforce strong password requirements for all users
          </div>
        </div>
        <Switch checked={strongPassword} onChange={(e) => setStrongPassword(e.target.checked)} />
      </div>

      <div className="col-12 mt-5">
        <h1 className="text-14 lh-12 fw-500">Session Timeout (minutes)</h1>
        <input
          type="text"
          className="border-light rounded-8 h-45 px-15 text-14 w-full mt-10"
          placeholder="e.g., 30"
        value={sessionTimeout}
        onChange={(e) => setSessionTimeout(e.target.value.replace(/[^0-9]/g, ""))}
        />
      </div>

      <div className="col-12 mt-5">
        <h1 className="text-14 lh-12 fw-500">Max Failed Login Attempts</h1>
        <input
          type="text"
          className="border-light rounded-8 h-45 px-15 text-14 w-full mt-10"
          placeholder="e.g., 5"
        value={maxFailedAttempts}
        onChange={(e) => setMaxFailedAttempts(e.target.value.replace(/[^0-9]/g, ""))}
        />
      </div>

      <div className="col-12 mt-5 d-flex items-center justify-between">
        <div className="d-flex flex-column gap-2">
          <div className="text-14 lh-12 fw-500">IP Restriction</div>
          <div className="text-14 lh-12 text-light-1">
            Restrict admin access to specific IP addresses
          </div>
        </div>
        <Switch checked={ipRestriction} onChange={(e) => setIpRestriction(e.target.checked)} />
      </div>

      <div className="col-12 mt-5 d-flex items-center justify-between">
        <div className="d-flex flex-column gap-2">
          <div className="text-14 lh-12 fw-500">Enforce SSL</div>
          <div className="text-14 lh-12 text-light-1">
            Force all connections to use HTTPS
          </div>
        </div>
        <Switch checked={enforceSSL} onChange={(e) => setEnforceSSL(e.target.checked)} />
      </div>

      <div className="col-12 mt-5 d-flex justify-end pt-20 border-top-light">
        <button onClick={handleSave} className="bg-dark-blue text-white rounded-8 text-14 py-5 px-15 w-full">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Security;
