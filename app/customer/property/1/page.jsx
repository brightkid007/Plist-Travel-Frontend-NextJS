"use client";

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
import FunFacts from "@/components/property-single/FunFacts";
import PlacesNearBy from "@/components/property-single/PlacesNearBy";
import SimilarProperties from "@/components//property-single/SimilarProperties";
import HouseRules from "@/components/property-single/HouseRules";
import CitiesLandmarks from "@/components/property-single/CitiesLandmarks";
import Link from "next/link";

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
  };

  function formatStayDates(checkInDate = new Date(), nights = 3) {
    const options = { day: "2-digit", month: "short" };

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + nights);

    const checkInFormatted = checkIn.toLocaleDateString("en-GB", options);
    const checkOutFormatted = checkOut.toLocaleDateString("en-GB", options);

    return `${checkInFormatted} - ${checkOutFormatted}`;
  }
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
                    <PopularFacilities name={hotel.title} />
                  </div>
                </div>
                {/* End .col-12 Most Popular Facilities */}

                <div className="col-12">
                  <RatingTag name={hotel.title} />
                </div>
                {/* End .col-12 This property is in high demand! */}
              </div>
              {/* End .row */}
            </div>
            {/* End .col-xl-8 */}

            <div className="col-xl-4">
              <SidebarRight service={hotel} />
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
          <AvailableRooms
            name={hotel.title}
            hotel={hotel}
            onShowRoomInfo={handleShowRoomInfo}
          />
        </div>
        {/* End .container */}
      </section>
      {/* End Available Rooms */}

      <section className="pt-40" id="reviews">
        <div className="container">
          {/* End .row */}

          <ReviewProgress name={hotel.title} />
          {/* End review with progress */}

          <div className="pt-40">
            <DetailsReview />
            {/* End review with details */}
          </div>

          <div className="row pt-30">
            <div className="col-auto">
              <Link href="#" className="button -md -outline-blue-1 text-blue-1">
                Show all 116 reviews{" "}
                <div className="icon-arrow-top-right ml-15"></div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-40 mb-40">
        <div className="container">
          <div className="row">
            <div className="col-xl-8 col-lg-10">
              <div className="row">
                <div className="col-auto">
                  <h3 className="text-22 fw-600">
                    Leave a Reply for {hotel.title}
                  </h3>
                  <p className="text-15 text-dark-1 mt-5">
                    Your email address will not be published.
                  </p>
                </div>
              </div>
              <ReplyFormReview />
              <ReplyForm />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-40 mb-40 pt-20" id="fun-facts">
        <div className="container">
          <div className="row x-gap-40 y-gap-20">
            <div className="col-12 d-flex justify-between items-center">
              <h3 className="text-22 fw-600">Fun Facts about {hotel.title}</h3>
              <Link href="#rooms" className="button -md -dark-1 bg-blue-1 text-white">
                See availability
              </Link>
            </div>
            <div className="col-12">
              <FunFacts />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-40 mb-40 pt-20" id="fun-facts">
        <div className="container">
          <div className="row x-gap-40 y-gap-20">
            <div className="col-12 d-flex justify-between items-center">
              <div>
                <h3 className="text-22 fw-600">Places Nearby {hotel.title}</h3>
                <button
                  data-x-click="mapFilter"
                  className="text-blue-1 text-15 underline"
                >
                  Good location - show on map
                </button>
              </div>
              <Link href={"#rooms"} className="button -md -dark-1 bg-blue-1 text-white">
                See availability
              </Link>
            </div>
            <div className="col-12">
              <PlacesNearBy />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-40 mb-40" id="facilities">
        <div className="container">
          <div className="row x-gap-40 y-gap-40">
            <div className="col-12">
              <div className="col-12 d-flex justify-between items-center">
                <h3 className="text-22 fw-600">Facilities of {hotel.title}</h3>
                <Link href={"#rooms"} className="button -md -dark-1 bg-blue-1 text-white">
                  See availability
                </Link>
              </div>
              <div className="col-12">
                <div className="row x-gap-40 y-gap-40 pt-20">
                  <Facilities />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-40 mb-40" id="similar-properties">
        <div className="container">
          <div className="row y-gap-10 justify-between items-center">
            <div className="col-auto">
              <h3 className="text-22 fw-600">
                Similar properties available for your dates ({formatStayDates()}
                )
              </h3>
            </div>
          </div>

          <div className="relative overflow-hidden pt-40 sm:pt-20 js-section-slider item_gap-x30">
            <SimilarProperties />
          </div>
        </div>
      </section>

      <section className="mt-40 mb-40 pt-20" id="house-rules">
        <div className="container">
          <div className="row x-gap-40 y-gap-20">
            <div className="col-12 d-flex justify-between items-center">
              <div>
                <h3 className="text-22 fw-600">House rules</h3>
                <div className="text-light-1">
                  Studio 6-Denton, TX - UNT takes special requests - add in the
                  next step!
                </div>
              </div>
              <Link href={"#rooms"} className="button -md -dark-1 bg-blue-1 text-white">
                See availability
              </Link>
            </div>
            <div className="col-12">
              <HouseRules />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-40 mb-40 pt-20" id="fine-print">
        <div className="container">
          <div className="row x-gap-40 y-gap-20">
            <div className="col-12 d-flex justify-between items-center">
              <div>
                <h3 className="text-22 fw-600">
                  Other Important Notes on {hotel.title}
                </h3>
                <div className="text-light-1">
                  Need-to-know information for guests at this property
                </div>
              </div>
              <Link href={"#rooms"} className="button -md -dark-1 bg-blue-1 text-white">
                See availability
              </Link>
            </div>
            <div className="col-12">
              <div className="border-light rounded-8 px-20 py-20">
                <p className="text-14 lh-16 text-dark-1 mb-10">
                  You must show a valid photo ID and credit card upon check-in.
                  Please note that all special requests cannot be guaranteed and
                  are subject to availability upon check-in. Additional charges
                  may apply.
                </p>
                <p className="text-14 lh-16 text-dark-1 mb-10">
                  Guests are required to show a photo identification and credit
                  card upon check-in. Please note that all Special Requests are
                  subject to availability and additional charges may apply.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-40 mb-40" id="facilities">
        <div className="container">
          <div className="row x-gap-40 y-gap-40">
            <div className="col-lg-4">
              <h2 className="text-22 text-center fw-500">
                FAQs about
                <br /> {hotel.title}
              </h2>
            </div>

            <div className="col-lg-8">
              <div className="accordion -simple row y-gap-20 js-accordion">
                <Faq />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-40 mb-40" id="cities-landmarks">
        <div className="container">
          <div className="row x-gap-40 y-gap-40">
            <div className="col-12">
              <CitiesLandmarks hotel={hotel} />
            </div>
          </div>
        </div>
      </section>

      <Footer />

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
