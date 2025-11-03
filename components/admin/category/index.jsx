"use client";

import AdminDashboardLayout from "../common/layout";
import { useRouter } from "next/navigation";
import { BookOpen, Ellipsis, Mail, MapPin, Phone, Plus } from "lucide-react";
import { useState } from "react";
import { Dialog } from "@mui/material";
import { Checkbox } from "@mui/material";
import FormInput from "@/components/common/form/FormInput";
import { InsertEmoticon } from "@mui/icons-material";
const index = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("category");
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const handleClose = () => {
    setShowModal(false);
  };

  const tabs = [
    {
      label: "Category",
      value: "category",
    },
    {
      label: "Subcategory",
      value: "subcategory",
    }
  ]

  const Categories = [
    {
      id: 1,
      listing_type: "Events",
      category: "Concerts & Shows",
      status: "Active",
      description: "Organizes large-scale musical and theater events in major venues.",
    },
    {
      id: 2,
      listing_type: "Activities",
      category: "Cultural Experiences",
      status: "Active",
      description: "Immersive experiences that highlight local traditions.",
    },
    {
      id: 3,
      listing_type: "Activities",
      category: "Food & Drink",
      status: "Active",
      description: "Experiences involving local cuisine and cooking.",
    },
    {
      id: 4,
      listing_type: "Flights",
      category: "Flights",
      status: "Inactive",
      description: "All commercial flight-related listings.",
    },
    {
      id: 5,
      listing_type: "Properties",
      category: "Hotels",
      status: "Active",
      description: "Hotels of various types for short or long stays.",
    },
    {
      id: 6,
      listing_type: "Flights",
      category: "Standard Lounges",
      status: "Active",
      description: "Lounges at airports for economy travelers.",
    },
    {
      id: 7,
      listing_type: "Flights",
      category: "Corporate Concierge",
      status: "Active",
      description: "Business travel support services.",
    },
    {
      id: 8,
      listing_type: "Flights",
      category: "Business Class",
      status: "Active",
      description: "Bookings for business class travel.",
    },
    {
      id: 9,
      listing_type: "Properties",
      category: "Airport Hotels",
      status: "Active",
      description: "Hotels near or inside airports.",
    },
  ];

  const Subcategories = [
    {
      id: 1,
      parent_category_id: 1, // Concerts & Shows
      subcategory: "Theater",
      status: "Active",
      description: "Stage performances and live theater shows.",
    },
    {
      id: 2,
      parent_category_id: 2, // Cultural Experiences
      subcategory: "City Tours",
      status: "Active",
      description: "Guided walking or driving tours in major cities.",
    },
    {
      id: 3,
      parent_category_id: 3, // Food & Drink
      subcategory: "Cooking Classes",
      status: "Active",
      description: "Hands-on culinary sessions with local chefs.",
    },
    {
      id: 4,
      parent_category_id: 4, // Flights
      subcategory: "First Class",
      status: "Inactive",
      description: "Premium international first-class bookings.",
    },
    {
      id: 5,
      parent_category_id: 5, // Hotels
      subcategory: "Airport Hotels",
      status: "Active",
      description: "Hotels near airports offering premium services.",
    },
    {
      id: 6,
      parent_category_id: 6, // Standard Lounges
      subcategory: "Economy Class",
      status: "Active",
      description: "Lounge access for economy ticket holders.",
    },
    {
      id: 7,
      parent_category_id: 7, // Corporate Concierge
      subcategory: "Travel Arrangements",
      status: "Active",
      description: "Flight, hotel, and logistics planning for business travelers.",
    },
    {
      id: 8,
      parent_category_id: 8, // Business Class
      subcategory: "First Class",
      status: "Active",
      description: "Luxury flight services for high-end travelers.",
    },
    {
      id: 9,
      parent_category_id: 9, // Airport Hotels
      subcategory: "Day Use",
      status: "Active",
      description: "Hotels available for short-term day bookings.",
    },
  ];


  return (
    <AdminDashboardLayout>
      <div className="row y-gap-10 x-gap-10 items-center mb-10">
        <div className="col-auto">
          <h1 className="text-30 lh-14 fw-600">Category Management</h1>
          <div className="text-14 lh-14 text-light-1">
            Magage Your Categories/Subcategories
          </div>
        </div>
      </div>
      <div className="row y-gap-10 x-gap-10 items-center mb-10">
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

        <div className="col-auto ms-auto">
          <button
            className="button bg-blue-1 text-white px-15 fw-400 py-10 rounded-8"
            onClick={() => setShowModal(true)}
          >
            <Plus size={20} /> Add
          </button>
        </div>
      </div>

      <div className="bg-white rounded-8 border-light px-20 py-15">
        {/* <h1 className="text-24 lh-14 fw-500">All Cate</h1>
        <div className="text-14 lh-14 text-light-1">
          Manage all users across the platform
        </div> */}

        <div className="row y-gap-10 x-gap-10 items-center mb-5 mt-10">

          <div className="col-sm-auto">
            <select className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-140 sm:w-full" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="col-sm-auto">
            <select className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-140 sm:w-full" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="all">All Types</option>
              <option value="property">Property</option>
              <option value="activity">Activity</option>
              <option value="tour">Tour</option>
              <option value="event">Event</option>
              <option value="flight">Flight</option>
              <option value="ride">Ride</option>
            </select>
          </div>

          <div className="col-sm-auto">
            <select className="form-select rounded-8 border-light justify-between py-10 px-15 text-14 w-140 sm:w-full" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="all">Category</option>
            </select>
          </div>

          <div className="col-sm-auto ms-auto d-flex">
            <button
              className="button -md px-15 py-10 fw-400 text-14 text-white bg-blue-1 rounded-8 sm:w-full"
              onClick={() => { setStatusFilter("all"); setTypeFilter("all"); setCategoryFilter("all"); }}
            >
              View All
            </button>
          </div>
        </div>

        <div className="bg-white rounded-8 border-light py-5 mt-10">
          <div className="overflow-scroll scroll-bar-1">
            <table className="table-3 -border-bottom col-12">
              <thead className="bg-light-2">
                {activeTab === "category" ? (
                  <tr>
                    <th>Category</th>
                    <th>Listing Type</th>
                    <th>Status</th>
                    <th>Description</th>
                    <th>Action</th>
                  </tr>
                ) : (
                  <tr>
                    <th>Subcategory</th>
                    <th>Parent Category</th>
                    <th>Status</th>
                    <th>Description</th>
                    <th>Action</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {activeTab == "category" ? (
                  Categories
                    .map((client, index) => (
                      <tr key={index}>
                        <td className="align-middle text-12 lh-16 fw-500">
                          {client.listing_type}
                        </td>
                        <td className="align-middle text-12 lh-16 fw-500">
                          {client.category}
                        </td>
                        <td className="align-middle">
                          <span
                            className={`rounded-100 py-4 px-10 text-center text-12 fw-500 ${client.status === "Active"
                                ? "bg-green-1 text-green-2"
                                : "bg-light-2 text-dark-1"
                              }`}
                          >
                            {client.status}
                          </span>
                        </td>
                        <td className="align-middle text-12 lh-16 fw-500">
                          {client.description}
                        </td>
                        <td className="align-middle">
                          <span className="text-12 border border-primary text-blue-1 fw-500 rounded-4 px-10 cursor-pointer" onClick={() => setShowModal(true)}>
                            Edit
                          </span>
                          <span className="text-12 border border-danger text-red-2 fw-500 rounded-4 px-10 cursor-pointer mx-1">
                            Delete
                          </span>
                        </td>
                      </tr>
                    ))
                ) : (
                  Subcategories.map((item, index) => (
                    <tr key={index}>
                      <td className="align-middle text-12 lh-16 fw-500">
                        {item.subcategory}
                      </td>
                      <td className="align-middle text-12 lh-16 fw-500">
                        {Categories.find(cat => cat.id === item.parent_category_id)?.category}
                      </td>
                      <td className="align-middle">
                        <span
                          className={`rounded-100 py-4 px-10 text-center text-12 fw-500 ${item.status === "Active"
                              ? "bg-green-1 text-green-2"
                              : "bg-light-2 text-dark-1"
                            }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="align-middle text-12 lh-16 fw-500">
                        {item.description}
                      </td>
                      <td className="align-middle">
                        <span className="text-12 border border-primary text-blue-1 fw-500 rounded-4 px-10 cursor-pointer" onClick={() => setShowModal(true)}>
                          Edit
                        </span>
                        <span className="text-12 border border-danger text-red-2 fw-500 rounded-4 px-10 cursor-pointer mx-1">
                          Delete
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Dialog
        open={showModal}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-title"
      >
        <div className="px-20 py-20 w-500 sm:w-full">
          <ModalContent activeTab={activeTab} />
          <div className="d-flex justify-end gap-2 mt-10">
            <button
              className="text-14 border-light rounded-8 px-10 py-5"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              className="text-14 bg-blue-1 text-white fw-500 rounded-8 px-10 py-5"
              onClick={() => {
                setShowModal(false);
              }}
            >
              Create Category
            </button>
          </div>
        </div>
      </Dialog>
    </AdminDashboardLayout>
  );
};

const ModalContent = ({ activeTab }) => {

  const listingTypeOptions = [
    { value: "Properties", label: "Properties" },
    { value: "Events", label: "Events" },
    { value: "Activities", label: "Activities" },
    { value: "Tours", label: "Tours" },
    { value: "Flights", label: "Flights" },
    { value: "Rides", label: "Rides" },
  ];

  const categoryOptions = [
    { value: "Hotels", label: "Hotels" },
    { value: "Airport Hotels", label: "Airport Hotels" },
    { value: "Flights", label: "Flights" },
    { value: "Cultural Experiences", label: "Cultural Experiences" },
    { value: "Concerts & Shows", label: "Concerts & Shows" },
    { value: "Food & Drink", label: "Food & Drink" },
    { value: "Corporate Concierge", label: "Corporate Concierge" },
    { value: "Business Class", label: "Business Class" },
    { value: "Standard Lounges", label: "Standard Lounges" },
  ];


  const listingSubTypeOptions = [
    { value: "default", label: "default" },
  ];

  const status = [
    {
      label: "Active",
      value: "active",
    },
    {
      label: "Inactive",
      value: "inactive",
    },
  ];

  return (
    <div className="row x-gap-10 y-gap-10 items-center">
      {activeTab === "category" ? (
        <>
          <h1 className="text-20 lh-14 fw-500">Create New Category</h1>
          <div className="text-12 text-light-1 lh-14 mb-15">
            Define a new category
          </div>

          <FormInput
            label="Listing Type"
            required={true}
            type="select"
            placeholder="What's the listing type?"
            gridClass="col-12 mt-5"
            options={listingTypeOptions}
          />

          <FormInput
            label="Category"
            type="text"
            placeholder="Enter Category Name"
            gridClass="col-12 mt-5"
          />

          <FormInput
            label="Description"
            type="textarea"
            placeholder="Fill Description"
            gridClass="col-12 mt-5"
          />

          <FormInput
            label="Status"
            type="select"
            placeholder="What's the status?"
            gridClass="col-12 mt-5"
            options={status}
          />
        </>
      ) : (
        <>
          <h1 className="text-20 lh-14 fw-500">Create New Sub-Category</h1>
          <div className="text-12 text-light-1 lh-14 mb-15">
            Define a new subcategory
          </div>

          <FormInput
            label="Parent Category"
            required={true}
            type="select"
            placeholder="What's the parent category?"
            gridClass="col-12 mt-5"
            options={categoryOptions}
          />

          <FormInput
            label="Sub-Category"
            type="text"
            placeholder="Enter Sub-Category Name"
            gridClass="col-12 mt-5"
          />

          <FormInput
            label="Description"
            type="textarea"
            placeholder="Fill Description"
            gridClass="col-12 mt-5"
          />

          <FormInput
            label="Status"
            type="select"
            placeholder="What's the status?"
            gridClass="col-12 mt-5"
            options={status}
          />
        </>
      )}
    </div>
  );
};

export default index;
