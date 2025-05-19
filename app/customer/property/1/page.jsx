'use client'

import dynamic from "next/dynamic";
import "photoswipe/dist/photoswipe.css";
import { hotelsData } from "@/data/hotels";
import { useState } from "react";
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
import AvailableRooms from "@/components/property-single/AvailableRooms";
import ReviewProgress from "@/components/property-single/guest-reviews/ReviewProgress";
import DetailsReview from "@/components/property-single/guest-reviews/DetailsReview";
import PopularFacilities from "@/components/property-single/PopularFacilities";
import Facilities from "@/components/property-single/Facilities";
import RoomInfoModal from "@/components/property-single/RoomInfoModal";
import Faq from "@/components/faq/Faq";

// export const metadata = {
//   title: "Property Detail || Plist Travel",
//   description: "Check Property Detail",
// };

const PropertySinglePage = ({ params }) => {
  const id = params.id;
  const hotel = hotelsData.find((item) => item.id == id) || hotelsData[0];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleShowRoomInfo = (roomTitle) => {
    setSelectedRoom({ title: roomTitle });
    setIsModalOpen(true);
    console.log("OKAY");
    console.log(isModalOpen);
  };

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
                  <PropertyHighlights />
                </div>
                {/* End .col-12 Property highlights */}

                <div id="overview" className="col-12">
                  <Overview />
                </div>
                {/* End .col-12  Overview */}

                <div className="col-12">
                  <div className="row y-gap-10 pt-20">
                    <PopularFacilities name="Lagos Marriott Hotel Ikeja" />
                  </div>
                </div>
                {/* End .col-12 Most Popular Facilities */}

                <div className="col-12">
                  <RatingTag name="Lagos Marriott Hotel Ikeja" />
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
          
          {/* End .row */}
          <AvailableRooms name="Lagos Marriott Hotel Ikeja" hotel={hotel} onShowRoomInfo={handleShowRoomInfo}  />
        </div>
        {/* End .container */}
      </section>
      {/* End Available Rooms */}

      <section className="pt-40" id="reviews">
        <div className="container">
          
          {/* End .row */}

          <ReviewProgress name="Lagos Marriott Hotel Ikeja" />
          {/* End review with progress */}

          <div className="pt-40">
            <DetailsReview />
            {/* End review with details */}
          </div>

          <div className="row pt-30">
            <div className="col-auto">
              <a href="#" className="button -md -outline-blue-1 text-blue-1">
                Show all 116 reviews{" "}
                <div className="icon-arrow-top-right ml-15"></div>
              </a>
            </div>
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
        {/* End container */}
      </section>
      {/* End Review section */}

      <section className="pt-40 mb-40">
        <div className="container">
          <div className="row">
            <div className="col-xl-8 col-lg-10">
              <div className="row">
                <div className="col-auto">
                  <h3 className="text-22 fw-500">Leave a Reply for Lagos Marriott Hotel Ikeja</h3>
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

      <section className="mt-40 mb-40" id="facilities">
        <div className="container">
          <div className="row x-gap-40 y-gap-40">
            <div className="col-12">
              <h3 className="text-22 fw-500">Facilities of Lagos Marriott Hotel Ikeja</h3>
              <div className="row x-gap-40 y-gap-40 pt-20">
                <Facilities />
              </div>
              {/* End .row */}
            </div>
            {/* End .col-12 */}
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>
      {/* End facilites section */}

      <section className="mt-40 mb-40" id="facilities">
        <div className="container">
          <div className="row x-gap-40 y-gap-40">
            <div className="col-lg-4">
              <h2 className="text-22 text-center fw-500">
                FAQs about
                <br /> Lagos Marriott Hotel Ikeja
              </h2>
            </div>
              {/* End .row */}

            <div className="col-lg-8">
              <div className="accordion -simple row y-gap-20 js-accordion">
                <Faq />
              </div>
            </div>
              {/* End .col */}
            {/* End .col-12 */}
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>
      {/* End facilites section */}

      <Footer />

      {/* Room Info Modal */}
      <RoomInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        roomData={selectedRoom}
      />
    </>
  );
};

export default dynamic(() => Promise.resolve(PropertySinglePage), {
  ssr: false,
});
