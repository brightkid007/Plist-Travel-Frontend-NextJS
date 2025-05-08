import dynamic from "next/dynamic";
import Blog4 from "@/components/blog/Blog4";
import Brand2 from "@/components/brand/Brand2";
import Footer2 from "@/components/footer/footer-2";
import Header1 from "@/components/header/header-1";
import Hero2 from "@/components/hero/hero-2";
import AppBanner from "@/components/home/home-2/AppBanner";
import BlockGuide from "@/components/home/home-2/BlockGuide";
import CallToActions from "@/components/home/home-2/CallToActions";
import Subscribe from "@/components/home/home-2/Subscribe";
import Testimonial from "@/components/home/home-2/Testimonial";
import TestimonialRating from "@/components/home/home-2/TestimonialRating";
import Travellers from "@/components/home/home-2/Travellers";
import BookingHistoryFilter from "@/components/dashboard/dashboard/BookingHistoryFilter";

export const metadata = {
  title: "Home-2 || GoTrip - Travel & Tour React NextJS Template",
  description: "GoTrip - Travel & Tour React NextJS Template",
};

const TravelBookingHistoryPage = () => {
  return (
    <>
      {/* End Page Title */}

      <Header1 />
      {/* End Header 2 */}
      <div className="py-30"></div>
      <div className="dashboard row">
        <div className="dashboard__content bg-light-2 pb-30">
          <div className="row y-gap-20 justify-between items-end pb-30 lg:pb-40 md:pb-32">
            <div className="col-12">
              <h1 className="text-30 lh-14 fw-600">Booking History</h1>
              <div className="text-15 text-light-1">
                View and manage your past and upcoming bookings
              </div>
            </div>
          </div>
        </div>
        {/* <div className="col-12"> */}
          <BookingHistoryFilter />
        {/* </div> */}
        
      </div>
      
    </>
  );
};

export default dynamic(() => Promise.resolve(TravelBookingHistoryPage), { ssr: false });
