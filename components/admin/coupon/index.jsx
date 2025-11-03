"use client";

import AdminDashboardLayout from "../common/layout";
import { useRouter } from "next/navigation";
import { BookOpen, Ellipsis, Mail, MapPin, Phone, Plus, MoreVertical } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import DashboardCard from "./components/DashboardCard";
import { Dialog, Menu, MenuItem } from "@mui/material";
import DatePicker, { DateObject } from "react-multi-date-picker";
import FormInput from "@/components/common/form/FormInput";
import Filter from "../common/Filter";
import { createAdminCoupon, getAdminCoupons, updateAdminCoupon, deleteAdminCoupon } from "@/helpers/backend_helper";

const index = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [entries, setEntries] = useState([]);
  const [actionOpenIndex, setActionOpenIndex] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleMenuOpen = (event, id) => {
    setMenuAnchor({ [id]: event.currentTarget });
    setActionOpenIndex(id);
  };
  const handleMenuClose = (id) => {
    setMenuAnchor({ [id]: null });
    setActionOpenIndex(null);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const summaryCards = [
    {
      title: "Active Coupons",
      amount: "4",
      improve: "+1 from last month",
      icon: "/img/dashboard/icons/1.svg",
      description: "Number of active coupons"
    },
    {
      title: "Total Redemptions",
      amount: "568",
      improve: "+23.6% from last month",
      icon: "/img/dashboard/icons/2.svg",
      description: "Total coupon redemptions"
    },
    {
      title: "Discount Value",
      amount: "$12,450",
      improve: "+15.2% from last month",
      icon: "/img/dashboard/icons/3.svg",
      description: "Total value of discounts given"
    },
    {
      title: "Conversion Rate",
      amount: "24.5%",
      improve: "+2.1% from last month",
      icon: "/img/dashboard/icons/4.svg",
      description: "Percentage of successful conversions"
    }
  ];
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getAdminCoupons();
        // APIClient returns { message, data } or raw array depending on service settings
        const items = res?.data?.coupons || res?.coupons || res?.data || res || [];
        const normalized = (Array.isArray(items) ? items : []).map((c) => ({
          id: c.id || c.ID || c.uuid,
          code: c.code,
          description: c.description,
          discount: Number(c.discount_value),
          type: c.discount_type === "percent" ? "percentage" : "fixed",
          usageLimit: c.usage_limit,
          status: c.is_active ? "Active" : "Inactive",
          expiry: c.date_to,
        }));
        setEntries(normalized);
      } catch (e) {
        setError(e?.toString?.() || "Failed to load coupons");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const tabs = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Paid",
      value: "paid",
    },
    {
      label: "Pending",
      value: "pending",
    },
    {
      label: "Overdue",
      value: "overdue",
    },
    {
      label: "Refunded",
      value: "refunded",
    }
  ];
  
  

  return (
    <AdminDashboardLayout>
      <div className="row y-gap-15 x-gap-10 items-center mb-5">
        <div className="col-auto">
          <h1 className="text-30 lh-14 fw-600">Coupon & Promotion Management</h1>
          <div className="text-14 lh-14 text-light-1">
            Create and manage coupon codes and seasonal promotions
          </div>
        </div>
        <div className="col-auto ms-auto">
          <button className="button border-blue-1 text-blue-1 px-15 py-10 rounded-8">
            Export Data
          </button>
        </div>
        <div className="col-auto">
          <button 
            className="button bg-blue-1 text-white px-15 py-10 rounded-8"
            onClick={() => setShowModal(true)}
          >
            <Plus /> Create Coupon
          </button>
        </div>
      </div>

      <DashboardCard data={summaryCards} />

      {/* <div className="row y-gap-10 x-gap-10 items-center mt-15 mb-10">
        <div className="col-auto">
          <div className="row px-10">
            {tabs.map((item) => (
              <div className="col-auto px-5" key={item.value}>
                <button
                  className={`text-14 px-10 fw-500 py-5 rounded-8 ${
                    activeTab === item.value ? "bg-white" : "text-light-1"
                  }`}
                  onClick={() => {
                    setActiveTab(item.value);
                  }}
                >
                  {item.label}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div> */}
      <div className="bg-white rounded-8 border-light px-20 py-15">
        {/* <h1 className="text-24 lh-14 fw-500"> Manual Entries</h1>
        <div className="text-14 lh-14 text-light-1">
          Review and approve manually entered listing from vendors
        </div> */}
        <div className="bg-white rounded-8 border-light py-5 mt-10">
          <div className="overflow-scroll scroll-bar-1">
            <table className="table-3 -border-bottom col-12">
              <thead className="bg-light-2">
              <tr>
                <th>Code</th>
                <th>Description</th>
                <th>Discount</th>
                <th>Type</th>
                <th>Usage Limit</th>
                <th>Status</th>
                <th>Expiry</th>
                <th>Action</th>
              </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td className="py-15" colSpan={8}>Loading...</td>
                  </tr>
                )}
                {error && !loading && (
                  <tr>
                    <td className="py-15 text-red-1" colSpan={8}>{error}</td>
                  </tr>
                )}
                {!loading && !error && entries
                  // .filter((item) => {
                  //   return activeTab === "all"
                  //     ? true
                  //     : item.status.toLowerCase() === activeTab;
                  // })
                  .map((entry, index) => (
                    <tr key={index}>
                      <td className="align-middle text-12 lh-16 fw-500">
                        {entry.code}
                      </td>
                      <td className="align-middle">
                        {entry.description}
                      </td>
                      <td className="align-middle text-12 lh-16 fw-500">  
                        {entry.discount}
                      </td>
                      <td className="align-middle text-12 lh-16 fw-500">  
                        {entry.type}
                      </td>
                      <td className="align-middle text-12 lh-16 fw-500">  
                        {entry.usageLimit ?? "-"}
                      </td>
                      <td className="align-middle">
                        <span
                          className={`rounded-100 py-4 px-10 text-center text-12 fw-500 ${
                            entry.status === "Active"
                              ? "bg-green-1 text-green-2"
                              : "bg-light-2 text-dark-1"
                          }`}
                        >
                          {entry.status}
                        </span>
                      </td>
                      <td className="align-middle">
                        <div className="d-flex items-center gap-1 text-12 lh-16 fw-500">
                          {entry.expiry ? new Date(entry.expiry).toLocaleDateString() : "-"}
                        </div>
                      </td>
                     <td className="align-middle">
                       <div className="position-relative">
                         <button
                           className="border-0 bg-transparent cursor-pointer p-5"
                           onClick={(e) => handleMenuOpen(e, entry.id)}
                         >
                           <MoreVertical size={16} />
                         </button>
                         <Menu
                           anchorEl={menuAnchor[entry.id]}
                           open={Boolean(menuAnchor[entry.id])}
                           onClose={() => handleMenuClose(entry.id)}
                         >
                           <MenuItem onClick={() => {
                             setSelected(entry);
                             setShowEditModal(true);
                             handleMenuClose(entry.id);
                           }}>
                             Edit
                           </MenuItem>
                           <MenuItem onClick={async () => {
                             try {
                               const nextActive = entry.status !== "Active";
                               await updateAdminCoupon(entry.id, { is_active: nextActive });
                               setEntries((prev) => prev.map((e) => e.id === entry.id ? { ...e, status: nextActive ? "Active" : "Inactive" } : e));
                             } catch (_) {}
                             handleMenuClose(entry.id);
                           }}>
                             {entry.status === "Active" ? "Deactivate" : "Activate"}
                           </MenuItem>
                           <MenuItem onClick={async () => {
                             try {
                               await deleteAdminCoupon(entry.id);
                               setEntries((prev) => prev.filter((e) => e.id !== entry.id));
                             } catch (_) {}
                             handleMenuClose(entry.id);
                           }} className="text-red-2">
                             Delete
                           </MenuItem>
                         </Menu>
                       </div>
                     </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Dialog
        open={showModal}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-title"
      >
        <div className="px-20 py-20 w-500 sm:w-full">
          <ModalContent onCreated={(newItem) => {
            // Refresh list after creation
            setEntries((prev) => [newItem, ...prev]);
          }} />
          <div className="d-flex justify-end gap-2 mt-10">
            <button
              className="text-14 border-light rounded-8 px-10 py-5"
              onClick={handleClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </Dialog>
      <Dialog
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        aria-labelledby="edit-dialog-title"
        aria-describedby="edit-dialog-title"
      >
        <div className="px-20 py-20 w-500 sm:w-full">
          {selected && (
            <EditCouponModal
              data={selected}
              onClose={() => setShowEditModal(false)}
              onSaved={(updated) => {
                setEntries((prev) => prev.map((e) => e.id === updated.id ? updated : e));
                setShowEditModal(false);
              }}
            />
          )}
        </div>
      </Dialog>
    </AdminDashboardLayout>
  );
};

const ModalContent = ({ onCreated }) => {
  const [startDate, setStartDate] = useState(new DateObject());
  const [endDate, setEndDate] = useState(new DateObject());
  const [form, setForm] = useState({
    code: "",
    description: "",
    discount_type: "percent",
    discount_value: "",
    usage_limit: "",
    min_spend: "",
    status: "active",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const status = [
    {
      label: "Active",
      value: "active",
    },
    {
      label: "Inactive",
      value: "inactive",
    },
  ];

  const discountType = [
    {
      label: "Percentage",
      value: "percent",
    },
    {
      label: "Fixed Amount",
      value: "fixed",
    },
  ];
  
  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        code: form.code.trim(),
        description: form.description || undefined,
        discount_type: form.discount_type,
        discount_value: Number(form.discount_value),
        date_from: startDate?.format?.("YYYY-MM-DD"),
        date_to: endDate?.format?.("YYYY-MM-DD"),
        usage_limit: form.usage_limit ? Number(form.usage_limit) : undefined,
        min_spend: form.min_spend ? Number(form.min_spend) : undefined,
        is_active: form.status === "active",
      };
      const res = await createAdminCoupon(payload);
      const created = res?.data?.coupon || res?.coupon || res;
      if (onCreated && created) {
        onCreated({
          id: created.id,
          code: created.code,
          description: created.description,
          discount: Number(created.discount_value),
          type: created.discount_type === "percent" ? "percentage" : "fixed",
          usageLimit: created.usage_limit,
          status: created.is_active ? "Active" : "Inactive",
          expiry: created.date_to,
        });
      }
      // close dialog by simulating Escape; parent controls open state
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);
    } catch (e) {
      setError(e?.toString?.() || "Failed to create coupon");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="row x-gap-10 y-gap-10 items-center">
      <h1 className="text-20 lh-14 fw-500">Create New Coupon</h1>
      <div className="text-12 text-light-1 lh-14 mb-15">
        Create the details for new coupon code
      </div>

      <FormInput
        label="Coupon Code"
        required={true}
        type="text"
        placeholder="SUMMER2025"
        gridClass="col-12 mt-5"
        value={form.code}
        onChange={(e) => handleChange("code", e.target.value)}
      />

      <FormInput
        label="Description"
        type="textarea"
        placeholder="Enter coupon description"
        gridClass="col-12 mt-5"
        value={form.description}
        onChange={(e) => handleChange("description", e.target.value)}
      />

      <FormInput
        label="Discount Type"
        type="select"
        gridClass="col-12 mt-5"
        defaultValue={discountType[0].value}
        options={discountType}
        value={form.discount_type}
        onChange={(e) => handleChange("discount_type", e.target.value)}
      />

      <FormInput
        label="Discount Value"
        type="number"
        placeholder="10"
        gridClass="col-12"
        value={form.discount_value}
        onChange={(e) => handleChange("discount_value", e.target.value)}
      />

      <div className="col-sm-6">
        <h1 className="text-14 lh-14 fw-500">Valid from</h1>
        <div className="border-light rounded-8 py-10 px-20 w-full cursor-text text-light-1 bg-white">
          <DatePicker
            inputClass="custom_input-picker"
            containerClassName="custom_container-picker"
            value={startDate}
            onChange={(date) => {
              setStartDate(date);
            }}
            numberOfMonths={1}
            offsetY={10}
            format="MMMM DD"
          />
        </div>
      </div>

      <div className="col-sm-6">
        <h1 className="text-14 lh-14 fw-500">Valid till</h1>
        <div className="border-light rounded-8 py-10 px-20 w-full cursor-text text-light-1 bg-white">
          <DatePicker
            inputClass="custom_input-picker"
            containerClassName="custom_container-picker"
            value={endDate}
            onChange={(date) => {
              setEndDate(date);
            }}
            numberOfMonths={1}
            offsetY={10}
            format="MMMM DD"
          />
        </div>
      </div>

      <FormInput
        label="Usage Limit"
        type="number"
        placeholder="100(Leave empty for unlimited)"
        gridClass="col-12"
        value={form.usage_limit}
        onChange={(e) => handleChange("usage_limit", e.target.value)}
      />

      <FormInput
        label="Minimum Spend"
        type="number"
        placeholder="Optional minimum spend"
        gridClass="col-12"
        value={form.min_spend}
        onChange={(e) => handleChange("min_spend", e.target.value)}
      />

      <FormInput
        label="Status"
        type="select"
        gridClass="col-12 mt-5"
        defaultValue={status[0].value}
        options={status}
        value={form.status}
        onChange={(e) => handleChange("status", e.target.value)}
      />
  {error && (
        <div className="col-12 text-red-1 text-12">{error}</div>
      )}
      <div className="col-12 d-flex justify-end gap-2 mt-10">
        <button
          className="text-14 bg-blue-1 text-white fw-500 rounded-8 px-10 py-5"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Creating..." : "Create Coupon"}
        </button>
      </div>
    </div>
  );
};

export default index;

const EditCouponModal = ({ data, onSaved, onClose }) => {
  const [form, setForm] = useState({
    description: data.description || "",
    discount_type: data.type === "percentage" ? "percent" : "fixed",
    discount_value: String(data.discount ?? ""),
    usage_limit: data.usageLimit ? String(data.usageLimit) : "",
    min_spend: "",
    status: data.status === "Active" ? "active" : "inactive",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const discountType = [
    { label: "Percentage", value: "percent" },
    { label: "Fixed Amount", value: "fixed" },
  ];
  const status = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        description: form.description || undefined,
        discount_type: form.discount_type,
        discount_value: form.discount_value ? Number(form.discount_value) : undefined,
        usage_limit: form.usage_limit ? Number(form.usage_limit) : undefined,
        min_spend: form.min_spend ? Number(form.min_spend) : undefined,
        is_active: form.status === "active",
      };
      const res = await updateAdminCoupon(data.id, payload);
      const updated = res?.data?.coupon || res?.coupon || {};
      const mapped = {
        id: updated.id || data.id,
        code: updated.code || data.code,
        description: updated.description ?? form.description,
        discount: Number(updated.discount_value ?? form.discount_value ?? 0),
        type: (updated.discount_type || form.discount_type) === "percent" ? "percentage" : "fixed",
        usageLimit: updated.usage_limit ?? (form.usage_limit ? Number(form.usage_limit) : undefined),
        status: (typeof updated.is_active === 'boolean' ? updated.is_active : form.status === "active") ? "Active" : "Inactive",
        expiry: updated.date_to || data.expiry || null,
      };
      onSaved && onSaved(mapped);
    } catch (e) {
      setError(e?.toString?.() || "Failed to save coupon");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="row x-gap-10 y-gap-10 items-center">
      <h1 className="text-20 lh-14 fw-500">Edit Coupon</h1>
      <div className="text-12 text-light-1 lh-14 mb-15">Update coupon details</div>

      <FormInput label="Coupon Code" type="text" gridClass="col-12" value={data.code} readOnly />

      <FormInput label="Description" type="textarea" gridClass="col-12" value={form.description} onChange={(e) => handleChange("description", e.target.value)} />

      <FormInput label="Discount Type" type="select" gridClass="col-12" options={discountType} value={form.discount_type} onChange={(e) => handleChange("discount_type", e.target.value)} />

      <FormInput label="Discount Value" type="number" gridClass="col-12" value={form.discount_value} onChange={(e) => handleChange("discount_value", e.target.value)} />

      <FormInput label="Usage Limit" type="number" gridClass="col-12" value={form.usage_limit} onChange={(e) => handleChange("usage_limit", e.target.value)} />

      <FormInput label="Minimum Spend" type="number" gridClass="col-12" value={form.min_spend} onChange={(e) => handleChange("min_spend", e.target.value)} />

      <FormInput label="Status" type="select" gridClass="col-12" options={status} value={form.status} onChange={(e) => handleChange("status", e.target.value)} />

      {error && <div className="col-12 text-red-1 text-12">{error}</div>}
      <div className="col-12 d-flex justify-end gap-2 mt-10">
        <button className="text-14 border-light rounded-8 px-10 py-5" onClick={onClose}>Close</button>
        <button className="text-14 bg-blue-1 text-white fw-500 rounded-8 px-10 py-5" onClick={handleSave} disabled={submitting}>
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};
