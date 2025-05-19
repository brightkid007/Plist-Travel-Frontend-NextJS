
'use client'

import React, { useRef, useState } from "react";
import { Gallery, Item } from "react-photoswipe-gallery";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, Navigation } from "swiper";
import "swiper/css/thumbs";
import Image from "next/image";

const GalleryRoomSlider = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const galleryImage = [
    "/img/hotels/room/room1.jpg",
    "/img/hotels/room/room2.jpg",
    "/img/hotels/room/room3.jpg",
    "/img/hotels/room/room4.jpg",
    "/img/hotels/room/room5.jpg",
    "/img/hotels/room/room6.jpg",
  ];

  return (
    <div className="cruiseSlider">
      <Gallery>
        <div className="cruiseSlider-slider relative">
          <div className="d-flex js-cruise-slider">
            <Swiper
              thumbs={{
                swiper:
                  thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
              }}
              modules={[Thumbs, Navigation]}
              navigation={{
                nextEl: ".cruiseSlider__nav.js-next",
                prevEl: ".cruiseSlider__nav.js-prev",
              }}
              lazy={true}
              loop={true}
            >
              {galleryImage.map((item, i) => (
                <SwiperSlide key={i}>
                  <Item
                    width={451}
                    height={375}
                    original={item}
                    thumbnail={item}
                  >
                    {({ ref, open }) => (
                      <Image
                        width={451}
                        height={375}
                        src={item}
                        ref={ref}
                        onClick={open}
                        alt="large slide"
                        unoptimized
                      />
                    )}
                  </Item>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="cruiseSlider__nav -prev js-prev">
              <button className="button -outline-white size-50 flex-center text-white rounded-full">
                <i className="icon-arrow-left" />
              </button>
            </div>
            <div className="cruiseSlider__nav -next js-next">
              <button className="button -outline-white size-50 flex-center text-white rounded-full">
                <i className="icon-arrow-right" />
              </button>
            </div>
          </div>
          {/* End d-flex */}
        </div>
        {/* End relative */}{" "}
      </Gallery>

      <div className="cruiseSlider-slides row x-gap-10 y-gap-10 pt-10 js-cruise-slides">
        <Swiper
          onSwiper={setThumbsSwiper}
          slidesPerView={6}
          modules={[Thumbs]}
          spaceBetween={12}
        >
          {galleryImage.map((item, i) => (
            <SwiperSlide
              key={i}
              className="cruiseSlider-slides__item  rounded-4"
            >
              <Image
                width={131}
                height={109}
                src={item}
                alt="small size slide"
                className="h-full"
                unoptimized
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default GalleryRoomSlider;
