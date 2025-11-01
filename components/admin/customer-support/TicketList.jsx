import { useEffect, useState } from "react";
import { User, Inbox } from "lucide-react";
import { getConversations } from "@/helpers/backend_helper";

const TicketList = ({ filterType = "all", onSelectTicket }) => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getConversations();
        const conversations = res?.conversations || res?.data?.conversations || res?.data || res || [];
        console.log(conversations);
        const mapped = (Array.isArray(conversations) ? conversations : []).map((c) => ({
          ticket_id: c.ticket_id || c.id || `TKT-${c.id}`,
          customer_name: c.user?.user_profile?.first_name && c.user?.user_profile?.last_name
            ? `${c.user.user_profile.first_name} ${c.user.user_profile.last_name}`
            : c.user?.email?.split("@")[0] || "Unknown",
          customer_email: c.user?.email || "—",
          issue: c.subject || c.ticket_id || "No subject",
          ticket_type: c.type || c.category || "Other",
          status: c.status || "Open",
          priority: c.priority || "Medium",
          last_updated: c.updated_at || c.updatedAt || c.created_at || c.createdAt || "—",
          conversation_id: c.id,
        }));
        setTickets(mapped);
      } catch (_) {
        setTickets([]);
      }
    };
    load();
  }, [filterType]);

  const filteredTickets = filterType !== "all" 
    ? tickets.filter((t) => t.ticket_type?.toLowerCase().includes(filterType.toLowerCase()))
    : tickets;

  return (
    <div className="overflow-scroll scroll-bar-1 pt-0">
      <table className="table-2 col-12">
        <thead>
          <tr className="text-light-1 fw-600">
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
          {filteredTickets.length === 0 ? (
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
            filteredTickets.map((row, index) => (
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
              <td className="align-middle">
                <span
                  className={`rounded-100 px-15 text-center text-12 fw-500 ${
                    {
                      Open: "bg-red-4 text-red-1",
                      "In Progress": "bg-dark-blue text-white",
                      Resolved: "bg-light-2 text-dark-1",
                    }[row.status] || "bg-gray-4 text-gray-3"
                  }`}
                >
                  {row.status}
                </span>
              </td>
              <td className="align-middle">
                <span
                  className={`rounded-100 px-15 text-center text-12 fw-500 ${
                    {
                      Medium: "bg-yellow-4 text-brown-1",
                      High: "bg-red-3 text-brown-1",
                    }[row.priority] || "bg-gray-4 text-gray-3"
                  }`}
                >
                  {row.priority}
                </span>
              </td>
              <td className="align-middle">{row.last_updated}</td>
              <td className="align-middle">
                <span className="material-symbols-outlined">more_horiz</span>
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
