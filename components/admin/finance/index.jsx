"use client";

import AdminDashboardLayout from "../common/layout";
import { useRouter } from "next/navigation";
import { BookOpen, MoreVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { CircularProgress, Menu, MenuItem } from "@mui/material";
import DashboardCard from "./components/DashboardCard";
import { getTransactions, getPaymentAnalytics, refundTransaction } from "@/helpers/backend_helper";
import { toast } from "react-toastify";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { usePermissions } from "@/hooks/usePermissions";

const index = () => {
  const router = useRouter();
  const { hasPermission } = usePermissions();
  const [activeTab, setActiveTab] = useState("all");
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => {
    setShowModal(false);
  };

  const [summaryCards, setSummaryCards] = useState([
    { title: "Total Revenue", amount: "-", improve: "", icon: "/img/dashboard/icons/1.svg", description: "Total income from all sources" },
    { title: "Pending Payments", amount: "-", improve: "", icon: "/img/dashboard/icons/3.svg", description: "Amount yet to be paid" },
    { title: "Refund Requests", amount: "-", improve: "", icon: "/img/dashboard/icons/2.svg", description: "Requests awaiting refund processing" },
    { title: "Agent Wallet Balance", amount: "-", improve: "", icon: "/img/dashboard/icons/4.svg", description: "Total wallet balance of all agents" },
  ]);


  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuAnchor, setMenuAnchor] = useState({});
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [entryToRefund, setEntryToRefund] = useState(null);
  const [refunding, setRefunding] = useState(false);
  const exportFinanceCSV = () => {
    try {
      const cols = [
        { key: 'invoice', label: 'Invoice' },
        { key: 'customer', label: 'Customer/Vendor' },
        { key: 'amount', label: 'Amount' },
        { key: 'status', label: 'Status' },
        { key: 'date', label: 'Date' },
      ];
      const header = cols.map(c => '"' + c.label.replace(/"/g, '""') + '"').join(',');
      const lines = entries
        .filter((item) => (activeTab === 'all' ? true : item.status.toLowerCase() === activeTab))
        .map((r) => cols.map(c => {
          const v = r[c.key];
          return '"' + (v instanceof Date ? v.toISOString() : (v ?? '')).toString().replace(/"/g, '""') + '"';
        }).join(','));
      const csv = [header, ...lines].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'finance_transactions.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      toast.error(e?.message || 'Failed to export data');
    }
  };

  const load = async () => {
    try {
      setLoading(true);
      const [txRes, anRes] = await Promise.all([getTransactions(), getPaymentAnalytics()]);
      const an = anRes?.data || anRes || {};
      const list = txRes?.transactions || txRes?.data?.transactions || txRes?.data || [];
      const mapped = list.map((t) => ({
        id: t.id,
        invoice: t.invoice_number || t.reference_id || '-', 'customer': t.customer_name || '-',
        amount: `$${Number(t.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        status: ({ completed: 'Paid', pending: 'Pending', failed: 'Overdue', refunded: 'Refunded' }[t.status] || t.status || '-'),
        date: t.paid_at || t.created_at,
        action: 'View'
      }));
      setEntries(mapped);
      setSummaryCards([
        { title: 'Total Revenue', amount: `$${Number(an.total_revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, improve: '', icon: '/img/dashboard/icons/1.svg', description: 'Total income from all sources' },
        { title: 'Pending Payments', amount: `$${Number(an.pending_payments?.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, improve: `${an.pending_payments?.count || 0} pending invoices`, icon: '/img/dashboard/icons/3.svg', description: 'Amount yet to be paid' },
        { title: 'Refund Requests', amount: `$${Number(an.refund_requests?.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, improve: `${an.refund_requests?.count || 0} pending requests`, icon: '/img/dashboard/icons/2.svg', description: 'Requests awaiting refund processing' },
        { title: 'Agent Wallet Balance', amount: `$${Number(an.agent_wallet_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, improve: '', icon: '/img/dashboard/icons/4.svg', description: 'Total wallet balance of all agents' },
      ]);
    } catch (e) {
      toast.error(e?.message || 'Failed to load transactions');
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleMenuOpen = (event, entryId) => {
    event.stopPropagation();
    setMenuAnchor({ ...menuAnchor, [entryId]: event.currentTarget });
  };

  const handleMenuClose = (entryId) => {
    setMenuAnchor({ ...menuAnchor, [entryId]: null });
  };



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
          <h1 className="text-30 lh-14 fw-600">Financial Management</h1>
          <div className="text-14 lh-14 text-light-1">
            Manage invoices, refunds, and wallet transactions across the platform
          </div>
        </div>
        <div className="col-auto ms-auto">
          <button className="button border-blue-1 text-blue-1 px-15 py-10 rounded-8" onClick={exportFinanceCSV}>
            Export Data
          </button>
        </div>
      </div>

      <DashboardCard data={summaryCards} />

      <div className="row y-gap-10 x-gap-10 items-center mt-15 mb-10">
        <div className="col-auto">
          <div className="row px-10">
            {tabs.map((item) => (
              <div className="col-auto px-5" key={item.value}>
                <button
                  className={`text-14 px-10 fw-500 py-5 rounded-8 ${activeTab === item.value ? "bg-white" : "text-light-1"
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
      </div>
      <div className="bg-white rounded-8 border-light px-20 py-15">
        {/* <h1 className="text-24 lh-14 fw-500"> Manual Entries</h1>
        <div className="text-14 lh-14 text-light-1">
          Review and approve manually entered listing from vendors
        </div> */}
        <div className="bg-white rounded-8 border-light px-15 py-5 mt-10">
          <div className="overflow-scroll scroll-bar-1">
            <table className="table-2 text-14 col-12">
              <thead className="text-nowrap">
                <tr>
                  <th>Invoice</th>
                  <th>Customer/Vendor</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-20">
                      <div className="d-flex items-center justify-center gap-2 text-14 text-light-1">
                        <CircularProgress size={24} />
                        <span>Loading transactions...</span>
                      </div>
                    </td>
                  </tr>
                ) : (() => {
                  const filteredEntries = entries.filter((item) => {
                    return activeTab === "all"
                      ? true
                      : item.status.toLowerCase() === activeTab;
                  });
                  
                  if (filteredEntries.length === 0) {
                    return (
                      <tr>
                        <td colSpan="6" className="text-center py-20">
                          <div className="d-flex flex-column items-center justify-center gap-2 text-14 text-light-1">
                            <BookOpen size={32} className="text-light-1 mb-5" />
                            <span>No transactions found</span>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                  
                  return filteredEntries.map((entry, index) => (
                    <tr key={index}>
                      <td className="align-middle text-12 lh-16 fw-500">
                        {entry.invoice}
                      </td>
                      <td className="align-middle">
                        {entry.customer}
                      </td>
                      <td className="align-middle text-12 lh-16 fw-500">
                        {entry.amount}
                      </td>
                      <td className="align-middle text-12 lh-16 fw-500">
                        <span
                          className={`rounded-100 py-4 px-10 text-center text-12 fw-500 ${{
                            Pending: "bg-yellow-4 text-yellow-3",
                            Paid: "bg-green-4 text-green-3",
                            Refunded: "bg-red-3 text-red-2",
                            Overdue: "bg-blue-1-05 text-blue-1",
                          }[entry.status] || "bg-gray-4 text-gray-3"
                            }`}
                        >
                          {entry.status}
                        </span>
                      </td>
                      <td className="align-middle">
                        <div className="d-flex items-center gap-1 text-12 lh-16 fw-500">
                          {new Date(entry.date).toLocaleString()}
                        </div>
                      </td>
                      <td className="align-middle">
                        <div className="position-relative">
                          <button
                            className="border-0 bg-transparent cursor-pointer px-5 py-5"
                            onClick={(e) => handleMenuOpen(e, entry.id || index)}
                          >
                            <MoreVertical size={16} />
                          </button>
                          <Menu
                            anchorEl={menuAnchor[entry.id || index]}
                            open={Boolean(menuAnchor[entry.id || index])}
                            onClose={() => handleMenuClose(entry.id || index)}
                          >
                            <MenuItem
                              onClick={() => {
                                const canRefund = hasPermission("financial_management", "update") && 
                                                 entry?.status !== "Overdue" && 
                                                 entry?.status !== "Refunded";
                                if (!canRefund) {
                                  if (!hasPermission("financial_management", "update")) {
                                    toast.error("You don't have permission to refund transactions");
                                  } else if (entry?.status === "Overdue" || entry?.status === "Refunded") {
                                    toast.error(`Cannot refund ${entry?.status.toLowerCase()} transactions`);
                                  }
                                  handleMenuClose(entry.id || index);
                                  return;
                                }
                                setEntryToRefund(entry);
                                handleMenuClose(entry.id || index);
                                setRefundModalOpen(true);
                              }}
                              disabled={!hasPermission("financial_management", "update") || 
                                      entry?.status === "Overdue" || 
                                      entry?.status === "Refunded"}
                              className="text-blue-1"
                            >
                              Refund
                            </MenuItem>
                          </Menu>
                        </div>
                      </td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>
        </div>

        <ConfirmationModal
          open={refundModalOpen}
          onClose={() => {
            setRefundModalOpen(false);
            setEntryToRefund(null);
          }}
          onConfirm={async () => {
            if (!entryToRefund) return;
            try {
              setRefunding(true);
              await refundTransaction(entryToRefund.id);
              toast.success('Refund processed successfully');
              setRefundModalOpen(false);
              setEntryToRefund(null);
              load();
            } catch (e) {
              toast.error(e?.message || 'Failed to refund');
            } finally {
              setRefunding(false);
            }
          }}
          title="Refund Transaction"
          message={`Are you sure you want to refund ${entryToRefund?.invoice ? `invoice "${entryToRefund.invoice}"` : 'this transaction'}? This action cannot be undone.`}
          itemName={entryToRefund?.invoice || `Transaction #${entryToRefund?.id}`}
          loading={refunding}
          confirmLabel="Refund"
          confirmingLabel="Refunding..."
        />
      </div>
    </AdminDashboardLayout>
  );
};

export default index;
