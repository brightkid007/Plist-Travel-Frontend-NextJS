import { useState, useEffect, useRef } from "react";
import { Send, User, Ticket, MessageSquare } from "lucide-react";
import { getMessagesByConversation, createMessage, getConversationById } from "@/helpers/backend_helper";
import { toast } from "react-toastify";
import { getLoggedInUser } from "@/helpers/backend_helper";

const Conversation = ({ ticketId }) => {
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (ticketId) {
      loadConversation();
      loadMessages();
    }
  }, [ticketId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "—";
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined });
    } catch {
      return "—";
    }
  };

  const formatStatus = (status) => {
    if (!status) return "Open";
    const statusMap = {
      open: "Open",
      in_progress: "In Progress",
      resolved: "Resolved",
      closed: "Closed",
    };
    return statusMap[status.toLowerCase()] || status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const formatPriority = (priority) => {
    if (!priority) return "";
    const priorityMap = {
      low: "Low",
      medium: "Medium",
      high: "High",
      urgent: "Urgent",
    };
    return priorityMap[priority.toLowerCase()] || priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
  };

  const loadConversation = async () => {
    try {
      const res = await getConversationById(ticketId);
      setConversation(res?.conversation || res?.data?.conversation || res);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to load conversation");
    }
  };

  const loadMessages = async () => {
    try {
      setLoadingMessages(true);
      const res = await getMessagesByConversation(ticketId);
      const messagesList = res?.messages || res?.data?.messages || res?.data || res || [];
      const currentUser = getLoggedInUser();
      const currentUserId = currentUser?.id || currentUser?.userId || null;
      const mapped = messagesList.map((m) => {
        const messageUserId = m.user?.id || m.user?.userId || m.user_id;
        const isSupport = m.user?.role === "admin" || String(messageUserId) === String(currentUserId);
        
        return {
          id: m.id,
          user: m.user?.user_profile?.first_name && m.user?.user_profile?.last_name
            ? `${m.user.user_profile.first_name} ${m.user.user_profile.last_name}`
            : m.user?.email?.split("@")[0] || "Support",
          timestamp: m.created_at || m.createdAt || new Date().toISOString(),
          text: m.content || m.message || m.text || "",
          isSupport,
          email: m.user?.email || "",
        };
      });
      setMessages(mapped);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to load messages");
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !ticketId || loading) return;
    setLoading(true);
    try {
      await createMessage({
        conversation_id: ticketId,
        content: newMessage,
      });
      setNewMessage("");
      await loadMessages();
      toast.success("Message sent");
    } catch (e) {
      toast.error(typeof e === "string" ? e : "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!ticketId) {
    return (
      <div className="d-flex justify-center items-center py-40">
        <div className="d-flex flex-column items-center gap-10">
          <div className="size-60 flex-center rounded-circle bg-light-2">
            <Ticket size={32} className="text-light-1" />
          </div>
          <div className="text-16 text-light-1 fw-500">Select a ticket to view conversation</div>
          <div className="text-14 text-light-1">Choose a support ticket from the list to see messages and replies.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="row y-gap-10 x-gap-10">
      <div className="col-12 d-flex items-center justify-between">
        <div className="d-flex flex-column items-start gap-2">
          <div className="text-18 fw-600 lh-14">
            Ticket #{conversation?.ticket_id || ticketId}: {conversation?.subject || conversation?.name || "No subject"}
          </div>
          <div className="d-flex items-center gap-2">
            <span className="rounded-100 px-15 py-5 text-center text-12 fw-500 bg-dark-blue text-white">
              {formatStatus(conversation?.status)}
            </span>
            {conversation?.priority && (
              <span className="rounded-100 px-15 py-5 text-center text-12 fw-500 bg-red-3 text-brown-1">
                {formatPriority(conversation.priority)} Priority
              </span>
            )}
          </div>
        </div>
        <button className="button bg-white border-light rounded-8 text-14 px-20 py-10">
          Actions
        </button>
      </div>
      <div className="col-12">
        <div 
          ref={messagesContainerRef}
          className="overflow-y-auto scroll-bar-1 px-15 py-20"
          style={{ maxHeight: "500px", minHeight: "300px" }}
        >
          {loadingMessages ? (
            <div className="d-flex justify-center items-center py-40">
              <div className="text-14 text-light-1">Loading messages...</div>
            </div>
          ) : messages.length === 0 ? (
            <div className="d-flex justify-center items-center py-40">
              <div className="d-flex flex-column items-center gap-10">
                <div className="size-60 flex-center rounded-circle bg-light-2">
                  <MessageSquare size={32} className="text-light-1" />
                </div>
                <div className="text-16 text-light-1 fw-500">No messages yet.</div>
                <div className="text-14 text-light-1">Start the conversation by sending the first message.</div>
              </div>
            </div>
          ) : (
            <div className="d-flex flex-column y-gap-10">
              {messages.map((message, index) => (
                <MessageBox
                  key={message.id || index}
                  message={message}
                  isSupport={message.isSupport}
                  formatTimestamp={formatTimestamp}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>
      <div className="col-12">
        <textarea
          className="rounded-8 bg-white border-light px-15 py-10 w-100"
          rows={3}
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={loading}
        />
      </div>
      <div className="col-12 d-flex gap-2">
        <button className="button bg-white border-light rounded-8 text-14 px-20 py-10">
          Add Note
        </button>
        <button className="button bg-white border-light rounded-8 text-14 px-20 py-10">
          Attach File
        </button>
        <select className="form-select ms-auto border-light w-140 rounded-8 text-14 px-20 py-10">
          <option>Select status</option>
        </select>

        <button 
          className="button bg-dark-blue text-white px-20 py-10 rounded-8"
          onClick={handleSend}
          disabled={loading || !newMessage.trim()}
        >
          <Send size={18} className="mr-10" /> Send Reply
        </button>
      </div>
    </div>
  );
};

const MessageBox = ({ message, isSupport = true, formatTimestamp }) => {
  return (
    <div
      className={`d-flex items-start ${
        isSupport ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <div className={`size-40 flex-center rounded-circle flex-shrink-0 ${
        isSupport ? "bg-dark-blue" : "bg-light-2"
      }`}>
        <User size={18} className={isSupport ? "text-white" : "text-dark-1"} />
      </div>
      <div
        className={`rounded-8 py-10 px-15 ${
          isSupport
            ? "bg-dark-blue text-white mr-10"
            : "bg-light-2 text-dark-1 border border-light ml-10"
        }`}
        style={{ maxWidth: "70%", wordBreak: "break-word" }}
      >
        <div className="d-flex items-center justify-between mb-5">
          <span className={`text-12 fw-600 ${
            isSupport ? "text-white" : "text-dark-1"
          }`}>
            {message.user}
          </span>
          <span className={`text-10 ${
            isSupport ? "text-white opacity-70" : "text-light-1"
          }`}>
            {formatTimestamp(message.timestamp)}
          </span>
        </div>
        <div className={`text-14 lh-20 ${
          isSupport ? "text-white" : "text-dark-1"
        }`}>
          {message.text}
        </div>
      </div>
    </div>
  );
};

export default Conversation;
