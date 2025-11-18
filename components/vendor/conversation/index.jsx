"use client";

import { useState, useEffect } from "react";
import VendorDashboardLayout from "../common/layout";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import svgIcon from "@/components/data/svgIcon";
import { useRouter } from "next/navigation";
import { getConversations, getMessagesByConversation, createMessage, markConversationAsRead, getMessageTemplates } from "@/helpers/backend_helper";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";

const Conversation = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [quickReplies, setQuickReplies] = useState([]);
  const [loadingQuickReplies, setLoadingQuickReplies] = useState(false);
  const [showQuickReplySuggestions, setShowQuickReplySuggestions] = useState(false);
  const [quickReplyFilter, setQuickReplyFilter] = useState("");
  const [selectedQuickReplyIndex, setSelectedQuickReplyIndex] = useState(-1);

  const router = useRouter();

  // Format timestamp for display
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
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays}d ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
      
      return date.toLocaleDateString("en-US", { 
        month: "short", 
        day: "numeric", 
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined 
      });
    } catch {
      return "—";
    }
  };

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await getConversations();
      const data = response?.conversations || response?.data?.conversations || [];
      
      // Transform conversations for display
      const transformedConversations = data.map((conv) => {
        const userName = conv.user?.user_profile?.first_name && conv.user?.user_profile?.last_name
          ? `${conv.user.user_profile.first_name} ${conv.user.user_profile.last_name}`
          : conv.user?.user_profile?.first_name
          ? conv.user.user_profile.first_name
          : conv.user?.email
          ? conv.user.email.split("@")[0]
          : conv.name
          ? conv.name
          : `User #${conv.user?.id || conv.id}`;

        // Get last message content and timestamp
        const lastMessageContent = conv.last_message?.content 
          ? (conv.last_message.content.length > 60 
              ? conv.last_message.content.substring(0, 60) + "..." 
              : conv.last_message.content)
          : "";
        const lastMessageTime = conv.last_message?.createdAt 
          ? formatTimestamp(conv.last_message.createdAt)
          : formatTimestamp(conv.updatedAt || conv.createdAt);

        return {
          id: conv.id,
          name: userName,
          ticket_id: conv.ticket_id,
          last_message: lastMessageContent,
          time: lastMessageTime,
          unread_count: conv.unread_count || 0,
          conversation: conv, // Store full conversation object
        };
      });

      setConversations(transformedConversations);
    } catch (error) {
      console.error("Error loading conversations:", error);
      toast.error(error?.message || "Failed to load conversations");
    } finally {
      setLoading(false);
    }
  };
  
  // Load conversations
  useEffect(() => {
    loadConversations();
  }, []);

  const loadMessages = async () => {
    if (!activeChat?.id) {
      setMessages([]);
      return;
    }

    try {
      setLoadingMessages(true);
      const response = await getMessagesByConversation(activeChat.id);
      const data = response?.messages || response?.data?.messages || [];
      
      // Transform messages for display
      const transformedMessages = data.map((msg) => ({
        id: msg.id,
        content: msg.content,
        user_id: msg.user_id,
        is_note: msg.is_note || false,
        is_read: msg.is_read || false,
        timestamp: msg.createdAt,
        attachment_name: msg.attachment_name,
      }));

      setMessages(transformedMessages);

      // Mark conversation as read when viewing messages
      if (user?.id && activeChat.id) {
        try {
          await markConversationAsRead(activeChat.id);
          // Update unread count to 0 in conversations list
          setConversations((prev) =>
            prev.map((conv) =>
              conv.id === activeChat.id
                ? { ...conv, unread_count: 0 }
                : conv
            )
          );
        } catch (error) {
          console.error("Error marking conversation as read:", error);
        }
      }

      // Update last message in conversations list if messages changed
      if (transformedMessages.length > 0) {
        const lastMsg = transformedMessages[transformedMessages.length - 1];
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === activeChat.id
              ? { 
                  ...conv, 
                  last_message: lastMsg.content.length > 60 
                    ? lastMsg.content.substring(0, 60) + "..." 
                    : lastMsg.content, 
                  time: formatTimestamp(lastMsg.timestamp) 
                }
              : conv
          )
        );
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      toast.error(error?.message || "Failed to load messages");
    } finally {
      setLoadingMessages(false);
    }
  };
  
  // Load messages when active chat changes
  useEffect(() => {
    loadMessages();
  }, [activeChat?.id, user?.id]);

  // Load quick replies when user is available
  const loadQuickReplies = async () => {
    if (!user?.id) return;
    
    try {
      setLoadingQuickReplies(true);
      const response = await getMessageTemplates({ 
        vendor_id: user.id, 
        type: "quick_reply" 
      });
      const data = response?.message_templates || response?.data?.message_templates || [];
      const replies = data.map((t) => t.content);
      setQuickReplies(replies);
    } catch (error) {
      console.error("Error loading quick replies:", error);
      // Don't show error toast for quick replies as it's not critical
    } finally {
      setLoadingQuickReplies(false);
    }
  };

  useEffect(() => {
    loadQuickReplies();
  }, [user?.id]);

  // Handle selecting a conversation
  const handleSelectConversation = (conversation) => {
    setActiveChat(conversation);
    setMessageText("");
  };

  // Filter quick replies based on search
  const filteredQuickReplies = quickReplies.filter((reply) =>
    reply.toLowerCase().includes(quickReplyFilter.toLowerCase())
  );

  // Handle keyboard input for quick replies
  const handleMessageInputChange = (e) => {
    const value = e.target.value;
    setMessageText(value);

    // Check if user is typing "/" for quick reply
    if (value.endsWith("/") && value.split("/").length === 2) {
      setShowQuickReplySuggestions(true);
      setQuickReplyFilter("");
      setSelectedQuickReplyIndex(-1);
    } else if (value.startsWith("/") && !value.includes("\n")) {
      // Extract filter text after "/"
      const filterText = value.substring(1).trim();
      setQuickReplyFilter(filterText);
      setShowQuickReplySuggestions(true);
      setSelectedQuickReplyIndex(-1);
    } else if (!value.startsWith("/")) {
      setShowQuickReplySuggestions(false);
      setQuickReplyFilter("");
      setSelectedQuickReplyIndex(-1);
    }
  };

  // Handle keyboard navigation in quick reply suggestions
  const handleQuickReplyKeyDown = (e) => {
    if (!showQuickReplySuggestions || filteredQuickReplies.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedQuickReplyIndex((prev) =>
        prev < filteredQuickReplies.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedQuickReplyIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      if (selectedQuickReplyIndex >= 0 && selectedQuickReplyIndex < filteredQuickReplies.length) {
        insertQuickReply(filteredQuickReplies[selectedQuickReplyIndex]);
      } else if (filteredQuickReplies.length > 0) {
        insertQuickReply(filteredQuickReplies[0]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setShowQuickReplySuggestions(false);
      setQuickReplyFilter("");
      setSelectedQuickReplyIndex(-1);
    }
  };

  // Insert quick reply into message text
  const insertQuickReply = (reply) => {
    // Remove the "/" prefix and replace with the quick reply
    const textBeforeSlash = messageText.substring(0, messageText.lastIndexOf("/"));
    const newText = textBeforeSlash + reply;
    setMessageText(newText);
    setShowQuickReplySuggestions(false);
    setQuickReplyFilter("");
    setSelectedQuickReplyIndex(-1);

    // Focus and move cursor to end
    const textarea = document.getElementById("message");
    if (textarea) {
      textarea.focus();
      setTimeout(() => {
        textarea.setSelectionRange(newText.length, newText.length);
      }, 0);
    }
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!activeChat?.id || !messageText.trim()) return;

    try {
      setSending(true);
      await createMessage({
        conversation_id: activeChat.id,
        content: messageText.trim(),
        is_note: false,
      });

      // Reload messages
      const response = await getMessagesByConversation(activeChat.id);
      const data = response?.messages || response?.data?.messages || [];
      const transformedMessages = data.map((msg) => ({
        id: msg.id,
        content: msg.content,
        user_id: msg.user_id,
        is_note: msg.is_note || false,
        is_read: msg.is_read || false,
        timestamp: msg.createdAt,
        attachment_name: msg.attachment_name,
      }));
      setMessages(transformedMessages);

      setMessageText("");
      toast.success("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  // Filter conversations based on search query
  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (conv.last_message && conv.last_message.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (conv.ticket_id && conv.ticket_id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <VendorDashboardLayout>
      <div
        className="row y-gap-20 x-gap-20 justify-between"
        style={{ height: "calc(100vh - 300px)", minHeight: "300px" }}
      >
        <div className="col-12 d-flex sm:d-block justify-between items-center mb-10">
          <div className="flex-shrink-0">
            <h1 className="text-30 lh-14 fw-600">Messaging & Communication</h1>
            <div className="text-15 text-light-1">
              Communicate with customers, agents, and platform administrators.
            </div>
          </div>
          <div className="flex-grow-0">
            <button
              className="button -md bg-blue-1 px-15 py-10 fw-400 text-14 text-white rounded-8"
              onClick={() => router.push("/vendor/conversation/manage")}
            >
              Go to Message Management
            </button>
          </div>
        </div>
        <div className="col-4 h-100">
          <div className="bg-white rounded-8 border-light pb-15 d-flex flex-column h-100">
            <div className=" flex-shrink-0">
              <div className="d-flex justify-between items-center px-15 py-15">
                <h1 className="text-18 fw-500">Conversation</h1>
                {(() => {
                  const totalUnread = conversations.reduce((sum, conv) => sum + (conv.unread_count || 0), 0);
                  if (totalUnread > 0) {
                    return (
                      <span className="bg-red-1 text-white text-10 fw-400 px-10 rounded-100">
                        {totalUnread}
                      </span>
                    );
                  }
                  return null;
                })()}
              </div>
              <div className="position-relative d-flex items-center mr-15 ml-15 mb-10">
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="border-light rounded-8 px-10 py-5 pl-30"
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
            </div>
            <div className="overflow-scroll scroll-bar-1 flex-grow-1">
              {loading ? (
                <div className="d-flex justify-center items-center py-40">
                  <CircularProgress size={24} />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="d-flex justify-center items-center py-40">
                  <div className="text-center">
                    <p className="text-14 text-light-1">
                      {searchQuery ? "No conversations found" : "No conversations yet"}
                    </p>
                  </div>
                </div>
              ) : (
                filteredConversations.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectConversation(item)}
                    className={
                      "border-top-light border-bottom-light py-10 px-10 d-flex items-center cursor-pointer " +
                      (item.id === activeChat?.id ? "bg-light-2" : "bg-white")
                    }
                    style={{ marginTop: "-1px" }}
                  >
                    <div className="size-40 flex-center text-light-1 rounded-100 bg-white border-light mr-10 flex-shrink-0">
                      <PersonOutlineOutlinedIcon />
                    </div>
                    <div className="flex-grow-1 overflow-hidden">
                      <div className="d-flex justify-between items-center mb-10">
                        <div className="text-16 fw-500 lh-1">{item.name}</div>
                        <div className="d-flex items-center">
                          {item.unread_count > 0 && (
                            <span className="bg-red-1 text-white text-10 fw-400 px-8 rounded-100 mr-5" style={{ minWidth: "18px", textAlign: "center" }}>
                              {item.unread_count > 99 ? "99+" : item.unread_count}
                            </span>
                          )}
                          <div className="text-10 text-light-1 lh-1">
                            {item.time}
                          </div>
                        </div>
                      </div>
                      <div className={`text-12 lh-1 text-nowrap overflow-hidden text-truncate w-100 ${
                        item.unread_count > 0 ? "fw-600 text-dark-1" : "text-light-1"
                      }`}>
                        {item.last_message || "No messages yet"}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <div className="col-8">
          <div className="bg-white rounded-8 border-light d-flex flex-column h-100">
            {activeChat ? (
              <>
                <div className="d-flex justify-between items-center px-15 py-15 border-bottom-light">
                  <div className="d-flex items-center">
                    <div className="size-40 flex-center text-light-1 rounded-100 bg-white border-light mr-10 flex-shrink-0">
                      <PersonOutlineOutlinedIcon />
                    </div>
                    <div className="d-flex flex-column justify-between">
                      <div className="text-18 fw-500 lh-1">{activeChat.name}</div>
                      {activeChat.ticket_id && (
                        <div className="text-12 text-light-1 fw-400 lh-1 mt-5">
                          Ticket: {activeChat.ticket_id}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* <div className="d-flex justify-end align-items-center">
                    <span className="size-24 flex-center cursor-pointer">
                      {svgIcon.phone}
                    </span>
                    <span className="size-24 flex-center cursor-pointer ml-20">
                      {svgIcon.video_camera}
                    </span>
                    <span className="size-24 flex-center cursor-pointer ml-20">
                      {svgIcon.more_horiz}
                    </span>
                  </div> */}
                </div>
                <div className="flex-grow-1 overflow-scroll scroll-bar-1 border-top-light border-bottom-light px-15 py-15">
                  {loadingMessages ? (
                    <div className="d-flex justify-center items-center py-40">
                      <CircularProgress size={24} />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="d-flex justify-center items-center py-40">
                      <div className="text-center">
                        <p className="text-14 text-light-1">No messages yet</p>
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex flex-column y-gap-10">
                      {messages.map((message) => {
                        const isVendorMessage = user?.id && message.user_id === user.id;
                        const isNote = message.is_note;
                        
                        return (
                          <div
                            key={message.id}
                            className={`d-flex items-start ${
                              isNote ? "bg-yellow-4 rounded-8 px-10 py-10" : ""
                            } ${isVendorMessage ? "flex-row-reverse" : ""}`}
                          >
                            <div className={`size-40 flex-center rounded-circle flex-shrink-0 ${
                              isNote 
                                ? "bg-yellow-3 text-brown-1" 
                                : isVendorMessage
                                ? "bg-dark-blue text-white"
                                : "bg-light-2 text-dark-1"
                            }`}>
                              <PersonOutlineOutlinedIcon fontSize="small" />
                            </div>
                            <div className={`${isVendorMessage ? "mr-10" : "ml-10"} flex-grow-1 ${
                              isNote ? "text-brown-1" : ""
                            }`}>
                              {isNote && (
                                <div className="text-10 fw-600 text-brown-1 mb-5">Internal Note</div>
                              )}
                              <div className={`rounded-8 py-10 px-15 ${
                                isNote
                                  ? "bg-yellow-3 border border-yellow-2"
                                  : isVendorMessage
                                  ? "bg-dark-blue text-white"
                                  : "bg-light-2 border border-light"
                              }`}>
                                <div className={`text-14 lh-1 mb-5 ${
                                  isVendorMessage ? "text-white" : ""
                                }`}>
                                  {message.content}
                                </div>
                                <div className={`text-10 ${
                                  isVendorMessage ? "text-white opacity-70" : "text-light-1"
                                }`}>
                                  {formatTimestamp(message.timestamp)}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="px-15 py-15">
                  {quickReplies.length > 0 && !showQuickReplySuggestions && (
                    <div className="mb-10 text-12 text-light-1">
                      💡 Tip: Type "/" in the message box to see quick replies
                    </div>
                  )}
                  <div className="position-relative">
                    <textarea
                      className="border-light rounded-8 px-10 py-10 w-full"
                      name="message"
                      id="message"
                      rows={3}
                      placeholder="Type your message... (Type '/' for quick replies)"
                      value={messageText}
                      onChange={handleMessageInputChange}
                      onKeyDown={(e) => {
                        // Handle quick reply navigation
                        if (showQuickReplySuggestions) {
                          handleQuickReplyKeyDown(e);
                          return;
                        }
                        // Handle send on Enter (without Shift)
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      disabled={sending}
                    />
                    {showQuickReplySuggestions && quickReplies.length > 0 && (
                      <div
                        className="position-absolute bg-white border-light rounded-8 shadow-lg"
                        style={{
                          bottom: "100%",
                          left: 0,
                          right: 0,
                          marginBottom: "5px",
                          maxHeight: "200px",
                          overflowY: "auto",
                          zIndex: 1000,
                        }}
                      >
                        {filteredQuickReplies.length === 0 ? (
                          <div className="px-15 py-10 text-12 text-light-1">
                            No quick replies found
                          </div>
                        ) : (
                          filteredQuickReplies.map((reply, index) => (
                            <div
                              key={index}
                              className={`px-15 py-10 cursor-pointer d-flex items-center ${
                                index === selectedQuickReplyIndex ? "bg-light-2" : ""
                              } ${index === 0 && selectedQuickReplyIndex === -1 ? "bg-light-2" : ""}`}
                              onClick={() => insertQuickReply(reply)}
                              onMouseEnter={() => setSelectedQuickReplyIndex(index)}
                            >
                              <span className="material-symbols-outlined mr-10 text-blue-1" style={{ fontSize: "16px" }}>
                                reply
                              </span>
                              <div className="flex-1">
                                <div className="text-12 fw-500 mb-2">
                                  {reply.substring(0, 80)}{reply.length > 80 ? "..." : ""}
                                </div>
                              </div>
                              <div className="text-10 text-light-1">
                                {index === selectedQuickReplyIndex || (index === 0 && selectedQuickReplyIndex === -1) ? (
                                  "Press Enter"
                                ) : (
                                  `#${index + 1}`
                                )}
                              </div>
                            </div>
                          ))
                        )}
                        <div className="border-top-light px-15 py-5 text-10 text-light-1">
                          Use ↑↓ to navigate, Enter to select, Esc to cancel
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="d-flex justify-between items-center mt-10">
                    {/* <button 
                      className="border-light rounded-8 size-40 flex-center"
                      disabled={sending}
                    >
                      {svgIcon.attachment}
                    </button> */}
                    <div></div>
                    <button
                      className="bg-dark-blue text-white rounded-8 text-14 fw-400 px-20 py-10 lh-14 d-flex items-center"
                      onClick={handleSendMessage}
                      disabled={sending || !messageText.trim()}
                    >
                      {sending ? (
                        <>
                          <CircularProgress size={16} className="mr-5" style={{ color: "white" }} />
                          Sending...
                        </>
                      ) : (
                        <>
                          {svgIcon.send_message} Send message
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="d-flex justify-center items-center h-100">
                <div className="text-center">
                  <p className="text-14 text-light-1">Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div style={{ height: "50px" }}></div>
    </VendorDashboardLayout>
  );
};

export default Conversation;
