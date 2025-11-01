import { useState, useEffect } from "react";
import { Send, User, Ticket, MessageSquare } from "lucide-react";
import { getMessagesByConversation, createMessage, getConversationById } from "@/helpers/backend_helper";
import { toast } from "react-toastify";
import { getLoggedInUser } from "@/helpers/backend_helper";

const Conversation = ({ ticketId }) => {
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ticketId) {
      loadConversation();
      loadMessages();
    }
  }, [ticketId]);

  const loadConversation = async () => {
    try {
      const res = await getConversationById(ticketId);
      setConversation(res?.conversation || res?.data?.conversation || res);
    } catch (_) {
      // keep defaults
    }
  };

  const loadMessages = async () => {
    try {
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
        };
      });
      setMessages(mapped);
    } catch (_) {
      setMessages([]);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !ticketId) return;
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
            Ticket #{conversation?.ticket_id || ticketId}: {conversation?.subject || "No subject"}
          </div>
          <div className="d-flex items-center gap-2">
            <span className="rounded-100 px-15 text-center text-12 fw-500 bg-dark-blue text-white">
              {conversation?.status || "Open"}
            </span>
            {conversation?.priority && (
              <span className="rounded-100 px-15 text-center text-12 fw-500 bg-red-3 text-brown-1">
                {conversation.priority} Priority
              </span>
            )}
          </div>
        </div>
        <button className="button bg-white border-light rounded-8 text-14 px-20 py-10">
          Actions
        </button>
      </div>
      <div className="col-12">
        <div className="overflow-scroll scroll-bar-1 px-10 h-250">
          <div className="row y-gap-10 x-gap-10 items-center">
            {messages.length === 0 ? (
              <div className="text-center py-40 col-12">
                <div className="d-flex flex-column items-center gap-10">
                  <div className="size-60 flex-center rounded-circle bg-light-2">
                    <MessageSquare size={32} className="text-light-1" />
                  </div>
                  <div className="text-16 text-light-1 fw-500">No messages yet.</div>
                  <div className="text-14 text-light-1">Start the conversation by sending the first message.</div>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <MessageBox
                  key={message.id || index}
                  message={message}
                  isSupport={message.isSupport}
                />
              ))
            )}
          </div>
        </div>
      </div>
      <div className="col-12">
        <textarea
          className="rounded-8 bg-white border-light px-15 py-10"
          rows={2}
          placeholder="Type your reply..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
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

const MessageBox = ({ message, isSupport = true }) => {
  const otherClass = isSupport
    ? "bg-dark-blue text-white ms-auto"
    : "bg-light-2 text-dark-1";
  return (
    <div
      className={`${otherClass} rounded-8 py-15 px-15 my-2 col-auto d-flex items-start gap-2`}
      style={{ maxWidth: "70%" }}
    >
      <div className="size-30 flex-center rounded-circle bg-white text-light-1">
        <User size={18} />
      </div>
      <div>
        <span
          className={
            "text-14 fw-600 lh-14 mr-10 " +
            (isSupport ? "text-white" : "text-light-1")
          }
        >
          {message.user}
        </span>
        <span className="text-12 text-light-1">
          {message.timestamp ? new Date(message.timestamp).toLocaleString() : "—"}
        </span>
        <div className="text-14 lh-14 mt-5">{message.text}</div>
      </div>
    </div>
  );
};

export default Conversation;
