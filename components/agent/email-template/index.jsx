"use client";

import AgentDashboardLayout from "../common/layout";
import { useState } from "react";
import { Dialog, Drawer } from "@mui/material";
import Filter from "@/components/agent/common/Filter";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";

const index = () => {
  const [openFilter, setOpenFilter] = useState(false);
  const handleClose = () => {
    setOpenFilter(false);
  };

  const [openModal, setOpenModal] = useState(false);
  const [preview, setPreview] = useState(null);
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const router = useRouter();

  const email_templates = [
    {
      name: "Booking Confirmation",
      category: "Booking",
      subject: "Your booking #{{booking_id}} is confirmed!",
      type: "text",
      content:
        "Dear {{client_name}},\n\nThank you for choosing us! Your booking is confirmed.\n\n📌 **Booking Details**\n- Booking ID: {{booking_id}}\n- Service: {{service_type}}\n- Travel Date: {{travel_date}}\n- Total Amount: {{total_amount}}\n\nWe’re excited to serve you. For any changes, please contact us.\n\nBest regards,\nThe Travel Team",
    },
    {
      name: "Booking Cancellation",
      category: "Booking",
      subject: "Cancellation: Booking #{{booking_id}}",
      type: "html",
      content: `<div class="email-template">
            <h2 style="color: #702459; font-family: Arial, sans-serif;">Booking Cancellation</h2>
            <p style="font-family: Arial, sans-serif;">Dear {{client_name}},</p>
            
            <div style="background: #faf5ff; padding: 16px; border-radius: 8px; margin: 16px 0; font-family: Arial, sans-serif;">
                <p>We've processed your cancellation for booking <strong>{{booking_id}}</strong>.</p>
                <p>Cancellation date: {{booking_date}}</p>
            </div>
            
            <p style="font-family: Arial, sans-serif;">We're sorry to see you go. If this was a mistake, please reply to this email within 24 hours.</p>
        </div>`,
    },
    {
      name: "Payment Reminder",
      category: "Payment",
      subject: "Reminder: Complete your payment for {{service_type}}",
      type: "html",
      content: `<div class="email-template">
            <h2 style="color: #9c4221; font-family: Arial, sans-serif;">Payment Reminder</h2>
            <p style="font-family: Arial, sans-serif;">Hello {{client_name}},</p>
            
            <p style="font-family: Arial, sans-serif;">This is a friendly reminder about your pending payment for booking <strong>{{booking_id}}</strong>.</p>
            
            <div style="background: #fff5f5; padding: 16px; border-radius: 8px; margin: 16px 0; font-family: Arial, sans-serif;">
                <p><strong>Amount Due:</strong> {{total_amount}}</p>
                <p><strong>Due Date:</strong> {{travel_date}}</p>
                <a href="#" style="background: #c53030; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; display: inline-block; margin-top: 8px;">Pay Now</a>
            </div>
            
            <p style="font-family: Arial, sans-serif;">Please complete your payment to confirm your booking.</p>
        </div>`,
    },
    {
      name: "Travel Itinerary",
      category: "Booking",
      subject: "Your itinerary for {{service_type}} is ready!",
      type: "text",
      content:
        "Dear {{client_name}},\n\nHere’s your travel itinerary for {{service_type}} on {{travel_date}}.\n\n📋 **Details:**\n{{service_details}}\n\nNeed changes? Reply to this email within 24 hours.\n\nSafe travels!\nThe Travel Team",
    },
    {
      name: "Feedback Request",
      category: "Service",
      subject: "How was your experience with {{service_type}}?",
      type: "html",
      content: `<div class="email-template" style="text-align: center;">
            <h2 style="color: #5f370e; font-family: Arial, sans-serif;">How Was Your Experience?</h2>
            <p style="font-family: Arial, sans-serif;">Hi {{client_name}},</p>
            
            <p style="font-family: Arial, sans-serif;">We'd love your feedback about your recent {{service_type}} on {{travel_date}}.</p>
            
            <div style="margin: 24px 0;">
                <a href="#" style="background: #dd6b20; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-family: Arial, sans-serif; font-weight: bold;">Share Your Feedback</a>
            </div>
            
            <p style="font-family: Arial, sans-serif;">Your opinion helps us improve our services!</p>
        </div>`,
    },
    {
      name: "Special Offer",
      category: "Promotion",
      subject: "Exclusive deal for you, {{client_name}}!",
      type: "text",
      content:
        "Hi {{client_name}},\n\nAs a valued customer, enjoy a special discount on your next booking!\n\n🎁 **Offer:** 15% off {{service_type}}\n⏳ **Valid until:** {{travel_date}}\n\nUse code **WELCOME15** at checkout.\n\nHappy travels!\nThe Marketing Team",
    },
  ];

  return (
    <AgentDashboardLayout>
      <div className="row y-gap-10 x-gap-10 items-center mb-10">
        <div className="col-auto">
          <h1 className="text-30 lh-14 fw-600">Email Templates</h1>
          <div className="text-14 lh-14 text-light-1">
            Create and manage email templates for client communications
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
            onClick={() => router.push("/agent/email-template/add")}
          >
            New Email Template
          </button>
        </div>
      </div>

      <div className="bg-white rounded-8 border-light px-20 py-15">
        <h1 className="text-24 lh-14 fw-500">Email templates</h1>
        <div className="text-14 lh-14 text-light-1">
          View and manage your email templates
        </div>
        <div className="bg-white rounded-8 border-light px-15 py-5 mt-10">
          <div className="overflow-scroll scroll-bar-1">
            <table className="table-2 col-12 text-14">
              <thead className="text-nowrap">
                <tr className="text-light-1 fw-600">
                  <th>Template Name</th>
                  <th>Category</th>
                  <th>Subject</th>
                  <th>Content</th>
                </tr>
              </thead>
              <tbody>
                {email_templates.map((row, index) => (
                  <tr key={index}>
                    <td className="align-middle">{row.name}</td>
                    <td className="align-middle">{row.category}</td>
                    <td className="align-middle">{row.subject}</td>
                    <td className="align-middle">
                      <Eye size={18}
                        className="cursor-pointer"
                        onClick={() => {
                          setPreview(row);
                          handleOpenModal();
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <div className="px-20 py-20" style={{ width: "500px" }}>
          <h1 className="text-20 fw-500 mb-10">Email Template Preview</h1>
          {preview?.type == "text" ? (
            <div
              dangerouslySetInnerHTML={{
                __html: preview?.content.replace(/\n/g, "<br/>"),
              }}
            />
          ) : (
            <div
              dangerouslySetInnerHTML={{
                __html: preview?.content,
              }}
            />
          )}
        </div>
      </Dialog>
    </AgentDashboardLayout>
  );
};

export default index;
