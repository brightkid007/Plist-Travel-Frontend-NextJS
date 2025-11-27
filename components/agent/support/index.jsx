"use client";

import AgentDashboardLayout from "../common/layout";
import { useRef, useState } from "react";
import { Alert, Drawer, Snackbar } from "@mui/material";
import Filter from "@/components/agent/common/Filter";
import { ArrowForwardIos } from "@mui/icons-material";
import svgIcon from "@/components/data/svgIcon";

const index = () => {
  const [openFilter, setOpenFilter] = useState(false);
  const handleClose = () => {
    setOpenFilter(false);
  };

  const [isNewTicket, setIsNewTicket] = useState(false);

  const tickets = [
    {
      ticket_id: "TKT-1234",
      subject: "Issue with booking confirmation",
      reviews: 3,
      category: "Booking",
      priority: "High",
      status: "Open",
      last_updated: "2024-04-18",
    },
    {
      ticket_id: "TKT-1235",
      subject: "Payment not processing",
      reviews: 5,
      category: "Payment",
      priority: "Critical",
      status: "In Progress",
      last_updated: "2024-04-14",
    },
    {
      ticket_id: "TKT-1236",
      subject: "Request for refund",
      reviews: 4,
      category: "Refund",
      priority: "Medium",
      status: "Closed",
      last_updated: "2024-04-11",
    },
    {
      ticket_id: "TKT-1237",
      subject: "API integration issue",
      reviews: 1,
      category: "Technical",
      priority: "Medium",
      status: "Open",
      last_updated: "2024-04-14",
    },
    {
      ticket_id: "TKT-1238",
      subject: "Commission calculation error",
      reviews: 6,
      category: "Commission",
      priority: "High",
      status: "In Progress",
      last_updated: "2024-04-13",
    },
  ];

  const statusColor = (status) => {
    switch (status) {
      case "Open":
        return "bg-green-4 text-green-2";
      case "Closed":
        return "bg-light-2 text-dark-1";
      case "In Progress":
        return "bg-info-1 text-info-2";
      default:
        return "bg-light-2 text-light-2";
    }
  };

  const priorityColor = (priority) => {
    switch (priority) {
      case "Medium":
        return "bg-info-1 text-info-2";
      case "High":
        return "bg-yellow-4 text-dark-yellow";
      case "Critical":
        return "bg-error-1 text-error-2";
      default:
        return "bg-light-2 text-light-2";
    }
  };

  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [message, setMessage] = useState("");

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      if (img.width > 800 || img.height > 400) {
        failedUpload(
          `Image is too large! Max size is 800x400px. Yours is ${img.width}x${img.height}px.`
        );
      } else {
        setFileName(file.name);
      }
    };
  };

  const failedUpload = (message) => {
    setMessage(message || "Failed to upload image.");
    setShowSnackbar(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <AgentDashboardLayout>
      <div className="row y-gap-10 x-gap-10 items-center mb-10">
        <div className="col-auto">
          <h1 className="text-30 lh-14 fw-600">Support Center</h1>
          <div className="text-14 lh-14 text-light-1">
            Get help with any issues or questions
          </div>
        </div>
        <div className="col-auto ms-auto">
          <button
            className="button border-blue-1 text-blue-1 px-15 py-10 rounded-8"
            onClick={() => setOpenFilter(true)}
          >
            Filter
          </button>
          <Drawer anchor="right" open={openFilter} onClose={handleClose}>
            <div className="w-300 rounded-left rounded-8 bg-white px-20 py-20 h-100 d-flex flex-column justify-between">
              <Filter />
              <div className="col-12 d-flex justify-end gap-2">
                <button
                  className="border-light rounded-8 py-5 px-15 text-14"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-1 text-white rounded-8 py-5 px-15 text-14"
                  onClick={handleClose}
                >
                  Save
                </button>
              </div>
            </div>
          </Drawer>
        </div>
        <div className="col-auto">
          <button
            className="button bg-blue-1 text-white px-15 fw-400 py-10 rounded-8"
            onClick={() => setIsNewTicket(true)}
          >
            New Ticket
          </button>
        </div>
      </div>

      <div className="bg-white rounded-8 border-light px-20 py-15">
        <h1 className="text-24 lh-14 fw-500">Support Tickets</h1>
        <div className="text-14 lh-14 text-light-1">
          View and manage your support tickets
        </div>
        <div className="bg-white rounded-8 border-light px-15 py-5 mt-10">
          <div className="overflow-scroll scroll-bar-1">
            <table className="table-2 col-12 text-14">
              <thead className="text-nowrap">
                <tr className="text-light-1 fw-600">
                  <th>Ticket ID</th>
                  <th>Subject</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Last Updated</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((row, index) => (
                  <tr key={index}>
                    <td className="align-middle">{row.ticket_id}</td>
                    <td className="align-middle">
                      {row.subject}
                      <span className="rounded-100 ms-2 px-10 text-center fw-500 text-12 bg-light-2">
                        {row.reviews}
                      </span>
                    </td>
                    <td className="align-middle">{row.category}</td>
                    <td className="align-middle">
                      <span
                        className={`rounded-100 px-15 text-center fw-500 text-12 ${priorityColor(
                          row.priority
                        )}`}
                      >
                        {row.priority}
                      </span>
                    </td>
                    <td className="align-middle">
                      <span
                        className={`rounded-100 px-15 text-center fw-500 text-12 ${statusColor(
                          row.status
                        )}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="align-middle">{row.last_updated}</td>
                    <td className="align-middle">
                      <ArrowForwardIos className="text-12 text-light-1" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isNewTicket && (
        <div className="bg-white rounded-8 border-light px-20 py-15 mt-10">
          <h1 className="text-24 lh-14 fw-500">Submit New Ticket</h1>
          <div className="text-14 lh-14 text-light-1">
            Create a new support ticket for any issues or questions
          </div>
          <div className="row y-gap-10 x-gap-10 mt-10">
            <div className="col-12">
              <h1 className="text-14 lh-14 fw-500">
                Subject<span className="text-red-1">*</span>
              </h1>
              <input
                className="border-light rounded-8 py-5 px-15 w-100 mt-5"
                type="text"
                placeholder="Brief description of your issue"
              />
            </div>

            <div className="col-sm-6">
              <h1 className="text-14 lh-14 fw-500">
                Category<span className="text-red-1">*</span>
              </h1>
              <select className="form-select rounded-8 border-light py-10 px-15 w-100 mt-5">
                <option value="Booking">Booking</option>
                <option value="Payment">Payment</option>
                <option value="Refund">Refund</option>
                <option value="Technical">Technical</option>
                <option value="Commission">Commission</option>
              </select>
            </div>

            <div className="col-sm-6">
              <h1 className="text-14 lh-14 fw-500">
                Priority<span className="text-red-1">*</span>
              </h1>
              <select className="form-select rounded-8 border-light py-10 px-15 w-100 mt-5">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div className="col-12">
              <h1 className="text-14 lh-14 fw-500">
                Description<span className="text-red-1">*</span>
              </h1>
              <textarea
                className="border-light rounded-8 py-5 px-15 w-100 mt-5"
                placeholder="Please provide as much detail as possible about your issue"
              />
            </div>

            <div className="col-12">
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <h1 className="text-14 lh-14 fw-500">Attachments (Optional)</h1>
              <div
                className="border-light border-dashed rounded-8 py-20 w-100 mt-5 d-flex flex-column items-center justify-center"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                {svgIcon.attachment}
                <div className="text-14 lh-14 text-light-1">
                  Drag and drop files, or click to browse
                </div>
                <div className="text-12 lh-14 text-light-1">
                  Max file size: 10MB
                </div>
                <button
                  className="text-14 border-light rounded-8 px-10 py-5 mt-5"
                  onClick={handleUploadClick}
                >
                  Upload Files
                </button>
              </div>
              <Snackbar
                anchorOrigin={{ horizontal: "right", vertical: "top" }}
                open={showSnackbar}
                autoHideDuration={3000}
                onClose={() => setShowSnackbar(false)}
              >
                <Alert
                  severity="warning"
                  variant="filled"
                  sx={{ width: "100%" }}
                >
                  {message}
                </Alert>
              </Snackbar>
            </div>

            <div className="d-flex justify-end gap-2 mt-10">
              <button
                className="text-14 border-light rounded-8 px-10 py-5"
                onClick={() => setIsNewTicket(false)}
              >
                Cancel
              </button>
              <button
                className="text-14 bg-blue-1 text-white rounded-8 px-10 py-5 fw-400"
                onClick={() => setIsNewTicket(false)}
              >
                Submit Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </AgentDashboardLayout>
  );
};

export default index;
