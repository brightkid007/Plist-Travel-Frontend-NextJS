"use client";

import { Plus } from "lucide-react";
import AdminDashboardLayout from "../../common/layout";
import { Dialog, Checkbox } from "@mui/material";
import { useEffect, useState } from "react";
import { getPackageSubscriptions, exportPackageSubscriptionsPdf } from "@/helpers/backend_helper";
import { toast } from "react-toastify";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro";
import { updatePackageSubscriptionStatus, updatePackageSubscription } from "@/helpers/backend_helper";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const index = () => {
  return (
    <AdminDashboardLayout>
      <div className="row y-gap-15 x-gap-10 items-center mb-5">
        <div className="col-auto">
          <h1 className="text-30 lh-14 fw-600">
            Package Subscription Management
          </h1>
          <div className="text-14 text-light-1 lh-14">
            Manage and monitor all package subscriptions across the platform.
          </div>
        </div>
      </div>

      <div className="py-20 px-30 rounded-8 bg-white shadow-3 h-100 mt-20">
        <SubscriptionList />
      </div>
    </AdminDashboardLayout>
  );
};

const SubscriptionList = () => {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeRow, setActiveRow] = useState(null);
  const [statusValue, setStatusValue] = useState("Pending");
  const [txnId, setTxnId] = useState("");
  const [editStart, setEditStart] = useState(null);
  const [editEnd, setEditEnd] = useState(null);
  const [editTrialEnd, setEditTrialEnd] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showColumnPicker, setShowColumnPicker] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    business_name: true,
    package_name: true,
    status: true,
    created_at_text: true,
    start_date: true,
    trial_end_date: true,
    end_date: true,
    coupon_code: true,
    original_price: true,
    paid_amount: true,
    paid_via: true,
    transaction_id: true,
    actions: true,
  });
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const onStatusModalClose = () => { setShowStatusModal(false); setActiveRow(null); };
  const onEditModalClose = () => { setShowEditModal(false); setActiveRow(null); };

  const reload = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedStatus && selectedStatus !== 'all') params.status = selectedStatus;
      if (selectedPackage && selectedPackage !== 'all') params.package_name = selectedPackage;
      if (dateFrom) params.date_from = dateFrom.format('YYYY-MM-DD');
      if (dateTo) params.date_to = dateTo.format('YYYY-MM-DD');
      const res = await getPackageSubscriptions(params);
      const list = res?.subscriptions || res?.data?.subscriptions || res?.data || res || [];
      setRows(list);
      const uniquePkgs = Array.from(new Set(list.map((r) => r.package_name).filter(Boolean)));
      setPackages(uniquePkgs);
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Failed to load subscriptions");
      setRows([]);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStatus, selectedPackage, dateFrom, dateTo]);

  const allColumns = [
    { key: 'business_name', label: 'Business Name' },
    { key: 'package_name', label: 'Package Name' },
    { key: 'status', label: 'Status' },
    { key: 'created_at_text', label: 'Created At' },
    { key: 'start_date', label: 'Start Date' },
    { key: 'trial_end_date', label: 'Trial End Date' },
    { key: 'end_date', label: 'End Date' },
    { key: 'coupon_code', label: 'Coupon Code' },
    { key: 'original_price', label: 'Original Price' },
    { key: 'paid_amount', label: 'Paid Amount' },
    { key: 'paid_via', label: 'Paid Via' },
    { key: 'transaction_id', label: 'Payment Transaction ID' },
  ];

  const filteredRows = rows.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return [
      r.business_name,
      r.package_name,
      r.status,
      r.created_at_text,
      r.start_date,
      r.end_date,
      r.trial_end_date,
      r.coupon_code,
      r.paid_via,
      r.transaction_id,
      String(r.original_price),
      String(r.paid_amount),
    ].some((v) => (v || "").toString().toLowerCase().includes(q));
  });

  const exportCSV = () => {
    const cols = allColumns.filter(c => visibleColumns[c.key]);
    const header = cols.map(c => '"' + c.label.replace(/"/g, '""') + '"').join(',');
    const lines = filteredRows.map(r => cols.map(c => '"' + (r[c.key] ?? '').toString().replace(/"/g, '""') + '"').join(','));
    const csv = [header, ...lines].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'package_subscriptions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportExcel = () => {
    // Simple Excel via CSV with .xlsx extension for rapid export
    const cols = allColumns.filter(c => visibleColumns[c.key]);
    const header = cols.map(c => c.label).join('\t');
    const lines = filteredRows.map(r => cols.map(c => (r[c.key] ?? '')).join('\t'));
    const tsv = [header, ...lines].join('\n');
    const blob = new Blob([tsv], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'package_subscriptions.xlsx';
    a.click();
    URL.revokeObjectURL(url);
  };

  const printTable = () => {
    const cols = allColumns.filter(c => visibleColumns[c.key]);
    const thead = `<tr>${cols.map(c => `<th>${c.label}</th>`).join('')}</tr>`;
    const tbody = filteredRows.map(r => `<tr>${cols.map(c => `<td>${(r[c.key] ?? '').toString()}</td>`).join('')}</tr>`).join('');
    const html = `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Package Subscriptions</title>
          <style>
            @page { size: auto; margin: 12mm; }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; font-family: Arial, sans-serif; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 6px; text-align: left; font-size: 12px; }
            th { background: #f5f5f5; }
            h1 { font-size: 16px; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <h1>Package Subscriptions</h1>
          <table>
            <thead>${thead}</thead>
            <tbody>${tbody}</tbody>
          </table>
        </body>
      </html>`;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow?.document;
    if (!doc) return;
    doc.open();
    doc.write(html);
    doc.close();
    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print(); // Triggers Chrome print preview; user selects device
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    };
  };

  const exportPDF = async () => {
    try {
      const params = {};
      if (selectedStatus && selectedStatus !== 'all') params.status = selectedStatus;
      if (selectedPackage && selectedPackage !== 'all') params.package_name = selectedPackage;
      if (dateFrom) params.date_from = dateFrom.format('YYYY-MM-DD');
      if (dateTo) params.date_to = dateTo.format('YYYY-MM-DD');
      const res = await exportPackageSubscriptionsPdf(params);
      console.log(res.status);

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setShowPdfModal(true);
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || 'Failed to export PDF');
    }
  };

  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const allChecked = allColumns.every((c) => visibleColumns[c.key]);
  const someChecked = allColumns.some((c) => visibleColumns[c.key]);
  const toggleAllColumns = (checked) => {
    const next = {};
    allColumns.forEach((c) => { next[c.key] = !!checked; });
    // Always keep actions column visible to avoid losing controls
    next.actions = true;
    setVisibleColumns((prev) => ({ ...prev, ...next }));
  };

  return (
    <>
      <div className="row x-gap-15 border-bottom-light pb-20 mb-20">
        <div className="col-sm-3">
          <h1 className="text-14 fw-500 lh-14">Packages</h1>
          <select className="form-select bg-white border-light rounded-8 px-10 h-45 w-100 mt-5" value={selectedPackage} onChange={(e) => setSelectedPackage(e.target.value)}>
            <option value="all">All</option>
            {packages.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div className="col-sm-3">
          <h1 className="text-14 fw-500 lh-14">Status</h1>
          <select className="form-select bg-white border-light rounded-8 px-10 h-45 w-100 mt-5" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <option value="all">All</option>
            <option value="Approved">Approved</option>
            <option value="Declined">Declined</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
        <div className="col-sm-3">
          <h1 className="text-14 fw-500 lh-14 mb-5">Created At</h1>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateRangePicker
              slotProps={{
                textField: {
                  sx: {
                    width: "100%",
                    "& .MuiPickersInputBase-root": { height: 45 },
                  },
                },
              }}
              value={[dateFrom, dateTo]}
              onChange={(newValue) => {
                setDateFrom(newValue?.[0] || null);
                setDateTo(newValue?.[1] || null);
              }}
            />
          </LocalizationProvider>
        </div>
      </div>
      <div className="overflow-scroll scroll-bar-1">
        <div className="d-flex items-center justify-between mb-10 mt-5">
          <div className="position-relative d-flex items-center w-180 sm:w-full">
            <input
              type="text"
              placeholder="Search..."
              className="border-light bg-white rounded-8 px-10 py-5 pl-30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
          <div className="d-flex items-center gap-2">
            <button className="button border-light px-15 py-5 text-12 fw-500 rounded-8" onClick={exportCSV}>
              Export CSV
            </button>
            <button className="button border-light px-15 py-5 text-12 fw-500 rounded-8" onClick={exportExcel}>
              Export Excel
            </button>
            <button className="button border-light px-15 py-5 text-12 fw-500 rounded-8" onClick={printTable}>
              Print
            </button>
            <div className="position-relative">
              <button className="button border-light px-15 py-5 text-12 fw-500 rounded-8" onClick={() => setShowColumnPicker(true)}>
                Column Visibility
              </button>
              <Dialog
                open={showColumnPicker}
                onClose={() => setShowColumnPicker(false)}
                aria-labelledby="column-visibility-title"
                aria-describedby="column-visibility-description"
              >
                <div className="px-20 py-20 w-360 sm:w-full">
                  <div className="row x-gap-15 y-gap-10">
                    <div className="col-12">
                      <h1 className="text-16 fw-500 lh-14" id="column-visibility-title">Column Visibility</h1>
                    </div>
                    <div className="col-12">
                      <label className="d-flex items-center gap-2 text-16 fw-500 py-5 cursor-pointer">
                        <Checkbox size="small" className="px-0 py-0" checked={allChecked} indeterminate={!allChecked && someChecked} onChange={(e) => toggleAllColumns(e.target.checked)} />
                        Select all
                      </label>
                      {allColumns.map((c) => (
                        <label key={c.key} className="d-flex items-center gap-2 text-12 py-5 cursor-pointer">
                          <Checkbox size="small" className="py-0" checked={!!visibleColumns[c.key]} onChange={() => toggleColumn(c.key)} />
                          {c.label}
                        </label>
                      ))}
                    </div>
                    <div className="col-12 d-flex justify-end gap-2 mt-10">
                      <button className="text-12 border-light rounded-8 px-10 py-5" onClick={() => setShowColumnPicker(false)}>Close</button>
                    </div>
                  </div>
                </div>
              </Dialog>
            </div>
            {/* <button className="button border-light px-15 py-5 text-12 fw-500 rounded-8" onClick={exportPDF}>
              Export PDF
            </button> */}
          </div>
        </div>
        <table className="table-2 col-12 text-12 text-nowrap">
          <thead>
            <tr className="text-light-1 fw-600">
              {visibleColumns.business_name && (<th>Business Name</th>)}
              {visibleColumns.package_name && (<th>Package Name</th>)}
              {visibleColumns.status && (<th>Status</th>)}
              {visibleColumns.created_at_text && (<th>Created At</th>)}
              {visibleColumns.start_date && (<th>Start Date</th>)}
              {visibleColumns.trial_end_date && (<th>Trial End Date</th>)}
              {visibleColumns.end_date && (<th>End Date</th>)}
              {visibleColumns.coupon_code && (<th>Coupon Code</th>)}
              {visibleColumns.original_price && (<th>Original Price</th>)}
              {visibleColumns.paid_amount && (<th>Paid Amount</th>)}
              {visibleColumns.paid_via && (<th>Paid Via</th>)}
              {visibleColumns.transaction_id && (<th>Payment Transaction ID</th>)}
              {visibleColumns.actions && (<th>Actions</th>)}
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row, index) => (
              <tr key={index} className="text-12">
                {visibleColumns.business_name && (<td className="align-middle text-12">{row.business_name}</td>)}
                {visibleColumns.package_name && (<td className="align-middle text-12">{row.package_name}</td>)}
                {visibleColumns.status && (<td className="align-middle">
                  <span
                    className={`rounded-100 px-10 text-center text-12 fw-500 ${{
                      Declined: "bg-red-1 text-white",
                      Approved: "bg-green-3 text-white",
                      Pending: "bg-yellow-3 text-white",
                    }[row.status] || "bg-light-2 text-light-1"
                      }`}
                  >
                    {row.status}
                  </span>
                </td>)}
                {visibleColumns.created_at_text && (<td className="align-middle text-12">{row.created_at_text}</td>)}
                {visibleColumns.start_date && (<td className="align-middle text-12">{row.start_date}</td>)}
                {visibleColumns.trial_end_date && (<td className="align-middle text-12">{row.trial_end_date}</td>)}
                {visibleColumns.end_date && (<td className="align-middle text-12">{row.end_date}</td>)}
                {visibleColumns.coupon_code && (<td className="align-middle text-12">{row.coupon_code}</td>)}
                {visibleColumns.original_price && (<td className="align-middle text-12">{row.original_price}</td>)}
                {visibleColumns.paid_amount && (<td className="align-middle text-12">{row.paid_amount}</td>)}
                {visibleColumns.paid_via && (<td className="align-middle text-12">{row.paid_via}</td>)}
                {visibleColumns.transaction_id && (<td className="align-middle text-12">{row.transaction_id}</td>)}
                {visibleColumns.actions && (<td className="align-middle d-flex items-center gap-1">
                  <span
                    className="border-blue-1 text-blue-1 rounded-8 px-10 text-center text-12 fw-500 cursor-pointer"
                    onClick={() => { setActiveRow(row); setStatusValue(row.status || 'Pending'); setTxnId(row.transaction_id || ''); setShowStatusModal(true); }}
                  >
                    Status
                  </span>
                  <span
                    className="border-green-2 text-green-2 rounded-8 px-10 text-center text-12 fw-500 cursor-pointer"
                    onClick={() => {
                      const parse = (s) => {
                        if (!s) return null;
                        const d = dayjs(s, ["YYYY-MM-DD", "DD/MM/YYYY"], true);
                        return d.isValid() ? d : null;
                      };
                      setActiveRow(row);
                      setEditStart(parse(row.start_date));
                      setEditEnd(parse(row.end_date));
                      setEditTrialEnd(parse(row.trial_end_date));
                      setShowEditModal(true);
                    }}
                  >
                    Edit
                  </span>
                </td>)}
              </tr>
            ))}
          </tbody>
        </table>
        <StatusModal
          isOpen={showStatusModal}
          onClose={onStatusModalClose}
          row={activeRow}
          statusValue={statusValue}
          setStatusValue={setStatusValue}
          txnId={txnId}
          setTxnId={setTxnId}
          onSubmit={async () => {
            try {
              if (!activeRow) return;
              await updatePackageSubscriptionStatus(activeRow.id, { status: statusValue, transaction_id: txnId });
              toast.success('Status updated');
              onStatusModalClose();
              reload();
            } catch (e) {
              toast.error(e?.response?.data?.message || e?.message || 'Failed to update status');
            }
          }}
        />
        <EditModal
          isOpen={showEditModal}
          onClose={onEditModalClose}
          editStart={editStart}
          setEditStart={setEditStart}
          editEnd={editEnd}
          setEditEnd={setEditEnd}
          editTrialEnd={editTrialEnd}
          setEditTrialEnd={setEditTrialEnd}
          onSubmit={async () => {
            try {
              if (!activeRow) return;
              const payload = {
                start_date: (editStart && editStart.isValid()) ? editStart.format('YYYY-MM-DD') : null,
                end_date: (editEnd && editEnd.isValid()) ? editEnd.format('YYYY-MM-DD') : null,
                trial_end_date: (editTrialEnd && editTrialEnd.isValid()) ? editTrialEnd.format('YYYY-MM-DD') : null,
              };
              await updatePackageSubscription(activeRow.id, payload);
              toast.success('Subscription updated');
              onEditModalClose();
              reload();
            } catch (e) {
              toast.error(e?.response?.data?.message || e?.message || 'Failed to update subscription');
            }
          }}
        />
        <Dialog open={showPdfModal} onClose={() => { if (pdfUrl) URL.revokeObjectURL(pdfUrl); setShowPdfModal(false); setPdfUrl(null); }} aria-labelledby="pdf-preview-title">
          <div className="px-20 py-20 w-900 sm:w-full">
            <div className="d-flex items-center justify-between mb-10">
              <h1 id="pdf-preview-title" className="text-16 fw-500">PDF Preview</h1>
              <div className="d-flex items-center gap-2">
                {pdfUrl && (
                  <a href={pdfUrl} download={`package_subscriptions.pdf`} className="button border-light px-10 py-5 text-12 fw-500 rounded-8">Download</a>
                )}
                <button className="button border-light px-10 py-5 text-12 fw-500 rounded-8" onClick={() => { if (pdfUrl) URL.revokeObjectURL(pdfUrl); setShowPdfModal(false); setPdfUrl(null); }}>Close</button>
              </div>
            </div>
            {pdfUrl && (
              <iframe src={pdfUrl} style={{ width: '100%', height: '80vh', border: 'none' }} />
            )}
          </div>
        </Dialog>
      </div>
    </>
  );
};

const StatusModal = ({ isOpen, onClose, row, statusValue, setStatusValue, txnId, setTxnId, onSubmit }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-title"
    >
      <div className="px-20 py-20 w-500 sm:w-full">
        <div className="row x-gap-15 y-gap-15">
          <div className="col-12">
            <h1 className="text-18 fw-500 lh-14">Subscription Status</h1>
          </div>
          <div className="col-12 mt-5">
            <h1 className="text-14 fw-500 lh-14">Status</h1>
            <select className="form-select bg-white border-light rounded-8 px-10 h-45 w-100 mt-5" value={statusValue} onChange={(e) => setStatusValue(e.target.value)}>
              <option value="Declined">Declined</option>
              <option value="Pending">In Progress</option>
              <option value="Approved">Approved</option>
            </select>
          </div>

          <div className="col-12 mt-5">
            <h1 className="text-14 fw-500 lh-14">Payment Transaction ID</h1>
            <input
              type="text"
              placeholder="Enter Transaction ID"
              className="border-light bg-white rounded-8 px-10 py-5 w-100 mt-5"
              value={txnId}
              onChange={(e) => setTxnId(e.target.value)}
            />
          </div>
        </div>
        <div className="d-flex justify-end gap-2 mt-10">
          <button
            className="text-14 border-light rounded-8 px-10 py-5"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="text-14 bg-blue-1 text-white fw-500 rounded-8 px-10 py-5"
            onClick={onSubmit}
          >
            Update
          </button>
        </div>
      </div>
    </Dialog>
  );
};

