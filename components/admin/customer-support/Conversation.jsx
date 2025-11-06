import { useState, useEffect, useRef } from "react";
import { Send, User, Ticket, MessageSquare, MoreVertical, Download } from "lucide-react";
import { getMessagesByConversation, createMessage, getConversationById, updateConversation } from "@/helpers/backend_helper";
import { toast } from "react-toastify";
import { getLoggedInUser } from "@/helpers/backend_helper";
import { Dialog } from "@mui/material";

// Helper to build data URL for inline previews
const dataUrlFromBase64 = (base64, mime) => {
  if (!base64) return null;
  const type = mime || "application/octet-stream";
  return `data:${type};base64,${base64}`;
};

const Conversation = ({ ticketId, onStatusUpdated }) => {
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]); // queued attachments
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);
  const [uploading, setUploading] = useState(false);

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
        const messageType = (m.type || m.message_type || (m.is_note ? "note" : "message")).toLowerCase();
        
        return {
          id: m.id,
          user: m.user?.user_profile?.first_name && m.user?.user_profile?.last_name
            ? `${m.user.user_profile.first_name} ${m.user.user_profile.last_name}`
            : m.user?.email?.split("@")[0] || "Support",
          timestamp: m.created_at || m.createdAt || new Date().toISOString(),
          text: m.content || m.message || m.text || "",
          isSupport,
          email: m.user?.email || "",
          isNote: messageType === "note",
          attachmentName: m.attachment_name || m.attachmentName || null,
          attachmentContent: m.attachment_content || m.attachmentContent || null,
          mimeType: m.mime_type || m.mimeType || undefined,
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

  const handleStatusChange = async (e) => {
    const value = e.target.value;
    if (!value || !ticketId) return;
    try {
      setSavingStatus(true);
      await updateConversation(ticketId, { status: value });
      await loadConversation();
      toast.success("Status updated");
      if (typeof onStatusUpdated === 'function') {
        onStatusUpdated(value);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to update status");
    } finally {
      setSavingStatus(false);
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim() || !ticketId) return;
    try {
      setLoading(true);
      await createMessage({ conversation_id: ticketId, content: noteText, type: "note" });
      setNoteText("");
      setNoteOpen(false);
      await loadMessages();
      toast.success("Note added");
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || "Failed to add note");
    } finally {
      setLoading(false);
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const next = files.map((f) => ({
      file: f,
      name: f.name,
      size: f.size,
      type: f.type,
      previewUrl: f.type?.startsWith("image/") ? URL.createObjectURL(f) : null,
    }));
    setAttachedFiles((prev) => [...prev, ...next]);
    e.target.value = "";
  };

  const removeAttached = (idx) => {
    setAttachedFiles((prev) => {
      const clone = [...prev];
      const removed = clone.splice(idx, 1)[0];
      if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
      return clone;
    });
  };

  const downloadAttachment = (name, base64, mime) => {
    try {
      if (!base64) return;
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) byteNumbers[i] = byteCharacters.charCodeAt(i);
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mime || "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name || 'attachment';
      a.click();
      URL.revokeObjectURL(url);
    } catch (_) {}
  };

  

  const handleSend = async () => {
    if ((!newMessage.trim() && attachedFiles.length === 0) || !ticketId || loading) return;
    setLoading(true);
    try {
      // Send attachments first
      for (const item of attachedFiles) {
        try {
          const toBase64 = (f) => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(",")[1]);
            reader.onerror = reject;
            reader.readAsDataURL(f);
          });
          const base64 = await toBase64(item.file);
          await createMessage({ conversation_id: ticketId, content: `Attachment: ${item.name}`, attachment_name: item.name, attachment_content: base64, mime_type: item.type });
        } catch (_) {}
      }
      // Then send text if any
      if (newMessage.trim()) {
        await createMessage({
          conversation_id: ticketId,
          content: newMessage,
        });
      }
      setNewMessage("");
      // cleanup previews
      attachedFiles.forEach((it) => it.previewUrl && URL.revokeObjectURL(it.previewUrl));
      setAttachedFiles([]);
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

  const isReadOnly = ((conversation?.status || "").toLowerCase() === "closed" || (conversation?.status || "").toLowerCase() === "resolved");

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
        <div className="position-relative">
          <button className="button bg-white border-light rounded-8 text-14 px-20 py-10" onClick={() => setActionsOpen((o) => !o)}>
            <MoreVertical size={16} className="mr-10" /> Actions
          </button>
          {actionsOpen && (
            <div className="position-absolute bg-white border-light rounded-8 shadow-3 mt-5 right-0 z-10" style={{ minWidth: 160 }} onMouseLeave={() => setActionsOpen(false)}>
              {[
                { label: "Mark In Progress", value: "in_progress" },
                { label: "Resolve", value: "resolved" },
                { label: "Close", value: "closed" },
                { label: "Reopen", value: "open" },
              ].map((opt) => (
                <div key={opt.value} className="px-15 py-8 text-14 cursor-pointer hover:bg-light-2" onClick={async () => { setActionsOpen(false); await handleStatusChange({ target: { value: opt.value } }); }}>
                  {opt.label}
                </div>
              ))}
            </div>
          )}
        </div>
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
                  onDownload={downloadAttachment}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>
      {!!attachedFiles.length && (
        <div className="col-12">
          <div className="d-flex items-center gap-10 flex-wrap mb-5">
            {attachedFiles.map((f, idx) => (
              <div key={idx} className="d-flex items-center gap-5 border-light rounded-8 px-10 py-6 bg-white">
                {f.previewUrl ? (
                  <img src={f.previewUrl} alt={f.name} style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 6 }} />
                ) : (
                  <div className="size-36 rounded-6 bg-light-2 flex-center text-12 text-light-1">{(f.name || "").split('.').pop()?.toUpperCase?.() || "FILE"}</div>
                )}
                <div className="d-flex flex-column">
                  <span className="text-12 fw-500">{f.name}</span>
                  <span className="text-10 text-light-1">{Math.ceil((f.size || 0)/1024)} KB</span>
                </div>
                <button className="text-12 border-light rounded-6 px-8 py-4" onClick={() => removeAttached(idx)}>Remove</button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="col-12">
        <textarea
          className="rounded-8 bg-white border-light px-15 py-10 w-100"
          rows={3}
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={loading || isReadOnly}
        />
      </div>
      <div className="col-12 d-flex gap-2">
        <button className="button bg-white border-light rounded-8 text-14 px-20 py-10" onClick={() => setNoteOpen(true)} disabled={loading || isReadOnly}>
          Add Note
        </button>
        <input type="file" ref={fileInputRef} className="d-none" onChange={handleFileChange} multiple disabled={isReadOnly} />
        <button className="button bg-white border-light rounded-8 text-14 px-20 py-10" onClick={handleAttachClick} disabled={uploading || isReadOnly}>
          {uploading ? "Attaching..." : "Attach File"}
        </button>
        <select className="form-select ms-auto border-light w-180 rounded-8 text-14 px-20 py-10" value={(conversation?.status || "open").toLowerCase()} onChange={handleStatusChange} disabled={savingStatus}>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>

        <button 
          className="button bg-dark-blue text-white px-20 py-10 rounded-8"
          onClick={handleSend}
          disabled={loading || (!newMessage.trim() && attachedFiles.length === 0) || isReadOnly}
        >
          <Send size={18} className="mr-10" /> Send Reply
        </button>
      </div>
      <Dialog open={noteOpen} onClose={() => setNoteOpen(false)} maxWidth="sm" fullWidth>
        <div className="px-20 py-20">
          <h1 className="text-16 fw-500 mb-10">Add Internal Note</h1>
          <textarea className="rounded-8 bg-white border-light px-15 py-10 w-100" rows={4} placeholder="Type your note..." value={noteText} onChange={(e) => setNoteText(e.target.value)} disabled={loading || isReadOnly} />
          <div className="d-flex justify-end gap-2 mt-10">
            <button className="text-14 border-light rounded-8 px-15 py-8" onClick={() => setNoteOpen(false)} disabled={loading}>Cancel</button>
            <button className="text-14 bg-blue-1 text-white fw-500 rounded-8 px-15 py-8" onClick={handleAddNote} disabled={loading || !noteText.trim() || isReadOnly}>
              {loading ? "Saving..." : "Save Note"}
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

const MessageBox = ({ message, isSupport = true, formatTimestamp, onDownload }) => {
  return (
    <div
      className={`d-flex items-start ${
        isSupport ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <div className={`size-40 flex-center rounded-circle flex-shrink-0 ${
        message.isNote ? "bg-yellow-3 text-dark-1 " : (isSupport ? "bg-dark-blue" : "bg-light-2")
      }`}>
        <User size={18} className={message.isNote ? "text-brown-1" : (isSupport ? "text-white" : "text-dark-1")} />
      </div>
      <div
        className={`rounded-8 py-10 px-15 ${
          message.isNote
            ? "bg-yellow-4 text-brown-1 ml-10 mr-10 border border-yellow-3"
            : isSupport
              ? "bg-dark-blue text-white mr-10"
              : "bg-light-2 text-dark-1 border border-light ml-10"
        }`}
        style={{ maxWidth: "70%", wordBreak: "break-word" }}
      >
        <div className="d-flex items-center justify-between mb-5">
          <span className={`text-12 fw-600 mr-10 ${
            message.isNote ? "text-brown-1" : (isSupport ? "text-white" : "text-dark-1")
          }`}>
            {message.user}
          </span>
          <span className={`text-10 ${
            message.isNote ? "text-brown-1" : (isSupport ? "text-white opacity-70" : "text-light-1")
          }`}>
            {formatTimestamp(message.timestamp)}
          </span>
        </div>
        {message.isNote && (
          <div className="text-10 fw-600 text-brown-1 mb-5">Internal Note</div>
        )}
        {message.attachmentName && message.attachmentContent ? (
          <div className="d-flex items-center gap-8 mt-5">
            {((message.mimeType || "").startsWith("image/") || /\.(png|jpe?g|gif|webp|svg)$/i.test(message.attachmentName || "")) ? (
              <div className="position-relative d-inline-block" style={{ maxWidth: 200, maxHeight: 160 }}>
                <img
                  src={dataUrlFromBase64(message.attachmentContent, message.mimeType)}
                  alt={message.attachmentName || "attachment"}
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8, border: "1px solid rgba(0,0,0,0.06)" }}
                />
                <button
                  className="size-30 rounded-100 bg-white border-light flex-center position-absolute"
                  title="Download"
                  onClick={() => onDownload?.(message.attachmentName, message.attachmentContent, message.mimeType)}
                  style={{ right: 8, bottom: 8, boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }}
                >
                  <Download size={16} className="text-dark-1" />
                </button>
              </div>
            ) : (
              <button className="bg-white border-light px-10 py-5 rounded-8 text-12" title={`Download ${message.attachmentName || ''}`} onClick={() => onDownload?.(message.attachmentName, message.attachmentContent, message.mimeType)}>
                <Download size={16} className="text-dark-1" /> Download ${message.attachmentName || ''}
              </button>
            )}
          </div>
        ) : (
          <div className={`text-14 lh-20 ${
            message.isNote ? "text-brown-1" : (isSupport ? "text-white" : "text-dark-1")
          }`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default Conversation;
