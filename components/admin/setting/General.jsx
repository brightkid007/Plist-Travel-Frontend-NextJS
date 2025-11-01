"use client";

import { useState, useEffect } from "react";
import FormInput from "@/components/common/form/FormInput";
import { Switch } from "@mui/material";
import { Settings } from "lucide-react";
import { getSystemSettings, updateSystemSettings } from "@/helpers/backend_helper";
import { toast } from "react-toastify";

const General = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    siteName: "",
    siteUrl: "",
    adminEmail: "",
    supportEmail: "",
    dateFormat: "en-US",
    timeFormat: "12-hour",
    autoDetectLanguage: false,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await getSystemSettings();
      const data = response?.settings || response?.data?.settings || {};
      
      setSettings({
        siteName: data.siteName?.value || data.site_name?.value || "",
        siteUrl: data.siteUrl?.value || data.site_url?.value || "",
        adminEmail: data.adminEmail?.value || data.admin_email?.value || "",
        supportEmail: data.supportEmail?.value || data.support_email?.value || "",
        dateFormat: data.dateFormat?.value || data.date_format?.value || "en-US",
        timeFormat: data.timeFormat?.value || data.time_format?.value || "12-hour",
        autoDetectLanguage: data.autoDetectLanguage?.value === "true" || data.auto_detect_language?.value === "true" || false,
      });
    } catch (error) {
      console.error("Error loading settings:", error);
      toast.error(typeof error === "string" ? error : error?.message || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const settingsData = {
        siteName: settings.siteName,
        siteUrl: settings.siteUrl,
        adminEmail: settings.adminEmail,
        supportEmail: settings.supportEmail,
        dateFormat: settings.dateFormat,
        timeFormat: settings.timeFormat,
        autoDetectLanguage: settings.autoDetectLanguage.toString(),
      };

      await updateSystemSettings(settingsData);
      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error(typeof error === "string" ? error : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-center items-center py-40">
        <div className="text-16 text-light-1">Loading settings...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="row y-gap-20 bg-white px-10 py-10 rounded-8">
        <div className="col-12 border-bottom-light pb-20 mb-10">
          <div className="text-20 fw-600 lh-14 d-flex items-center gap-2">
            <Settings size={18} /> General Settings
          </div>
          <div className="text-14 text-light-1">
            Manage global settings and configurations for the platform.
          </div>
        </div>

        <FormInput
          label="Site Name"
          placeholder="Site Name"
          gridClass="col-12"
          value={settings.siteName}
          onChange={(e) => handleChange("siteName", e.target.value)}
        />
        <FormInput
          label="Site URL"
          placeholder="Site URL"
          gridClass="col-12"
          value={settings.siteUrl}
          onChange={(e) => handleChange("siteUrl", e.target.value)}
        />
        <FormInput
          label="Admin Email"
          placeholder="Admin Email"
          gridClass="col-12"
          type="email"
          value={settings.adminEmail}
          onChange={(e) => handleChange("adminEmail", e.target.value)}
        />
        <FormInput
          label="Support Email"
          placeholder="Support Email"
          gridClass="col-12"
          type="email"
          value={settings.supportEmail}
          onChange={(e) => handleChange("supportEmail", e.target.value)}
        />

        <div className="col-12 mt-5">
          <h1 className="text-14 lh-12 fw-500">Date Format</h1>
          <select
            className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-full mt-5"
            value={settings.dateFormat}
            onChange={(e) => handleChange("dateFormat", e.target.value)}
          >
            <option value="en-US">MM/DD/YYYY</option>
            <option value="en-GB">DD/MM/YYYY</option>
            <option value="ja-JP">YYYY/MM/DD</option>
            <option value="nl-NL">DD-MM-YYYY</option>
            <option value="en-CA">YYYY-MM-DD</option>
            <option value="de-DE">DD.MM.YYYY</option>
            <option value="ru-RU">DD.MM.YYYY</option>
            <option value="hu-HU">YYYY.MM.DD</option>
          </select>
        </div>

        <div className="col-12 mt-5">
          <h1 className="text-14 lh-12 fw-500">Time Format</h1>
          <select
            className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-full mt-5"
            value={settings.timeFormat}
            onChange={(e) => handleChange("timeFormat", e.target.value)}
          >
            <option value="12-hour">12-hour (AM/PM)</option>
            <option value="24-hour">24-hour</option>
          </select>
        </div>

        <div className="col-12 pb-20 mb-5 border-bottom-light mt-5 d-flex items-center justify-between">
          <div className="d-flex flex-column gap-2">
            <div className="text-14 lh-12 fw-500">Auto-detect User Language</div>
            <div className="text-14 lh-12 text-light-1">
              Automatically detect and set language based on user's browser
            </div>
          </div>
          <Switch
            checked={settings.autoDetectLanguage}
            onChange={(e) => handleChange("autoDetectLanguage", e.target.checked)}
          />
        </div>

        <div className="col-12 mt-5 d-flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-dark-blue text-white rounded-8 text-14 py-5 px-15 w-full"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default General;
