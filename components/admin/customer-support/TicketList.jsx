import { User, Inbox, ChevronRight } from "lucide-react";
import { CircularProgress } from "@mui/material";

const TicketList = ({ filterType = "all", tickets = [], loading = false, onSelectTicket }) => {
  const formatDateTime = (dateString) => {
    if (!dateString || dateString === "—") return "—";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "—";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    } catch {
      return "—";
    }
  };

  const formatStatus = (status) => {
    if (!status) return "—";
    const statusMap = {
      open: "Open",
      in_progress: "In Progress",
      resolved: "Resolved",
      closed: "Closed",
    };
    return statusMap[status.toLowerCase()] || status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const formatPriority = (priority) => {
    if (!priority) return "—";
    const priorityMap = {
      low: "Low",
      medium: "Medium",
      high: "High",
      urgent: "Urgent",
    };
    return priorityMap[priority.toLowerCase()] || priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
  };

  const filteredTickets = filterType !== "all" 
    ? tickets.filter((t) => t.ticket_type?.toLowerCase().includes(filterType.toLowerCase()))
    : tickets;

  return (
    <div className="overflow-scroll scroll-bar-1 pt-0">
      <table className="table-2 col-12 text-14">
        <thead className="text-nowrap">
          <tr>
            <th>Id</th>
            <th>Customer</th>
            <th>Subject</th>
            <th>Ticket Type</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Last Updated</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={8} className="text-center py-20">
                <div className="d-inline-flex items-center justify-center gap-2 text-14 text-light-1">
                  <CircularProgress size={20} thickness={5} />
                  <span>Loading tickets...</span>
                </div>
              </td>
            </tr>
          )}
          {!loading && filteredTickets.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-40">
                <div className="d-flex flex-column items-center gap-10">
                  <div className="size-60 flex-center rounded-circle bg-light-2">
                    <Inbox size={32} className="text-light-1" />
                  </div>
                  <div className="text-16 text-light-1 fw-500">No tickets found.</div>
                  <div className="text-14 text-light-1">There are no support tickets matching your criteria.</div>
                </div>
              </td>
            </tr>
          ) : (
            !loading && filteredTickets.map((row, index) => (
            <tr 
              key={index}
              onClick={() => onSelectTicket?.(row.conversation_id)}
              style={{ cursor: onSelectTicket ? "pointer" : "default" }}
            >
              <td className="align-middle">{row.ticket_id}</td>
              <td className="align-middle">
                <div className="d-flex items-center gap-3">
                  <User size={18} className="text-light-1" />
                  <div className="d-flex flex-column items-start">
                    <div className="text-14 fw-600 lh-14">
                      {row.customer_name}
                    </div>
                    <div className="text-14 text-light-1 lh-14">
                      {row.customer_email}
                    </div>
                  </div>
                </div>
              </td>
              <td className="align-middle">{row.issue}</td>
              <td className="align-middle">{row.ticket_type}</td>
              <td className="align-middle" style={{ minWidth: "120px", whiteSpace: "nowrap" }}>
                <span
                  className={`rounded-100 px-15 py-5 text-center text-12 fw-500 ${
                    {
                      open: "bg-red-4 text-red-1",
                      in_progress: "bg-dark-blue text-white",
                      closed: "bg-light-2 text-dark-1",
                      resolved: "bg-green-4 text-green-2",
                    }[row.status?.toLowerCase()] || "bg-gray-4 text-gray-3"
                  }`}
                  style={{ whiteSpace: "nowrap", display: "inline-block" }}
                >
                  {formatStatus(row.status)}
                </span>
              </td>
              <td className="align-middle" style={{ minWidth: "100px", whiteSpace: "nowrap" }}>
                <span
                  className={`rounded-100 px-15 py-5 text-center text-12 fw-500 ${
                    {
                      medium: "bg-yellow-4 text-brown-1",
                      high: "bg-red-3 text-brown-1",
                      urgent: "bg-red-3 text-brown-1",
                      low: "bg-gray-4 text-gray-3",
                    }[row.priority?.toLowerCase()] || "bg-gray-4 text-gray-3"
                  }`}
                  style={{ whiteSpace: "nowrap", display: "inline-block" }}
                >
                  {formatPriority(row.priority)}
                </span>
              </td>
              <td className="align-middle">{formatDateTime(row.last_updated)}</td>
              <td className="align-middle">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTicket?.(row.conversation_id);
                  }}
                  style={{ cursor: onSelectTicket ? "pointer" : "default" }}
                >
                  <ChevronRight size={18} className="text-light-1" />
                </div>
              </td>
            </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TicketList;
