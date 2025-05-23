import Header from "@/components/header/dashboard-header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const VenderDashboardLayout = ({ children }) => {
  return (
    <>
      <div className="header-margin"></div>

      <Header />

      <div className="dashboard">
        <div className="dashboard__sidebar bg-white scroll-bar-1">
          <Sidebar />
        </div>

        <div className="dashboard__main">
          <div className="dashboard__content bg-light-2">
            {children}

            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};
export default VenderDashboardLayout;
