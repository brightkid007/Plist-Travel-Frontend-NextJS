
'use client'

import Link from "next/link";
import { Parallax } from "react-parallax";

const ParallaxBanner = () => {
  return (
    <Parallax
      strength={200}
      bgImage="/img/backgrounds/banner.png"
      bgImageAlt="amazing place"
      bgClassName="object-fit-cover"
    >
      <div className="section-bg layout-pt-md layout-pb-md">
        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-auto">
              <h1 className="text-white mb-10">Adventure Awaits: Book Your Dream Tours Today!</h1>
              <p className="text-white mb-30">
                Discover a world of exciting tours, events, and attractions tailored to your interests. Whether you're seeking thrilling adventures, cultural experiences, or relaxing getaways, our platform connects you with the best options. Enjoy seamless booking, exclusive deals, and unforgettable memories. Start exploring now and make every journey extraordinary!
              </p>

              <div className="d-flex x-gap-15">
                <img src="/img/backgrounds/banner-in1.png" alt="banner-in-1" className="img-fluid w-50" />
                <img src="/img/backgrounds/banner-in2.png" alt="banner-in-1" className="img-fluid w-50" />
                <img src="/img/backgrounds/banner-in3.png" alt="banner-in-1" className="img-fluid w-50" />
              </div>

              <div className="d-inline-block mt-20">
                <Link
                  href="/customer"
                  className="button -md -dark-1 bg-white text-blue-1"
                >
                  Explore All
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Parallax>
  );
};

export default ParallaxBanner;
