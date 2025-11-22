import { useEffect, useState } from "react";
import { getCurrentUser, updateCurrentUser } from "@/helpers/backend_helper";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";

const Financial = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [financialInfo, setFinancialInfo] = useState({
    bankLocation: "",
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    routingNumber: "",
    accountType: "",
    currency: "usd",
  });

  const load = async () => {
    try {
      setLoading(true);
      const res = await getCurrentUser();
      const data = res?.data || res || {};
      const profile = data.profile || {};
      if (profile.financial_info) {
        setFinancialInfo((prev) => ({
          ...prev,
          ...profile.financial_info,
        }));
      }
    } catch (e) {
      toast.error(e?.message || "Failed to load financial information");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (field, value) => {
    setFinancialInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = { financial_info: financialInfo };
      await updateCurrentUser(payload);
      toast.success("Financial information saved successfully");
    } catch (e) {
      toast.error(e?.message || "Failed to save financial information");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="row y-gap-15 bg-white px-10 py-20 rounded-8">
      <div className="text-20 fw-600 lh-1">Financial Information</div>
      <div className="text-12 text-light-1 lh-1">
        Manage your banking and payment details.
      </div>
      {loading ? (
        <div className="col-12 mt-5 d-flex items-center gap-10">
          <CircularProgress size={20} thickness={5} />
          <div className="text-16 text-light-1">Loading financial information...</div>
        </div>
      ) : (
        <>
          <div className="text-18 fw-500 lh-1 mt-15">Bank Account Details</div>

          <div className="col-md-6 mt-5">
            <h1 className="text-14 lh-12 fw-500">Bank Location</h1>
            <input
              className="border-light rounded-8 py-5 px-15 w-full mt-5"
              type="text"
              placeholder="Banking country/region"
              value={financialInfo.bankLocation || ""}
              onChange={(e) => handleChange("bankLocation", e.target.value)}
              disabled={saving}
            />
          </div>

          <div className="col-md-6 col-sm-12">
            <h1 className="text-13 lh-14 fw-500">Account Holder Name</h1>
            <input
              className="border-light rounded-8 py-5 px-15 w-full mt-5"
              type="text"
              placeholder="Enter account holder name"
              value={financialInfo.accountHolderName || ""}
              onChange={(e) => handleChange("accountHolderName", e.target.value)}
              disabled={saving}
            />
          </div>

          <div className="col-md-6 col-sm-12">
            <h1 className="text-13 lh-14 fw-500">Bank Name</h1>
            <input
              className="border-light rounded-8 py-5 px-15 w-full mt-5"
              type="text"
              placeholder="Enter bank name"
              value={financialInfo.bankName || ""}
              onChange={(e) => handleChange("bankName", e.target.value)}
              disabled={saving}
            />
          </div>

          <div className="col-md-6 col-sm-12">
            <h1 className="text-13 lh-14 fw-500">Account Number</h1>
            <input
              className="border-light rounded-8 py-5 px-15 w-full mt-5"
              type="text"
              placeholder="Enter account number"
              value={financialInfo.accountNumber || ""}
              onChange={(e) => handleChange("accountNumber", e.target.value)}
              disabled={saving}
            />
          </div>

          <div className="col-md-6 col-sm-12">
            <h1 className="text-13 lh-14 fw-500">Routing Number</h1>
            <input
              className="border-light rounded-8 py-5 px-15 w-full mt-5"
              type="text"
              placeholder="Enter routing number"
              value={financialInfo.routingNumber || ""}
              onChange={(e) => handleChange("routingNumber", e.target.value)}
              disabled={saving}
            />
          </div>

          <div className="col-md-6 col-sm-12">
            <h1 className="text-13 lh-14 fw-500">Account Type</h1>
            <select
              className="form-select rounded-8 border-light justify-between py-10 mt-5 px-20 w-full text-14"
              value={financialInfo.accountType || ""}
              onChange={(e) => handleChange("accountType", e.target.value)}
              disabled={saving}
            >
              <option value="">Select account type</option>
              <option value="checking">Checking Account</option>
              <option value="savings">Savings Account</option>
              <option value="current">Current Account</option>
              <option value="business">Business Account</option>
              <option value="business_checking">Business Checking</option>
              <option value="business_savings">Business Savings</option>
              <option value="joint">Joint Account</option>
              <option value="money_market">Money Market Account</option>
              <option value="certificate_of_deposit">Certificate of Deposit (CD)</option>
            </select>
          </div>

          <div className="col-md-6 col-sm-12">
            <h1 className="text-13 lh-14 fw-500">Currency</h1>
            <select
              className="form-select rounded-8 border-light justify-between py-10 mt-5 px-20 w-full text-14"
              value={financialInfo.currency || "usd"}
              onChange={(e) => handleChange("currency", e.target.value)}
              disabled={saving}
            >
              <option value="usd">USD - US Dollar</option>
              <option value="cad">CAD - Canadian Dollar</option>
              <option value="aud">AUD - Australian Dollar</option>
              <option value="gbp">GBP - British Pound</option>
              <option value="eur">EUR - Euro</option>
            </select>
          </div>

          <div className="col-md-6"></div>

          {/* <div className="col-md-6 col-sm-12 px-30 mt-10">
            <div className="row border-light rounded-8 px-15 py-15">
              <div className="text-18 fw-600 lh-1 px-0">Payment Terms</div>
              <div className="col-12 d-flex items-center border-light rounded-8 py-15 px-15 mt-20">
                <span className="material-symbols-outlined text-14">info</span>
                <div className="text-14 lh-1 ml-10">
                  Payment terms are set by the Super Admin.
                </div>
              </div>
              <div className="col-12 d-flex justify-between px-0 mt-10">
                <div className="text-14 fw-500 lh-1">Payment Cycle</div>
                <div className="text-14 lh-1">Monthly</div>
              </div>
              <div className="col-12 d-flex justify-between px-0 mt-10">
                <div className="text-14 fw-500 lh-1">Payment Method</div>
                <div className="text-14 lh-1">Direct Deposit</div>
              </div>
              <div className="col-12 d-flex justify-between px-0 mt-10">
                <div className="text-14 fw-500 lh-1">Payment Processing Time</div>
                <div className="text-14 lh-1">Net 30</div>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-sm-12 px-30 mt-10">
            <div className="row border-light rounded-8 px-15 py-15">
              <div className="text-18 fw-600 lh-1 px-0">Pricing Structure</div>
              <div className="col-12 d-flex items-center border-light rounded-8 py-15 px-15 mt-20">
                <span className="material-symbols-outlined text-14">info</span>
                <div className="text-14 lh-1 ml-10">
                  Pricing structure is set by the Super Admin.
                </div>
              </div>
              <div className="col-12 d-flex justify-between px-0 mt-10">
                <div className="text-14 fw-500 lh-1">Commission Rate</div>
                <div className="text-14 lh-1">15%</div>
              </div>
              <div className="col-12 d-flex justify-between px-0 mt-10">
                <div className="text-14 fw-500 lh-1">Transaction Fee</div>
                <div className="text-14 lh-1">2.9% + $0.30</div>
              </div>
              <div className="col-12 d-flex justify-between px-0 mt-10">
                <div className="text-14 fw-500 lh-1">Subscription Fee</div>
                <div className="text-14 lh-1">$49.99/month</div>
              </div>
            </div>
          </div> */}

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

export default Financial;
