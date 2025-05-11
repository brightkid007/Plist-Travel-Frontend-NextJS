import dynamic from "next/dynamic";
import Link from "next/link";
import AddBanner from "@/components/add-banner/AddBanner";
import PopularDestinations from "@/components/destinations/PopularDestinations";
import Footer from "@/components/footer/footer-5";
import Header1 from "@/components/header/header-1";
import Hero from "@/components/hero/hero-land";
import BlockGuide from "@/components/block/BlockGuide";
import Blog from "@/components/blog/Blog3";
import CallToActions from "@/components/common/CallToActions";
import Testimonial from "@/components/home/home-1/Testimonial";
import TestimonialLeftCol from "@/components/home/home-1/TestimonialLeftCol";
import Destinations from "@/components/home/Destinations"
import SelectFilter from "@/components/hotels/filter-tabs/SelectFilter";
import PopularRides from "@/components/home/PopularRides";
import PopularFlights from "@/components/home/PopularFlights";
import PopularTravelPackages from "@/components/home/PopularTravelPackages";
import ParallaxBanner from "@/components/banner/ParallaxBanner";
import Faq from "@/components/faq/Faq";

export const metadata = {
  title: "Home-1 || GoTrip - Travel & Tour React NextJS Template",
  description: "GoTrip - Travel & Tour React NextJS Template",
};

const Home_1 = () => {
  return (
    <>
      {/* End Page Title */}

      <Header1 />
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
          <div className="row y-gap-20">
            {/* <AddBanner /> */}
          </div>
        </div>
        {/* End .container */}
      </section>
      {/* End AddBanner */}

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
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">Popular Travel Packages</h2>
                {/* <p className=" sectionTitle__text mt-5 sm:mt-0">
                  Interdum et malesuada fames ac ante ipsum
                </p> */}
              </div>
            </div>
            {/* End .col-auto */}
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
                <h2 className="sectionTitle__title">Popular Travel Packages</h2>
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
              <img src="/img/general/convChannel1.png" alt="" />
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12">
              <img src="/img/general/convChannel2.png" alt="" />
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12">
              <div style={{
                backgroundColor: '#EEFAFF',
                }}
                className="h-100 rounded-22"
              >
                <div className="row mx-3">
                  <img src="/img/icons/omega-square.svg" alt="omega" style={{ height: '20px' }} />
                  <div className="">
                    <p className="text-26 fw-semibold">Devices synchronization</p>
                    <p className="text-14">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Urna, tortor tempus. Lorem ipsum dolor sit amet, consectetur  tortoradipiscing elit. Urna, tortor tempus.</p>
                  </div>
                  

                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12">
              <div style={{
                backgroundColor: '#EEFAFF',
                }}
                className="h-100 rounded-22"
              >
                <div className="row mx-3">
                  <img src="/img/icons/colors-square.svg" alt="color" style={{ height: '20px' }} />
                  <div className="">
                    <p className="text-26 fw-semibold">Ease of use
                    </p>
                    <p className="text-14">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Urna, tortor tempus. Lorem ipsum dolor sit amet, consectetur  tortoradipiscing elit. Urna, tortor tempus. </p>
                  </div>
                  

                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12">
              <div
                className="h-100 rounded-22 border border-1 border-primary text-center"
              >
                <div className="row mx-3">
                  <img src="/img/general/plistLogo2.svg" alt="color" style={{ height: '20px' }} />
                  <div className="">
                    <p className="text-26 fw-semibold">Are you a Vendor?</p>
                    <p className="text-14">Partner with Us: Showcase Your Accommodations to Travelers Worldwide!</p>
                  </div>
                  

                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12">
              <img src="/img/general/convChannel3.png" alt="" />
            </div>
          </div>
        </div>
        {/* End .container */}
      </section>
                
      <ParallaxBanner />

      <section className="layout-pt-lg layout-pb-md">
        <div className="container">
          <div className="row y-gap-20">
            <div className="col-lg-8">
              <h2 className="text-30 fw-500">
                FAQs about
                <br />
                London
              </h2>
              <div className="accordion -simple row y-gap-20 js-accordion">
                <Faq />
              </div>
            </div>
            <div className="col-lg-4">
              <img src="" alt="" />
            </div>
            {/* End .col */}

            
            {/* End .col-lg-8 */}
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>
      {/* End Faq Section */}

      <section className="layout-pt-lg layout-pb-lg bg-blue-2">
        <div className="container">
          <div className="row y-gap-40 justify-between">
            <div className="col-xl-5 col-lg-6" data-aos="fade-up">
              <TestimonialLeftCol />
            </div>
            {/* End col */}

            <div className="col-lg-6">
              <div
                className="overflow-hidden js-testimonials-slider-3"
                data-aos="fade-up"
                data-aos-delay="50"
              >
                <Testimonial />
              </div>
            </div>
          </div>
          {/* End .row */}
        </div>
        {/* End container */}
      </section>
      {/* End testimonial Section */}

      <section className="layout-pt-lg layout-pb-md">
        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">
                  Get inspiration for your next trip
                </h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  Interdum et malesuada fames
                </p>
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

      <section className="layout-pt-md layout-pb-lg">
        <div className="container">
          <div className="row">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">Destinations we love</h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  Interdum et malesuada fames ac ante ipsum
                </p>
              </div>
            </div>
          </div>
          {/* End .row */}

          <div className="tabs -pills pt-40 js-tabs">
            <Destinations />
          </div>
          {/* End tabs */}
        </div>
      </section>
      {/* End Destination we love Section */}

      <CallToActions />
      {/* End Call To Actions Section */}

      <Footer />
      {/* End Footer Section */}
    </>
  );
};

export default dynamic(() => Promise.resolve(Home_1), { ssr: false });
