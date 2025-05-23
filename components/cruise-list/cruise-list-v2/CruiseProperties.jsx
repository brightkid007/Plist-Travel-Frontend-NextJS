
'use client'

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import cruiseData from "../../../data/cruise";
import isTextMatched from "../../../utils/isTextMatched";
import Link from "next/link";

const CruiseProperties = () => {
  return (
    <>
      {cruiseData.map((item) => (
        <div
          key={item?.id}
          className="col-lg-4 col-sm-6"
          data-aos="fade"
          data-aos-delay={item?.delayAnimation}
        >
          <Link
            href={`/cruise-single/${item.id}`}
            className="cruiseCard -type-1 rounded-4 "
          >
            <div className="cruiseCard__image position-relative">
              <div className="carCard__image">
                <div className="cardImage ratio ratio-6:5">
                  <div className="cardImage__content custom_inside-slider">
                    <Swiper
                      className="mySwiper"
                      modules={[Pagination, Navigation]}
                      pagination={{
                        clickable: true,
                      }}
                      navigation={true}
                    >
                      {item?.slideImg?.map((slide, i) => (
                        <SwiperSlide key={i}>
                          <Image
                            width={300}
                            height={300}
                            className="rounded-4 col-12 js-lazy"
                            src={slide}
                            alt="image"
                            unoptimized
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </div>
                {/* End cartImage */}

                <div className="cardImage__wishlist">
                  <button className="button -blue-1 bg-white size-30 rounded-full shadow-2">
                    <i className="icon-heart text-12" />
                  </button>
                </div>

                <div className="cardImage__leftBadge">
                  <div
                    className={`py-5 px-15 rounded-right-4 text-12 lh-16 fw-500 uppercase  ${
                      isTextMatched(item?.tag, "best seller")
                        ? "bg-blue-1 text-white"
                        : ""
                    }`}
                  >
                    {item?.tag}
                  </div>
                </div>
              </div>

              <div className="cardImage__wishlist">
                <button className="button -blue-1 bg-white size-30 rounded-full shadow-2">
                  <i className="icon-heart text-12" />
                </button>
              </div>

              <div className="cardImage__leftBadge">
                <div
                  className={`py-5 px-15 rounded-right-4 text-12 lh-16 fw-500 uppercase ${
                    isTextMatched(item?.tag, "cruise only")
                      ? "bg-dark-1 text-white"
                      : ""
                  } ${
                    isTextMatched(item?.tag, "best seller")
                      ? "bg-blue-1 text-white"
                      : ""
                  }  ${
                    isTextMatched(item?.tag, "top rated")
                      ? "bg-yellow-1 text-dark-1"
                      : ""
                  }`}
                >
                  {item.tag}
                </div>
              </div>
            </div>
            {/* End .tourCard__image */}

            <div className="cruiseCard__content mt-10">
              <div className="text-14 lh-14 text-light-1 mb-5">
                {item?.ship}
              </div>
              <h4 className="cruiseCard__title text-dark-1 text-18 lh-16 fw-500">
                <span>{item?.title}</span>
              </h4>
              <p className="text-light-1 lh-14 text-14 mt-5" />
              <div className="row y-gap-10 justify-between items-center">
                <div className="col-auto">
                  <div className="text-14 text-dark-1 fw-500">Sailing Date</div>
                  <div className="text-14 text-light-1">{item?.date}</div>
                </div>
                <div className="col-auto">
                  <div className="text-14 text-dark-1 fw-500">Departs</div>
                  <div className="text-14 text-light-1">{item.departs}</div>
                </div>
                <div className="col-auto">
                  <div className="text-14 text-dark-1 fw-500">
                    Ports ({item.portsNumber})
                  </div>
                  <div className="text-14 text-light-1">
                    {item?.portsName}...
                  </div>
                </div>
              </div>
              {/* End .row */}

              <div className="row y-gap-20 justify-between items-center pt-5">
                <div className="col-auto">
                  <div className="d-flex items-center">
                    <div className="icon-star text-yellow-1 text-10 mr-5" />
                    <div className="text-14 text-light-1">
                      <span className="text-15 text-dark-1 fw-500">
                        {item?.ratings}
                      </span>
                      {item?.numberOfReviews} reviews
                    </div>
                  </div>
                </div>
                <div className="col-auto">
                  <div className="text-14 text-light-1">
                    From{" "}
                    <span className="text-16 fw-500 text-dark-1">
                      US${item?.price}
                    </span>
                  </div>
                </div>
              </div>
              {/* End .row */}
            </div>
          </Link>
        </div>
      ))}
    </>
  );
};

export default CruiseProperties;
