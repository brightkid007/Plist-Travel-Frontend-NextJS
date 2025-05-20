import dynamic from "next/dynamic";
import "photoswipe/dist/photoswipe.css";
import cruiseData from "@/data/cruise";
import Header from "@/components/header/customer-header";
import Overview from "@/components/cruise-single/Overview";
import TopBreadCrumb from "@/components/cruise-single/TopBreadCrumb";
import SidebarRight from "@/components/cruise-single/SidebarRight";
import ReviewProgress from "@/components/cruise-single/guest-reviews/ReviewProgress";
import DetailsReview from "@/components/cruise-single/guest-reviews/DetailsReview";
import ReplyForm from "@/components/cruise-single/ReplyForm";
import ReplyFormReview from "@/components/cruise-single/ReplyFormReview";
import Facilities from "@/components/cruise-single/Facilities";
import CallToActions from "@/components/common/CallToActions";
import Footer from "@/components/footer/footer-5";
import MapPropertyFinder from "@/components/cruise-single/MapPropertyFinder";
import GalleryCruiseSlider from "@/components/cruise-single/GalleryCruiseSlider";
import CitiesLandmarks from "@/components/property-single/CitiesLandmarks";

import PopularFlights from "@/components/home/PopularFlights";

export const metadata = {
  title: "Flight Detail || Plist Travel",
  description: "Check Flight Detail",
};

const FlightSinglePage = ({ params }) => {
  const id = params.id;
  const cruise = cruiseData.find((item) => item.id == id);

  return (
    <>
      {/* End Page Title */}

      <div className="header-margin"></div>
      {/* header top margin */}

      <Header />
      {/* End Header 1 */}

      <TopBreadCrumb />
      {/* End top breadcrumb */}

      <section className="pt-40">
        <div className="container">
          <div className="row justify-between items-end">
            <div className="col-auto">
              <h1 className="text-26 fw-600">7 Night Flight to the Western Mediterranean</h1>
              <div className="d-flex x-gap-5 items-center pt-5">
                <i className="icon-location-2 text-16 text-light-1" />
                <div className="text-15 text-light-1">{cruise?.location}</div>
                <button
                  data-x-click="mapFilter"
                  className="text-15 text-blue-1 underline"
                >
                  Show on map
                </button>
              </div>
            </div>
            {/* End .col-auto */}

            <div className="col-auto">
              <div className="row x-gap-10 y-gap-10">
                <div className="col-auto">
                  <button className="button px-15 py-10 -blue-1">
                    <i className="icon-share mr-10" />
                    Share
                  </button>
                </div>
                {/* End .col-auto */}

                <div className="col-auto">
                  <button className="button px-15 py-10 -blue-1 bg-light-2">
                    <i className="icon-heart mr-10" />
                    Save
                  </button>
                </div>
                {/* End .col-auto */}
              </div>
              {/* End .row */}
            </div>
            {/* End .col-auto */}
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>
      {/* End top gallery header section */}

      <section className="pt-30">
        <div className="container">
          <div className="row y-gap-30">
            <div className="col-xl-8">
              <GalleryCruiseSlider />
              {/* End gallery grid wrapper */}

              <Overview />
              {/* End Overview */}
            </div>
            {/* End .col-xl-8 */}

            <div className="col-xl-4">
              <SidebarRight service={cruise} />
            </div>
            {/* End .col-xl-4 */}
          </div>
          {/* End .row */}
        </div>
        {/* End container */}
      </section>
      {/* End single page content */}



      <section className="pt-40">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h3 className="text-22 fw-500">Guest reviews</h3>
            </div>
          </div>
          {/* End .row */}

          <ReviewProgress />
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

      <section className="pt-40 layout-pb-md">
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
      <section className="layout-pt-md layout-pb-lg">
        <div className="container">
          <div className="row y-gap-20 justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">Similar 7 Night Flight to the Western Mediterranean available</h2>
                {/* <p className=" sectionTitle__text mt-5 sm:mt-0">
                  Interdum et malesuada fames ac ante ipsum
                </p> */}
              </div>
            </div>
            {/* End .col */}

          </div>
          {/* End .row */}

          <div className="row y-gap-30 pt-40 sm:pt-20">
            <PopularFlights />
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>

      <section className="mt-40 mb-40" id="cities-landmarks">
        <div className="container">
          <div className="row x-gap-40 y-gap-40">
            <div className="col-12">
              <CitiesLandmarks service={cruise} />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default dynamic(() => Promise.resolve(FlightSinglePage), {
  ssr: false,
});
