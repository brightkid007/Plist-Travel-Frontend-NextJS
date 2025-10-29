import Header from "@/components/header/dashboard-header";
import Sidebar from "./Sidebar";
import Footer from "@/components/footer/Footer";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AdminDashboardLayout = ({ children }) => {
  const { isAuthenticated, loading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="d-flex justify-center items-center" style={{ minHeight: "100vh" }}>
        <div className="text-16 text-light-1">Loading admin panel...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
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
export default AdminDashboardLayout;