const EditModal = ({ isOpen, onClose, editStart, setEditStart, editEnd, setEditEnd, editTrialEnd, setEditTrialEnd, onSubmit }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-title"
    >
      <div className="px-20 py-20 w-500 sm:w-full">
        <div className="row x-gap-15 y-gap-15">
          <div className="col-12">
            <h1 className="text-18 fw-500 lh-14">Edit Subscription</h1>
          </div>
          <div className="col-12 mt-5">
            <h1 className="text-14 fw-500 lh-14 mb-5">Start Date</h1>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                slotProps={{
                  textField: {
                    sx: {
                      width: "100%",
                      "& .MuiPickersInputBase-root": { height: 45 },
                    },
                  },
                }}
                value={editStart}
                onChange={(v) => setEditStart(v)}
              />
            </LocalizationProvider>
          </div>

          <div className="col-12 mt-5">
            <h1 className="text-14 fw-500 lh-14 mb-5">End Date</h1>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                slotProps={{
                  textField: {
                    sx: {
                      width: "100%",
                      "& .MuiPickersInputBase-root": { height: 45 },
                    },
                  },
                }}
                value={editEnd}
                onChange={(v) => setEditEnd(v)}
              />
            </LocalizationProvider>
          </div>

          <div className="col-12 mt-5">
            <h1 className="text-14 fw-500 lh-14 mb-5">Trial End Date</h1>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                slotProps={{
                  textField: {
                    sx: {
                      width: "100%",
                      "& .MuiPickersInputBase-root": { height: 45 },
                    },
                  },
                }}
                value={editTrialEnd}
                onChange={(v) => setEditTrialEnd(v)}
              />
            </LocalizationProvider>
          </div>
        </div>
        <div className="d-flex justify-end gap-2 mt-10">
          <button
            className="text-14 border-light rounded-8 px-10 py-5"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="text-14 bg-blue-1 text-white fw-500 rounded-8 px-10 py-5"
            onClick={onSubmit}
          >
            Update
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default index;
