import { useEffect, useMemo, useState } from "react";
import { Checkbox, Switch } from "@mui/material";
import { Languages } from "lucide-react";
import { toast } from "react-toastify";
import { getSystemSettings, updateSystemSettings } from "@/helpers/backend_helper";

const Localization = () => {
  const allLanguages = useMemo(
    () => [
      { code: "en", label: "English" },
      { code: "es", label: "Spanish" },
      { code: "fr", label: "French" },
      { code: "de", label: "German" },
      { code: "ja", label: "Japanese" },
      { code: "zh", label: "Chinese" },
    ],
    []
  );

  // Temporarily enable only English
  const [enabledLanguageCodes, setEnabledLanguageCodes] = useState(new Set(["en"]));
  const [defaultLanguageCode, setDefaultLanguageCode] = useState("en");
  const [autoDetect, setAutoDetect] = useState(false);
  const [defaultCurrency, setDefaultCurrency] = useState("usd");
  const [timezone, setTimezone] = useState("utc");

  const enabledLanguages = useMemo(
    () => allLanguages.filter((l) => enabledLanguageCodes.has(l.code)),
    [allLanguages, enabledLanguageCodes]
  );

  const normalizeList = (raw) => {
    if (!raw) return [];
    let val = raw;
    // If it's an object with value
    if (typeof val === "object" && val.value !== undefined) val = val.value;
    // Try to peel JSON strings repeatedly
    for (let i = 0; i < 3; i += 1) {
      if (typeof val === "string") {
        const trimmed = val.trim();
        if ((trimmed.startsWith("[") && trimmed.endsWith("]")) || (trimmed.startsWith("\"") && trimmed.endsWith("\""))) {
          try {
            val = JSON.parse(trimmed);
            continue; // loop to handle nested
          } catch (_) {
            // not JSON, break
          }
        }
        // comma-separated fallback
        return trimmed
          .replace(/^\[|\]$/g, "")
          .split(",")
          .map((s) => s.replace(/\"/g, ''))
          .map((s) => s.trim())
          .filter(Boolean);
      }
      break;
    }
    if (Array.isArray(val)) return val.map(String).map((s) => s.trim()).filter(Boolean);
    return [];
  };

  useEffect(() => {
    if (!enabledLanguageCodes.has(defaultLanguageCode)) {
      const fallback = enabledLanguages[0]?.code || "en";
      setDefaultLanguageCode(fallback);
    }
  }, [enabledLanguageCodes, defaultLanguageCode, enabledLanguages]);

  const load = async () => {
    try {
      const response = await getSystemSettings();
      const data = response?.settings || response?.data?.settings || {};

      const enabledArray = normalizeList(
        data.enabledLanguages?.value ?? data.enabled_languages?.value ?? data.enabledLanguages ?? data.enabled_languages ?? ["en"]
      );

      const defLang =
        data.defaultLanguage?.value ||
        data.default_language?.value ||
        data.defaultLanguage ||
        data.default_language ||
        "en";

      const auto =
        data.autoDetectLanguage?.value === "true" ||
        data.auto_detect_language?.value === "true" ||
        data.autoDetectLanguage === true ||
        data.auto_detect_language === true ||
        false;

      const tz =
        data.timezone?.value || data.defaultTimezone?.value || data.timezone || data.defaultTimezone || "utc";

      const curr =
        data.defaultCurrency?.value ||
        data.default_currency?.value ||
        data.defaultCurrency ||
        data.default_currency ||
        "usd";

      // Apply
      setEnabledLanguageCodes(new Set(enabledArray.length ? enabledArray : ["en"]));
      setDefaultLanguageCode(defLang || "en");
      setAutoDetect(!!auto);
      setTimezone((tz || "utc").toLowerCase());
      setDefaultCurrency((curr || "usd").toLowerCase());
    } catch (e) {
      // Keep defaults
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleToggleLanguage = (code) => {
    // Temporarily restrict to English only
    if (code !== "en") return;
    setEnabledLanguageCodes((prev) => {
      const next = new Set(prev);
      if (next.has(code)) {
        return next; // prevent disabling English
      }
      next.add(code);
      return next;
    });
  };

  const handleSave = async () => {
    try {
      const payload = {
        defaultLanguage: defaultLanguageCode,
        enabledLanguages: Array.from(enabledLanguageCodes).join(","),
        autoDetectLanguage: String(autoDetect),
        timezone,
        defaultCurrency,
      };
      await updateSystemSettings(payload);
      toast.success("Localization settings saved");
    } catch (e) {
      toast.error(typeof e === "string" ? e : "Failed to save settings");
    }
  };

  return (
    <div className="row y-gap-20 bg-white px-10 py-10 rounded-8">
      <div className="col-12">
        <div className="text-20 fw-600 lh-14 d-flex items-center gap-2">
          <Languages size={18} /> Localization & Language
        </div>
        <div className="text-14 text-light-1">
          Configure language and regional settings
        </div>
      </div>

      <div className="col-12 mt-5">
        <h1 className="text-14 lh-12 fw-500">Default Language</h1>
        <select
          className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-full mt-5"
          value={defaultLanguageCode}
          onChange={(e) => setDefaultLanguageCode(e.target.value)}
        >
          {enabledLanguages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      <div className="col-12 mt-5">
        <h1 className="text-14 lh-12 fw-500">Default Timezone</h1>
        <select className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-full mt-5">
          <option value="utc">UTC</option>
        </select>
      </div>

      <div className="col-12 mt-5">
        <h1 className="text-14 lh-12 fw-500">Enabled Languages</h1>
        <div className="row y-gap-10 x-gap-10 mt-5">
          {allLanguages.map((lang) => (
            <div
              className="col-sm-6 d-flex items-center justify-start"
              key={lang.code}
            >
              <Checkbox
                className="px-0 py-0"
                checked={enabledLanguageCodes.has(lang.code)}
                onChange={() => handleToggleLanguage(lang.code)}
                disabled={lang.code !== "en"}
              />
              <div className="text-14 lh-12 fw-500">{lang.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="col-12 mt-5">
        <h1 className="text-14 lh-12 fw-500">Default Currency</h1>
        <select
          className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-full mt-5"
          value={defaultCurrency}
          onChange={(e) => setDefaultCurrency(e.target.value)}
        >
          <option value="usd">US Dollar (USD)</option>
          <option value="cad">United States Dollar (CAD)</option>
          <option value="eur">Euro (EUR)</option>
          <option value="jpy">Japanese Yen (JPY)</option>
          <option value="aud">Australian Dollar (AUD)</option>
          <option value="gbp">British Pound (GBP)</option>
          <option value="sgd">Singapore Dollar (SGD)</option>
          <option value="hkd">Hong Kong Dollar (HKD)</option>
          <option value="nzd">New Zealand Dollar (NZD)</option>
          <option value="ngn">Nigerian Naira (NGN)</option>
        </select>
      </div>

      <div className="col-12 pb-20 mb-5 border-bottom-light mt-5 d-flex items-center justify-between">
        <div className="d-flex flex-column gap-2">
          <div className="text-14 lh-12 fw-500">Auto-detect User Language</div>
          <div className="text-14 lh-12 text-light-1">
            Automatically detect and set language based on user's browser
          </div>
        </div>
        <Switch checked={autoDetect} onChange={(e) => setAutoDetect(e.target.checked)} />
      </div>

      <div className="col-12 mt-5 d-flex justify-end">
        <button onClick={handleSave} className="bg-dark-blue text-white rounded-8 text-14 py-5 px-15 w-full">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Localization;
