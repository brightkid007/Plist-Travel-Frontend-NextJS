import React from "react";
import right from "/public/Images/right-shape 2.png";
import left from "/public/Images/right-shape 1.png";
import card1 from "/public/Images/image (3).png"; // Sample card images
import card2 from "/public/Images/image (4).png";
import card3 from "/public/Images/image (5).png";
import card4 from "/public/Images/image (6).png";
import location from "/public/Images/location.svg";
import Image from "next/image";

function Fourth() {
  return (
    <div className="relative lg:mt-36 mt-12 flex flex-col items-center px-4">
      {/* Header */}
      <div className="text-center md:mb-12 mb-4">
        <p className="border border-blue-700 bg-gradient-to-r font-Ubuntu from-[#245BAA] to-[#0CA4C4] rounded-full text-white w-[60%] sm:w-[40%] md:w-[30%] mx-auto flex justify-center py-1 text-sm sm:text-base">
          Featured
        </p>
        <h1 className="text-3xl sm:text-5xl md:text-[42px] mt-4 font-medium text-[#141D2B] font-Bricolage">
          Rides
        </h1>
      </div>

      {/* Cards Section with Side Images */}
      <div className="relative flex items-center justify-center w-full">
        {/* Left Image */}
        {/* <Image
          src={right}
          alt="left shape"
          className="absolute left-0 top-1/2 transform -translate-y-1/2 w-20 sm:w-28 md:w-36 lg:w-48 -z-10 lg:flex hidden"
        /> */}

        {/* Cards */}
        <div className="flex justify-center md:gap-3 gap-7 z-10 md:px-20 px-4 flex-wrap lg:w-[80%] lg:mx-auto">
          {/* Card 1 */}
          {[card1, card2, card3, card4].map((image, index) => (
            <div
              key={index}
              className="bg-[#CDCDCD] shadow-lg overflow-hidden sm:w-[90%] w-full md:w-[24%] h-[360px]"
            >
              <Image
                src={image}
                alt={`Card ${index + 1}`}
                className="w-full h-[214px] object-cover"
              />
              <div className="p-3 bg-[#D9D9D966]">
                <div className="flex items-center space-x-2">
                  <Image src={location} alt="location" />
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
      <div>
        <button className="border font-Bricolage bg-gradient-to-r from-[#245BAA] to-[#0CA4C4] lg:px-5 px-20 py-2 rounded-lg text-white mt-10">
          Explore More
        </button>
      </div>
    </div>
  );
}

export default Fourth;
