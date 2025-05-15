import dynamic from "next/dynamic";
import "photoswipe/dist/photoswipe.css";
import { hotelsData } from "@/data/hotels";
import Header from "@/components/header/customer-header";
import Overview from "@/components/property-single/Overview";
import PropertyHighlights from "@/components/property-single/PropertyHighlights";
import RatingTag from "@/components/property-single/RatingTag";
import TopBreadCrumb from "@/components/property-single/TopBreadCrumb";
import SidebarRight from "@/components/property-single/SidebarRight";
import ReplyForm from "@/components/property-single/ReplyForm";
import ReplyFormReview from "@/components/property-single/ReplyFormReview";
import Footer from "@/components/footer/footer-5";
import GalleryOne from "@/components/property-single/GalleryOne";
import Properties from "@/components/dashboard/dashboard/db-wishlist/components/Properties";

export const metadata = {
  title: "Property Detail || Plist Travel",
  description: "Check Property Detail",
};

const PropertySinglePage = ({ params }) => {
  const id = params.id;
  const hotel = hotelsData.find((item) => item.id == id) || hotelsData[0];

  return (
    <>
      {/* End Page Title */}

      <div className="header-margin"></div>
      {/* header top margin */}

      <Header />
      {/* End Header 1 */}

      <TopBreadCrumb />
      {/* End top breadcrumb */}

      {/* <StickyHeader hotel={hotel} /> */}
      {/* sticky single header for hotel single */}

      <GalleryOne hotel={hotel} />

      {/* End gallery grid wrapper */}

      <section className="pt-30">
        <div className="container">
          <div className="row y-gap-30">
            <div className="col-xl-8">
              <div className="row y-gap-40">
                <div className="col-12">
                  <h3 className="text-22 fw-500">Property highlights</h3>
                  <PropertyHighlights />
                </div>
                {/* End .col-12 Property highlights */}

                <div id="overview" className="col-12">
                  <Overview />
                </div>
                {/* End .col-12  Overview */}

                <div className="col-12">
                  <RatingTag />
                </div>
                {/* End .col-12 This property is in high demand! */}
              </div>
              {/* End .row */}
            </div>
            {/* End .col-xl-8 */}

            <div className="col-xl-4">
              <SidebarRight hotel={hotel} />
            </div>
            {/* End .col-xl-4 */}
          </div>
          {/* End .row */}
        </div>
        {/* End container */}
      </section>
      {/* End single page content */}

      <section id="rooms" className="pt-30">
        <div className="container">
          <div className="row pb-20">
            <div className="col-auto">
              <h3 className="text-22 fw-500">Available Rooms</h3>
            </div>
          </div>
          {/* End .row */}
          {/* <AvailableRooms hotel={hotel} /> */}
          <Properties />
        </div>
        {/* End .container */}
      </section>
      {/* End Available Rooms */}

      <section className="pt-40 mb-40">
        <div className="container">
          <div className="row">
            <div className="col-xl-8 col-lg-10">
              <div className="row">
                <div className="col-auto">
                  <h3 className="text-22 fw-500">Leave a Reply</h3>
                  <p className="text-15 text-dark-1 mt-5">
                    Your email address will not be published.
                  </p>
                </div>
              </div>
              {/* End .row */}

              <ReplyFormReview />
              {/* End ReplyFormReview */}

              <ReplyForm />
            </div>
          </div>
        </div>
      </section>
      {/* End Reply Comment box section */}


      <Footer />
    </>
  );
};

export default dynamic(() => Promise.resolve(PropertySinglePage), {
  ssr: false,
});
