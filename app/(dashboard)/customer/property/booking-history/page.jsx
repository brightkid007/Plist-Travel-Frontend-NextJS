"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import "photoswipe/dist/photoswipe.css";
import { hotelsData } from "@/data/hotels";
import Header11 from "@/components/header/header-11";
import Header1 from "@/components/header/header-1";
import Overview from "@/components/hotel-single/Overview";
import PopularFacilities from "@/components/hotel-single/PopularFacilities";
import PropertyHighlights from "@/components/hotel-single/PropertyHighlights";
import RatingTag from "@/components/hotel-single/RatingTag";
import StickyHeader from "@/components/hotel-single/StickyHeader";
import TopBreadCrumb from "@/components/hotel-single/TopBreadCrumb";
import SidebarRight from "@/components/hotel-single/SidebarRight";
import AvailableRooms from "@/components/hotel-single/AvailableRooms";
import ReviewProgress from "@/components/hotel-single/guest-reviews/ReviewProgress";
import DetailsReview from "@/components/hotel-single/guest-reviews/DetailsReview";
import ReplyForm from "@/components/hotel-single/ReplyForm";
import ReplyFormReview from "@/components/hotel-single/ReplyFormReview";
import Facilities from "@/components/hotel-single/Facilities";
import Image from "next/image";
import Surroundings from "@/components/hotel-single/Surroundings";
import HelpfulFacts from "@/components/hotel-single/HelpfulFacts";
import Faq from "@/components/faq/Faq";
import Hotels2 from "@/components/hotels/Hotels2";
import CallToActions from "@/components/common/CallToActions";
import DefaultFooter from "@/components/footer/default";
import GalleryOne from "@/components/hotel-single/GalleryOne";
import Properties from "@/components/dashboard/dashboard/db-wishlist/components/Properties";
import Link from "next/link";
import ImageCard from "@/components/dashboard/image-card/ImageCard";
import FilterTab from "@/components/common/form/FilterTab";
import { bookingHistoryTabs } from "@/components/data/bookingHistoryTabs";

console.log(bookingHistoryTabs);

const PropertyBookingHistoryPage = ({ params }) => {
  const id = params.id;
  const hotel = hotelsData.find((item) => item.id == id) || hotelsData[0];

  const [filterOption, setFilterOption] = useState("all");

  return (
    <>
      {/* End Page Title */}

      <div className="header-margin"></div>
      {/* header top margin */}

      <Header1 />
      {/* End Header 1 */}

      <TopBreadCrumb />
      {/* End top breadcrumb */}


      <section className="pt-40">
        <div className="container">
          <div className="row y-gap-20 justify-between items-end">
            <div className="col-auto">
              <div className="row x-gap-20  items-center">
                <div className="col-auto">
                  <h1 className="text-30 sm:text-25 fw-600">Booking History</h1>
                </div>
                {/* End .col */}
                
              </div>
              {/* End .row */}

              <div className="row x-gap-20 y-gap-20 items-center">
                <div className="col-auto">
                  <div className="d-flex items-center text-15 text-light-1">
                    View and manage your past and upcoming bookings
                  </div>
                </div>
              </div>
              {/* End .row */}
            </div>
            {/* End .col */} 
          </div>
          <div className="row-auto y-gap-20 justify-between items-end">
                <FilterTab options={bookingHistoryTabs} tabOption={filterOption} setTabOption={setFilterOption}/>
          </div>

          {/* <Switch label="" /> */}
          {/* <ImageCard /> */}
          
          
        </div>
      </section>


      <DefaultFooter />
    </>
  );
};

export default dynamic(() => Promise.resolve(PropertyBookingHistoryPage), {
  ssr: false,
});
