import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Divider } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ReplayIcon from "@mui/icons-material/Replay";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";
import { CircularProgress } from "@mui/material";
import { getTransactions, getTransactionById, refundTransaction, downloadTransactionInvoice, downloadAllInvoices } from "@/helpers/backend_helper";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { useRouter } from "next/navigation";

const index = () => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [transactionToRefund, setTransactionToRefund] = useState(null);
  const [refunding, setRefunding] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const response = await getTransactions();
      const transactionsData = response?.data?.transactions || response?.transactions || response?.data || [];
      const transactionsList = Array.isArray(transactionsData) ? transactionsData : [];
      setTransactions(transactionsList);
    } catch (error) {
      console.error("Error loading transactions:", error);
      toast.error(error?.message || "Failed to load payment history");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch (error) {
      return dateString;
    }
  };

  const formatAmount = (amount, currency = "USD") => {
    if (amount === null || amount === undefined) return "$0.00";
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(numAmount);
  };

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower === "completed" || statusLower === "paid") {
      return (
        <span className="text-10 fw-500 bg-green-1 text-green-3 rounded-100 px-15 border-green-3">
          {status === "completed" ? "Paid" : status}
        </span>
      );
    } else if (statusLower === "pending") {
      return (
        <span className="text-10 fw-500 bg-yellow-4 text-dark-yellow rounded-100 px-15 border-dark-yellow">
          Pending
        </span>
      );
    } else if (statusLower === "failed") {
      return (
        <span className="text-10 fw-500 bg-red-4 text-red-1 rounded-100 px-15 border-red-2">
          Failed
        </span>
      );
    } else if (statusLower === "refunded") {
      return (
        <span className="text-10 fw-500 bg-light-2 text-dark-1 rounded-100 px-15 border-light">
          Refunded
        </span>
      );
    } else {
      return (
        <span className="text-10 fw-500 bg-light-2 text-dark-1 rounded-100 px-15 border-light">
          {status || "Unknown"}
        </span>
      );
    }
  };

  const handleMenuClick = (event, transactionId) => {
    setAnchorEl(event.currentTarget);
    setSelectedTransactionId(transactionId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTransactionId(null);
  };

  const handleViewDetails = async (transactionId) => {
    try {
      setLoadingDetails(true);
      const response = await getTransactionById(transactionId);
      const transaction = response?.data?.transaction || response?.transaction || response?.data;
      setSelectedTransaction(transaction);
      setViewModalOpen(true);
      handleMenuClose();
    } catch (error) {
      console.error("Error loading transaction details:", error);
      toast.error(error?.message || "Failed to load transaction details");
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleDownloadInvoice = async (transaction) => {
    try {
      const invoiceId = transaction.invoice_number || transaction.reference_id || `TXN-${transaction.id}`;
      setDownloading(true);
      handleMenuClose();
      
      // Download the invoice PDF
      const response = await downloadTransactionInvoice(transaction.id);
      
      // The response might be the blob directly or have response.data with the blob
      const blobData = response?.data || response;
      
      // Create a blob from the response
      const blob = blobData instanceof Blob 
        ? blobData 
        : new Blob([blobData], { type: 'application/pdf' });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice_${invoiceId.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success(`Invoice ${invoiceId} downloaded successfully`);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to download invoice');
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadAll = async () => {
    if (transactions.length === 0) {
      toast.warning("No transactions to download");
      return;
    }
    
    try {
      setDownloading(true);
      // Download all invoices as a zip file
      const response = await downloadAllInvoices();
      
      // The response might be the blob directly or have response.data with the blob
      const blobData = response?.data || response;
      
      // Create a blob from the response
      const blob = blobData instanceof Blob 
        ? blobData 
        : new Blob([blobData], { type: 'application/zip' });
      
      // Create a URL for the blob
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element and trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `all_invoices_${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      
      toast.success(`All ${transactions.length} invoices downloaded successfully as ZIP file`);
    } catch (error) {
      console.error('Error downloading all invoices:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to download all invoices');
    } finally {
      setDownloading(false);
    }
  };

  const handleRefundClick = (transaction) => {
    setTransactionToRefund(transaction);
    setRefundModalOpen(true);
    handleMenuClose();
  };

  const handleRefundConfirm = async () => {
    if (!transactionToRefund) return;
    try {
      setRefunding(true);
      // await refundTransaction(transactionToRefund.id);
      toast.success("Sent refund request successfully");
      setRefundModalOpen(false);
      setTransactionToRefund(null);
      loadTransactions(); // Reload transactions
    } catch (error) {
      console.error("Error refunding transaction:", error);
      toast.error(error?.message || "Failed to refund transaction");
    } finally {
      setRefunding(false);
    }
  };

  const canRefund = (transaction) => {
    const status = transaction?.status?.toLowerCase();
    return status === "completed";
  };

  const canRetry = (transaction) => {
    const status = transaction?.status?.toLowerCase();
    return status === "failed" || status === "pending";
  };

  const handleRetry = (transaction) => {
    // Redirect to payment based on transaction type
    const type = transaction.type?.toLowerCase();
    
    if (type === "booking" && transaction.booking_id) {
      // Redirect to booking payment page
      router.push(`/vendor/bookings/${transaction.booking_id}/payment`);
    } else if (type === "vendor_subscription" || type === "subscription") {
      // Redirect to subscription page
      router.push(`/vendor/payment/subscription`);
    } else if (type === "deposit" || type === "withdraw") {
      // Redirect to wallet/deposit page if exists
      toast.info("Please go to your wallet to make a deposit");
    } else {
      // Generic retry - reload transaction or show message
      toast.info("Please contact support to retry this payment");
    }
    handleMenuClose();
  };

  const formatTransactionType = (type) => {
    if (!type) return "Transaction";
    
    const typeLower = type.toLowerCase();
    
    // Map backend types to user-friendly names
    const typeMap = {
      "deposit": "Deposit",
      "withdraw": "Withdraw",
      "booking": "Booking",
      "subscription": "Subscription",
    };
    
    return typeMap[typeLower] || type.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <>
      <div className="d-flex flex-wrap justify-between items-center">
        <div>
          <h1 className="text-20 fw-600 ">Payment History</h1>
          <div className="text-14 text-light-1">
            View your past payments and invoices
          </div>
        </div>
        <div className="ms-auto">
          <button 
            className="button border-light text-14 fw-500 rounded-8 py-10 px-15 bg-white"
            onClick={handleDownloadAll}
            disabled={transactions.length === 0 || downloading}
          >
            <DownloadIcon className="mr-5" />
            Download All Invoices
            {downloading && <CircularProgress size={20} className="ml-10" />}
          </button>
        </div>
      </div>
      <div className="border-light mt-30 bg-white rounded-8 shadow-4 px-20">
        <div className="overflow-scroll scroll-bar-1">
          <table className="table-2 col-12">
            <thead className="text-light-1">
              <tr>
                <th>Date</th>
                <th>Invoice ID</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-40">
                    <CircularProgress size={24} />
                    <p className="text-14 text-light-1 mt-10">Loading payment history...</p>
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-40">
                    <p className="text-14 text-light-1">No payment history found.</p>
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{formatDate(transaction.paid_at || transaction.created_at || transaction.createdAt)}</td>
                    <td>{transaction.invoice_number || transaction.reference_id || `TXN-${transaction.id}`}</td>
                    <td>
                      {transaction.description || formatTransactionType(transaction.type)}
                    </td>
                    <td>{formatAmount(transaction.amount, transaction.currency)}</td>
                    <td>{getStatusBadge(transaction.status)}</td>
                    <td>
                      <div className="position-relative">
                        <MoreHorizIcon 
                          className="cursor-pointer" 
                          onClick={(e) => handleMenuClick(e, transaction.id)}
                        />
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl) && selectedTransactionId === transaction.id}
                          onClose={handleMenuClose}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                          }}
                        >
                          <MenuItem
                            onClick={() => handleViewDetails(transaction.id)}
                            className="text-12 d-flex items-center gap-2"
                          >
                            <VisibilityIcon sx={{ fontSize: 16 }} />
                            View Details
                          </MenuItem>
                          <MenuItem
                            onClick={() => handleDownloadInvoice(transaction)}
                            className="text-12 d-flex items-center gap-2"
                          >
                            <ReceiptIcon sx={{ fontSize: 16 }} />
                            Download Invoice
                          </MenuItem>
                          {/* {canRetry(transaction) && (
                            <MenuItem
                              onClick={() => handleRetry(transaction)}
                              className="text-12 d-flex items-center gap-2 text-orange-1"
                            >
                              <RefreshIcon sx={{ fontSize: 16 }} />
                              Retry Payment
                            </MenuItem>
                          )} */}
                          {canRefund(transaction) && (
                            <MenuItem
                              onClick={() => handleRefundClick(transaction)}
                              className="text-12 d-flex items-center gap-2 text-blue-1"
                            >
                              <ReplayIcon sx={{ fontSize: 16 }} />
                              Request Refund
                            </MenuItem>
                          )}
                        </Menu>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Transaction Details Modal */}
      <Dialog
        open={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedTransaction(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="d-flex justify-between items-center">
          <span className="text-18 fw-600">Transaction Details</span>
          <button
            onClick={() => {
              setViewModalOpen(false);
              setSelectedTransaction(null);
            }}
            className="border-0 bg-transparent cursor-pointer"
          >
            <CloseIcon />
          </button>
        </DialogTitle>
        <DialogContent>
          {loadingDetails ? (
            <div className="d-flex justify-center items-center py-40">
              <CircularProgress size={24} />
            </div>
          ) : selectedTransaction ? (
            <div className="d-flex flex-column gap-3">
              <div className="d-flex justify-between">
                <span className="text-14 text-light-1">Invoice ID:</span>
                <span className="text-14 fw-500">
                  {selectedTransaction.invoice_number || selectedTransaction.reference_id || `TXN-${selectedTransaction.id}`}
                </span>
              </div>
              <Divider />
              <div className="d-flex justify-between">
                <span className="text-14 text-light-1">Date:</span>
                <span className="text-14 fw-500">
                  {formatDate(selectedTransaction.paid_at || selectedTransaction.created_at || selectedTransaction.createdAt)}
                </span>
              </div>
              <Divider />
               <div className="d-flex justify-between">
                 <span className="text-14 text-light-1">Type:</span>
                 <span className="text-14 fw-500">
                   {formatTransactionType(selectedTransaction.type)}
                 </span>
               </div>
              <Divider />
              <div className="d-flex justify-between">
                <span className="text-14 text-light-1">Description:</span>
                <span className="text-14 fw-500 text-right">
                  {selectedTransaction.description || "N/A"}
                </span>
              </div>
              <Divider />
              <div className="d-flex justify-between">
                <span className="text-14 text-light-1">Amount:</span>
                <span className="text-14 fw-500">
                  {formatAmount(selectedTransaction.amount, selectedTransaction.currency)}
                </span>
              </div>
              <Divider />
              <div className="d-flex justify-between">
                <span className="text-14 text-light-1">Status:</span>
                <span>{getStatusBadge(selectedTransaction.status)}</span>
              </div>
              {selectedTransaction.booking_id && (
                <>
                  <Divider />
                  <div className="d-flex justify-between">
                    <span className="text-14 text-light-1">Booking ID:</span>
                    <span className="text-14 fw-500">{selectedTransaction.booking_id}</span>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="text-14 text-light-1">No transaction details available</div>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setViewModalOpen(false);
              setSelectedTransaction(null);
            }}
            className="text-14"
          >
            Close
          </Button>
          {selectedTransaction && (
            <Button
              onClick={() => handleDownloadInvoice(selectedTransaction)}
              className="text-14"
              startIcon={<DownloadIcon />}
            >
              Download Invoice
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Refund Confirmation Modal */}
      <ConfirmationModal
        open={refundModalOpen}
        onClose={() => {
          setRefundModalOpen(false);
          setTransactionToRefund(null);
        }}
        onConfirm={handleRefundConfirm}
        title="Request Refund"
        message={`Are you sure you want to request a refund for ${transactionToRefund?.invoice_number || transactionToRefund?.reference_id || `transaction #${transactionToRefund?.id}`}? This action will process a refund of ${transactionToRefund ? formatAmount(transactionToRefund.amount, transactionToRefund.currency) : ""}.`}
        itemName={transactionToRefund?.invoice_number || transactionToRefund?.reference_id || `Transaction #${transactionToRefund?.id}`}
        loading={refunding}
        confirmLabel="Confirm Refund"
        confirmingLabel="Processing Refund..."
      />
    </>
  );
};

export default index;
