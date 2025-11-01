import { useEffect, useState } from "react";
import { Switch } from "@mui/material";
import { CreditCard, Link } from "lucide-react";
import { toast } from "react-toastify";
import { getSystemSettings, updateSystemSettings } from "@/helpers/backend_helper";

const Payments = () => {
  const [enableStripe, setEnableStripe] = useState(true);
  const [enablePaystack, setEnablePaystack] = useState(false);
  const [currencyDisplayFormat, setCurrencyDisplayFormat] = useState("symbol_amount");
  const [defaultTaxRate, setDefaultTaxRate] = useState("0");
  const [autoInvoice, setAutoInvoice] = useState(false);

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

        setEnableStripe(parseBool(g("enableStripe"), true));
        setEnablePaystack(parseBool(g("enablePaystack"), false));
        setCurrencyDisplayFormat((g("currencyDisplayFormat") || "symbol_amount").toString());
        setDefaultTaxRate((g("defaultTaxRate") || "0").toString());
        setAutoInvoice(parseBool(g("autoInvoice"), false));
      } catch (_) {
        // keep defaults
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    try {
      await updateSystemSettings({
        enableStripe: String(enableStripe),
        enablePaystack: String(enablePaystack),
        currencyDisplayFormat,
        defaultTaxRate,
        autoInvoice: String(autoInvoice),
      });
      toast.success("Payment settings saved");
    } catch (e) {
      toast.error(typeof e === "string" ? e : "Failed to save settings");
    }
  };

  return (
    <div className="row y-gap-20 bg-white px-10 py-10 rounded-8">
      <div className="col-12">
        <div className="text-20 fw-600 lh-14 d-flex items-center gap-2">
          <CreditCard size={18} /> Payment Settings
        </div>
        <div className="text-14 text-light-1">
          Configure payment gateways and options
        </div>
      </div>

      <div className="col-12 d-flex flex-column gap-2">
        <h1 className="text-14 lh-12 fw-500">Payment Gateway</h1>
        <div className="border-light rounded-8 px-15 py-15 d-flex items-center">
          <CreditCard color="#0556b3" size={22} />
          <div className="d-flex flex-column gap-1 ml-20 me-auto">
            <div className="text-16 lh-12 fw-500">Stripe</div>
            <div className="text-14 lh-12 text-light-1">
              Credit card payments via Stripe
            </div>
          </div>
          <Switch checked={enableStripe} onChange={(e) => setEnableStripe(e.target.checked)} />
        </div>
        <div className="border-light rounded-8 px-15 py-15 d-flex items-center">
          <Link color="#008009" size={22} />
          <div className="d-flex flex-column gap-1 ml-20 me-auto">
            <div className="text-16 lh-12 fw-500">Paystack</div>
            <div className="text-14 lh-12 text-light-1">
              Card, bank, and mobile payments via Paystack
            </div>
          </div>
          <Switch checked={enablePaystack} onChange={(e) => setEnablePaystack(e.target.checked)} />
        </div>
      </div>

      <div className="col-12">
        <h1 className="text-14 lh-12 fw-500">Currency Display Format</h1>
        <select
          className="form-select rounded-8 border-light justify-between h-45 px-15 text-14 w-full mt-10"
          value={currencyDisplayFormat}
          onChange={(e) => setCurrencyDisplayFormat(e.target.value)}
        >
          <option value="symbol_amount">Symbol before amount ($100)</option>
          <option value="amount_symbol">Amount before symbol (100$)</option>
          <option value="code_amount">Currency code before amount (USD 100)</option>
          <option value="amount_code">Amount before currency code (100 USD)</option>
          <option value="symbol_space_amount">Symbol, space, amount ($ 100)</option>
          <option value="amount_space_symbol">Amount, space, symbol (100 $)</option>
        </select>
      </div>

      <div className="col-12">
        <h1 className="text-14 lh-12 fw-500">Default Tax Rate (%)</h1>
        <input
          className="border-light rounded-8 h-45 px-15 text-14 w-full mt-10"
          placeholder="10"
          value={defaultTaxRate}
          onChange={(e) => setDefaultTaxRate(e.target.value)}
        />
      </div>

      <div className="col-12 pb-20 mb-5 border-bottom-light mt-5 d-flex items-center justify-between">
        <div className="d-flex flex-column gap-2">
          <div className="text-14 lh-12 fw-500">
            Automatic Invoice Generation
          </div>
          <div className="text-14 lh-12 text-light-1">
            Automatically generate invoices for all payments
          </div>
        </div>
        <Switch checked={autoInvoice} onChange={(e) => setAutoInvoice(e.target.checked)} />
      </div>

      <div className="col-12 mt-5 d-flex justify-end">
        <button onClick={handleSave} className="bg-dark-blue text-white rounded-8 text-14 py-5 px-15 w-full">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Payments;
