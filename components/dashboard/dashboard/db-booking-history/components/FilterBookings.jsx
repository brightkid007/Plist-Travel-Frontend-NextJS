"use client";

import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";
import { bookingHistoryData } from "@/components/data/bookingHistoryData";
import isTextMatched from "@/utils/isTextMatched";
import { useEffect, useState } from "react";

const FilterBookings = ({ filterOption }) => {
  const [filteredItems, setFilteredItems] = useState([]);
  var itemSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  useEffect(() => {
    if (filterOption === 'all') {
      setFilteredItems(bookingHistoryData);
    } else {
      setFilteredItems(bookingHistoryData.filter((elm) => elm.tag === filterOption));
    }
  }, [filterOption, bookingHistoryData]);

  // custom navigation
  function ArrowSlick(props) {
    let className =
      props.type === "next"
        ? "slick_arrow-between slick_arrow -next arrow-md flex-center button -blue-1 bg-white shadow-1 size-30 rounded-full sm:d-none js-next"
        : "slick_arrow-between slick_arrow -prev arrow-md flex-center button -blue-1 bg-white shadow-1 size-30 rounded-full sm:d-none js-prev";
    className += " arrow";
    const char =
      props.type === "next" ? (
        <>
          <i className="icon icon-chevron-right text-12"></i>
        </>
      ) : (
        <>
          <span className="icon icon-chevron-left text-12"></span>
        </>
      );
    return (
      <button className={className} onClick={props.onClick}>
        {char}
      </button>
    );
  }

  return (
    <>
      {filteredItems.slice(0, 8).map((item) => (
        <div
          className="col-xl-3 col-lg-3 col-sm-6"
          key={item?.id}
          data-aos="fade"
          data-aos-delay={item.delayAnimation}
        >
          <Link
            href={item.link}
            className="hotelsCard -type-1 hover-inside-slider"
          >
            <div className="hotelsCard__image">
              <div className="cardImage inside-slider">
                <Slider
                  {...itemSettings}
                  arrows={true}
                  nextArrow={<ArrowSlick type="next" />}
                  prevArrow={<ArrowSlick type="prev" />}
                >
                  {item?.slideImg?.map((slide, i) => (
                    <div className="cardImage ratio ratio-1:1" key={i}>
                      <div className="cardImage__content ">
                        <Image
                          fill
                          className="rounded-4 col-12 js-lazy"
                          src={slide}
                          alt="image"
                          unoptimized
                        />
                      </div>
                    </div>
                  ))}
                </Slider>

                <div className="cardImage__wishlist">
                  <button className="button -blue-1 bg-white size-30 rounded-full shadow-2">
                    <i className="icon-heart text-12" />
                  </button>
                </div>

                <div className="cardImage__leftBadge">
                  <div
                    className={`py-5 px-15 rounded-right-4 text-12 lh-16 fw-500 uppercase 
                    
                    ${
                      isTextMatched(item?.tag, "completed")
                        ? "bg-blue-1 text-white"
                        : ""
                    } 
                    ${
                      isTextMatched(item?.tag, "cancelled")
                        ? "bg-brown-1 text-white"
                        : ""
                    }
                     ${
                       isTextMatched(item?.tag, "upcoming")
                         ? "bg-yellow-1 text-dark-1"
                         : ""
                     }`
                    }
                  >
                    {item?.tag}
                  </div>
                </div>
              </div>
            </div>
            <div className="hotelsCard__content mt-10">
              <h4 className="hotelsCard__title text-dark-1 text-18 lh-16 fw-500">
                <span>
                    {item?.title}
                </span>
              </h4>
              <p className="text-light-1 lh-14 text-14 mt-5">
                {item?.location}
              </p>
              <div className="d-flex justify-between items-center mt-10">
                
                <div className="text-14 text-dark-1 fw-500">
                  Booking ID:
                </div>
                <div className="text-14 text-light-1 ml-10">
                  {item?.BookingID}
                </div>
              </div>
              <div className="mt-5">
                <div className="fw-500">
                  Starting from{" "}
                  <span className="text-blue-1">US${item?.price}</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </>
  );
};

export default FilterBookings;
