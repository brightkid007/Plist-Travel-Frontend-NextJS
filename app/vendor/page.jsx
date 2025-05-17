import dynamic from "next/dynamic";
import Footer from "@/components/footer/footer-5";
import Header from "@/components/header/customer-header";
import Hero from "@/components/hero/hero-customer";
import BlockGuide from "@/components/block/BlockGuide";
import Destinations from "@/components/home/home-1/Destinations";
import Hotels from "@/components/hotels/Hotels";
import SelectFilter from "@/components/hotels/filter-tabs/SelectFilter";


export const metadata = {
  title: "Customer Booking || Plist Travel",
  description: "Entry of Customer Booking",
};

const CustomerBookingEntry = () => {
  return (
    <>

      <Header />

      <Hero />

      <section className="layout-pt-md layout-pb-md">
        <div className="container">
          <div className="row y-gap-10 justify-between items-end">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">Featured Services</h2>
                {/* <p className=" sectionTitle__text mt-5 sm:mt-0">
                  Interdum et malesuada fames ac ante ipsum
                </p> */}
              </div>
            </div>
            <div className="col-sm-auto">
              <SelectFilter />
            </div>
          </div>
          {/* End .row */}

          <div className="relative overflow-hidden pt-40 sm:pt-20 js-section-slider item_gap-x30">
            <Hotels />
          </div>
          {/* End relative */}
        </div>
      </section>
      {/* Recommended Properties */}

      <section className="layout-pt-md layout-pb-lg">
        <div className="container">
          <div className="row y-gap-20 justify-between">
            <BlockGuide />
          </div>
        </div>
      </section>
      {/* Block Guide Section */}


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

      <Footer />
      {/* End Footer Section */}
    </>
  );
};

export default dynamic(() => Promise.resolve(CustomerBookingEntry), { ssr: false });
