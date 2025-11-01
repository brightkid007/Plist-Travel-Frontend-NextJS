"use client";

import { useCallback, useEffect, useState } from "react";
import { Download } from "lucide-react";
import AdminDashboardLayout from "../common/layout";
import DashboardCard from "../common/DashboardCard";
import data from "./data";
import Filter from "../common/Filter";
import BookingList from "./BookingList";
import { getAdminBookings, exportAdminData } from "@/helpers/backend_helper";
import { toast } from "react-toastify";

const index = () => {
  const [cards, setCards] = useState(data);
  const [filters, setFilters] = useState({});
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAdminBookings(filters);
        const summary = res?.summary || res?.data?.summary;
        const bookingsList = res?.bookings || res?.data?.bookings || [];
        setBookings(bookingsList);
        
        const total = summary?.total ?? bookingsList.length ?? cards[0].amount;
        const confirmed = summary?.confirmed ?? bookingsList.filter((b) => (b.status || b.bookingStatus) === "confirmed").length ?? cards[1].amount;
        const pending = summary?.pending ?? bookingsList.filter((b) => (b.status || b.bookingStatus) === "pending").length ?? cards[2].amount;
        const canceled = summary?.cancelled ?? summary?.canceled ?? bookingsList.filter((b) => (b.status || b.bookingStatus) === "cancelled").length ?? cards[3].amount;
        setCards([
          { ...cards[0], amount: String(total) },
          { ...cards[1], amount: String(confirmed) },
          { ...cards[2], amount: String(pending) },
          { ...cards[3], amount: String(canceled) },
        ]);
      } catch (_) {
        // keep defaults
        setBookings([]);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleExport = async () => {
    try {
      await exportAdminData({ scope: "bookings", ...filters });
      toast.success("Export started");
    } catch (e) {
      toast.error(typeof e === "string" ? e : "Export failed");
    }
  };
  return (
    <AdminDashboardLayout>
      <div className="row y-gap-15 x-gap-10 items-center mb-5">
        <div className="col-auto">
          <h1 className="text-30 lh-14 fw-600">Booking Oversight</h1>
          <div className="text-14 text-light-1 lh-14">
            Manage and monitor all bookings across the platform.
          </div>
        </div>
        <div className="col-auto ms-auto">
          <button onClick={handleExport} className="button border-light bg-white px-20 py-10 rounded-8">
            <Download size={18} className="mr-10" /> Export
          </button>
        </div>
      </div>

      <Filter onFilterChange={handleFilterChange} />

      <DashboardCard data={cards} />

      <div className="py-20 px-30 rounded-8 bg-white shadow-3 h-100 mt-20">
        <BookingList bookings={bookings} />
      </div>
    </AdminDashboardLayout>
  );
};

export default index;
