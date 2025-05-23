"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/footer/footer-5";
import Header from "@/components/header/header-1";
import Hero from "@/components/hero/hero-land";
import Blog from "@/components/home/Blog";
import Destinations from "@/components/home/Destinations";
import PopularRides from "@/components/home/PopularRides";
import PopularFlights from "@/components/home/PopularFlights";
import PopularTravelPackages from "@/components/home/PopularTravelPackages";
import ParallaxBanner from "@/components/banner/ParallaxBanner";
import Faq from "@/components/faq/Faq";
import AttrEvents from "@/components/home/AttrEvents";
import HolidayAmazing from "@/components/home/HolidayAmazing";
import AppBanner from "@/components/home/AppBanner";
import { useMediaQuery } from "react-responsive";

const Home = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  return (
    <>
      {/* End Page Title */}

      <Header />
      {/* End Header 1 */}

      <Hero />
      {/* End Hero 1 */}

      {/* <section className="layout-pt-lg layout-pb-md" data-aos="fade-up">
        <div className="container"> */}

      {/* <div className="relative pt-40 sm:pt-20">
            <PopularDestinations />
          </div> */}
      {/* </div> */}
      {/* End .container */}
      {/* </section> */}
      {/* End Popular Destinations */}

      <section className="layout-pt-md layout-pb-md">
        <div className="container">
          <div className="row y-gap-10 justify-center items-end">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">Featured Destinations</h2>
                {/* <p className=" sectionTitle__text mt-5 sm:mt-0">
                  Interdum et malesuada fames ac ante ipsum
                </p> */}
              </div>
            </div>
            {/* <div className="col-sm-auto">
              <SelectFilter />
            </div> */}
          </div>
          {/* End .row */}

          <div className="relative overflow-hidden pt-40 sm:pt-20 js-section-slider item_gap-x30">
            <Destinations />
          </div>
          {/* End relative */}
        </div>
      </section>
      {/* Recommended Properties */}

      <section className="layout-pt-md layout-pb-md">
        <div className="container">
          <div className="row y-gap-20 justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">Popular Rides</h2>
                {/* <p className=" sectionTitle__text mt-5 sm:mt-0">
                  Interdum et malesuada fames ac ante ipsum
                </p> */}
              </div>
            </div>
            {/* End .col */}
          </div>
          {/* End .row */}

          <div className="row y-gap-30 pt-40 sm:pt-20 item_gap-x30">
            <PopularRides />
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>
      {/* Popular Car Hire Sections */}

      <section className="layout-pt-md layout-pb-lg">
        <div className="container">
          <div className="row y-gap-20 justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">Top Deals Flights</h2>
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

      <section className="layout-pt-md layout-pb-lg">
        <div className="container">
          <div className="row y-gap-20 justify-center text-center">
            <div className="col-12">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">Popular Travel Packages</h2>
                {/* <p className=" sectionTitle__text mt-5 sm:mt-0">
                  Interdum et malesuada fames ac ante ipsum
                </p> */}
              </div>
            </div>
            {/* End .col-auto */}

            <div className="col-12 ml-auto d-flex justify-end">
              <button className="button px-20 py-10 rounded-8 fw-500 text-14 bg-blue-1 text-white">
                Create a Travel Package
              </button>
            </div>
          </div>
          {/* End .row */}

          <div className="pt-40 sm:pt-20 item_gap-x30">
            <PopularTravelPackages />
          </div>
        </div>
        {/* End .container */}
      </section>

      <section className="layout-pt-md layout-pb-lg">
        <div className="container">
          <div className="row y-gap-20 justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">
                  Connect your property with multiple channels
                </h2>
                {/* <p className=" sectionTitle__text mt-5 sm:mt-0">
                  Interdum et malesuada fames ac ante ipsum
                </p> */}
              </div>
            </div>
            {/* End .col-auto */}
          </div>
          {/* End .row */}

          <div className="row pt-40 sm:pt-20 item_gap-x30 y-gap-20">
            <div className="col-lg-4 col-md-6 col-sm-12">
              <img
                src="/img/general/convChannel1.png"
                alt=""
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12">
              <img
                src="/img/general/convChannel2.png"
                alt=""
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12">
              <div
                style={{
                  backgroundColor: "#EEFAFF",
                }}
                className="h-100 rounded-22 d-flex flex-column justify-center py-20"
              >
                <div className="row mx-3">
                  <div className="col-12">
                    <img src="/img/icons/omega-square.svg" alt="omega" />
                  </div>
                  <div className="col-12">
                    <p className="text-26 fw-semibold">Devices Sync</p>
                    <p className="text-14">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Urna, tortor tempus. Lorem ipsum dolor sit amet,
                      consectetur tortoradipiscing elit. Urna, tortor tempus.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12">
              <div
                style={{
                  backgroundColor: "#EEFAFF",
                }}
                className="h-100 rounded-22 d-flex flex-column justify-center py-20"
              >
                <div className="row mx-3">
                  <div className="col-12">
                    <img src="/img/icons/colors-square.svg" alt="color" />
                  </div>
                  <div className="col-12">
                    <p className="text-26 fw-semibold">Ease of Use</p>
                    <p className="text-14">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Urna, tortor tempus. Lorem ipsum dolor sit amet,
                      consectetur tortoradipiscing elit. Urna, tortor tempus.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12">
              <div className="h-100 rounded-22 border border-1 border-primary text-center d-flex flex-column justify-center py-20">
                <div className="row mx-3 items-center justify-center">
                  <div className="col-12">
                    <img src="/img/general/plistLogo2.svg" alt="color" />
                  </div>
                  <div className="col-12">
                    <p className="text-26 fw-semibold">Are you a Vendor?</p>
                    <p className="text-14">
                      Partner with Us: Showcase YourAccommodations to Travelers
                      Worldwide!
                    </p>
                  </div>
                  <Link
                    href={"/signup"}
                    className="button -md bg-blue-1 text-white col-auto mt-10 px-20 py-10"
                  >
                    Sign Up as a Vendor
                    <span className="material-symbols-outlined ml-5">
                      expand_circle_right
                    </span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12">
              <img
                src="/img/general/convChannel3.png"
                alt=""
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>
        </div>
        {/* End .container */}
      </section>

      <section className="layout-pt-md layout-pb-md">
        <div
          style={{
            background: "linear-gradient(to right, #245BAA, #0CA4C4)",
            color: "white",
          }}
        >
          <div className="container">
            <div className="row y-gap-20 justify-between">
              <div className="col-md-6 d-flex flex-column justify-center items-center px-50 py-20">
                <div className="text-white fw-500 text-26 text-center">
                  We partner with travel agents across the globe,bringing new
                  realms of luxury travel options to your clients
                </div>
                <span className="mt-20">
                  <button className="button -md bg-blue-1 fw-400 text-white text-12 rounded-8 col-auto mt-10 px-20 py-10">
                    BECOME AN AGENT
                  </button>
                </span>
              </div>
              <div className="col-md-5 d-flex justify-center items-center">
                <img
                  src="/Images/agent_banner.svg"
                  alt=""
                  style={{ height: "250px" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <BecomeAgent /> */}

      <section className="layout-pt-md layout-pb-md">
        <div className="container">
          <div className="row y-gap-20">
            <HolidayAmazing />
          </div>
        </div>
        {/* End .container */}
      </section>

      <ParallaxBanner />

      <section className="layout-pt-lg layout-pb-md">
        <div className="container">
          <div className="row y-gap-20">
            <div className="col-lg-8 col-md-12 col-sm-12">
              <h2 className="text-30 fw-500">Frequently asked questions</h2>
              <div className="accordion -simple row y-gap-20 js-accordion mt-20">
                <Faq />
              </div>
            </div>
            <div className="col-lg-4">
              <Link
                href="#"
                className="citiesCard -type-1 d-block rounded-22 shadow"
              >
                <div className="citiesCard__image ratio ratio-3:4">
                  <Image
                    width={300}
                    height={400}
                    src="/img/activities/home/attr1.jpg"
                    alt="image"
                    className="js-lazy"
                    unoptimized
                  />
                </div>
                <div className="citiesCard__content d-flex flex-column justify-between text-center pt-30 pb-20 px-20">
                  <div className="citiesCard__bg" />
                  <div className="citiesCard__top">
                    <div className="text-14 text-white"></div>
                  </div>
                  <div className="citiesCard__bottom">
                    <h4 className="text-26 md:text-20 lh-13 text-white mb-50">
                      Do you have more questions?
                    </h4>
                    <button className="button col-12 h-60 -blue-1 bg-white text-dark-1">
                      More Questions
                    </button>
                  </div>
                </div>
              </Link>
            </div>
            {/* End .col */}

            {/* End .col-lg-8 */}
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>
      {/* End Faq Section */}

      <section className="layout-pt-md layout-pb-md">
        <div
          style={{
            background: "linear-gradient(to right, #245BAA, #0CA4C4)",
            color: "white",
          }}
        >
          <div className="container">
            <div className="row y-gap-20 justify-between">
              <div className="col-md-6 d-flex flex-column justify-center items-center px-50 py-20">
                <div className="text-white fw-500 text-30 text-center">
                  Open Your Network
                </div>
                <div className="text-white text-12 text-center">
                  Et labore harum non nobis ipsum eum molestias mollitia et
                  corporis praesentium a laudantium internos. Non quis eius quo
                  eligendi corrupti et fugiat nulla qui soluta recusandae in
                  maxime quasi aut ducimus illum aut optio quibusdam!
                </div>
                <span className="mt-20">
                  <button className="button -md bg-white fw-500 text-blue-1 text-12 rounded-8 col-auto mt-10 px-20 py-10">
                    Become a vender
                  </button>
                </span>
              </div>
              {!isMobile && <div
                className="col-md-5 d-flex justify-center items-center"
                style={{ marginTop: "-150px", marginBottom: "-20px" }}
              >
                <img
                  src="/Images/vender_banner.svg"
                  alt=""
                  style={{ height: "100%" }}
                />
              </div>}
            </div>
          </div>
        </div>
      </section>

      <section className="layout-pt-md layout-pb-md">
        <div className="container">
          <div className="row y-gap-20">
            <AttrEvents />
          </div>
        </div>
        {/* End .container */}
      </section>
      {/* End AddBanner */}

      <section className="layout-pt-lg layout-pb-md">
        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">Travel Blogs</h2>
                {/* <p className=" sectionTitle__text mt-5 sm:mt-0">
                  Interdum et malesuada fames
                </p> */}
              </div>
            </div>
          </div>
          {/* End .row  */}
          <div className="row y-gap-30 pt-40">
            <Blog />
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>
      {/* End blog Section */}

      <AppBanner />

      <Footer />
      {/* End Footer Section */}
    </>
  );
};

export default dynamic(() => Promise.resolve(Home), { ssr: false });
