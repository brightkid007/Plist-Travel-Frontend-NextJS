import React from "react";
import right from "/public/Images/right-shape 2.png";
import left from "/public/Images/right-shape 1.png";
import card1 from "/public/Images/image (3).png";
import card2 from "/public/Images/image (4).png";
import card3 from "/public/Images/image (5).png";
import card4 from "/public/Images/image (6).png";
import location from "/public/Images/location.svg";
import Image from "next/image";

function Car2() {
  return (
    <div className="relative lg:mt-12 mt-10 flex flex-col items-center px-4 lg:w-[90%] lg:mx-auto">
      {/* Header */}
      <div className="text-center md:mb-12 mb-8">
        <p className="border border-[#054CA3] text-[#054CA3] text-center w-fit mx-auto rounded-full md:mt-16 mt-8 text-sm sm:text-base font-Bricolage text-[18px] font-bold py-[10px] px-[12px]">
          Top Deals{" "}
        </p>
        <h1 className="text-xl sm:text-2xl md:text-[42px] font-medium text-[#141D2B] font-Bricolage text-center mt-4 w-full mx-auto">
          Top Hire Rides
        </h1>
      </div>

      <div className="relative flex items-center justify-center w-full">
        {/* Left Image */}
        {/* <Image
          src={right}
          alt="left shape"
          className="absolute left-0 top-1/2 transform -translate-y-1/2 w-20 sm:w-28 md:w-36 lg:w-48 -z-10 lg:flex hidden"
        /> */}

        {/* Cards */}
        <div className="flex justify-center md:gap-3 gap-7 z-10 md:px-20 px-4 flex-wrap">
          {/* Card 1 */}
          {[card1, card2, card3, card4].map((image, index) => (
            <div
              key={index}
              className="bg-[#CDCDCD] shadow-lg overflow-hidden sm:w-[90%] w-full md:w-[304px] lg:w-[324px] h-[360px]"
            >
              <Image
                src={image}
                alt={`Card ${index + 1}`}
                className="w-full h-[214px] object-cover"
                unoptimized
              />
              <div className="p-3 bg-[#D9D9D966]">
                <div className="flex items-center space-x-2">
                  <Image src={location} alt="location" unoptimized />
                  <p className="text-[#2D3B4E] font-Bricolage font-normal text-[14px]">
                    Istanbul, Turkey
                  </p>
                </div>
                <h3 className="font-semibold mt-2 text-[18px] font-Bricolage text-black">
                  Mercedes-Benz A 200 CDI
                </h3>
                <div className="">
                  <div className="mt-1 font-normal font-Bricolage text-[14px]">
                    <span className="text-[#7964D8]">4.5/5 Excellent</span> 48
                    Reviews
                  </div>
                  <div className="mt-1 text-[#7964D8] text-[24px] font-semibold font-Bricolage">
                    <span className="font-medium text-black text-[18px]">
                      From
                    </span>{" "}
                    $150.00
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Image */}
        {/* <Image
          src={left}
          alt="right shape"
          className="absolute right-0 top-1/2 transform -translate-y-1/2 w-20 sm:w-28 md:w-36 lg:w-48 -z-10 lg:flex hidden"
        /> */}
      </div>
      {/* <div>
                <button className='border bg-[#17B8CA] lg:px-5 px-20 py-2 rounded-lg text-white mt-10'>Explore More</button>
              </div> */}
    </div>
  );
}

export default Car2;
