"use client";

import Header from "@/components/header/dashboard-header";
import Sidebar from "./Sidebar";
import Footer from "@/components/footer/Footer";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Forbidden403 from "@/components/common/Forbidden403";

const VendorDashboardLayout = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/login");
      }
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="d-flex justify-center items-center" style={{ minHeight: "100vh" }}>
        <div className="text-16 text-light-1">Loading vendor panel...</div>
      </div>
    );
  }

  // Show 403 if the user is authenticated but not vendor
  if (isAuthenticated && (!user || user.role !== "vendor")) {
    return <Forbidden403 role="vendor" />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <div className="header-margin"></div>

      <Header />

      <div className="dashboard">
        <div className="dashboard__sidebar bg-white scroll-bar-1">
          <Sidebar />
        </div>

        <div className="dashboard__main">
          <div
            className="dashboard__content bg-light-2 d-flex flex-column justify-between"
            style={{ minHeight: "calc(100vh - 90px)" }}
          >
            <div className="flex-fill">{children}</div>

            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};
export default VendorDashboardLayout;
