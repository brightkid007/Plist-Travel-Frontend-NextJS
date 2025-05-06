import React from "react";
import right from "/public/Images/right-shape 2.png";
import left from "/public/Images/right-shape 1.png";
import card1 from "/public/Images/image 3 (1).png"; // Sample card images
import card2 from "/public/Images/image 4.png";
import card3 from "/public/Images/image (2).png";
import stars from "/public/Images/Rating.png";
import location from "/public/Images/location.svg";
import Image from "next/image";

function Third() {
  return (
    <div className="relative lg:mt-36 md:mt-10 mt-6 flex flex-col items-center px-4">
      {/* Header */}
      <div className="text-center md:mb-12 mb-4">
        <p className="border border-blue-700 bg-gradient-to-r font-Ubuntu from-[#245BAA] to-[#0CA4C4] rounded-full text-white w-[60%] sm:w-[40%] md:w-[30%] mx-auto flex justify-center py-1 text-sm sm:text-base">
          HOTEL ROOM
        </p>
        <h1 className="text-3xl sm:text-5xl md:text-[42px] mt-4 font-medium text-[#141D2B] font-Bricolage">
          Featured Destination
        </h1>
      </div>

      {/* Cards Section with Side Images */}
      <div className="relative flex items-center justify-center w-full">
        {/* Left Image */}
        {/* <Image
          src={right}
          alt="left shape"
          className="absolute left-0 top-1/2 transform -translate-y-1/2 w-20 sm:w-28 md:w-36 lg:w-48 -z-10"
        /> */}

        {/* Cards */}
        <div className="flex flex-wrap justify-center gap-6 z-10 lg:w-[85%] lg:mx-auto">
          {/* Card 1 */}
          <div className="bg-white shadow-lg rounded-[32px] overflow-hidden md:w-[70%] sm:w-[80%] lg:w-[26%] lg:h-[530px] xl:h-[510px]">
            <Image
              src={card1}
              alt="Card 1"
              className="w-full h-[240px] object-cover rounded-t-xl"
            />
            <div className="p-4 text-center lg:text-start w-full flex items-center lg:items-start justify-center flex-col lg:w-fit">
              <h2 className="text-[20px] font-medium font-Bricolage leading-[24px] mb-1">
                Alaska: Vintage Double Decker Bus Tour & Thames River
              </h2>
              <div className="flex items-center space-x-2 mt-3 mb-2">
                <Image src={location} alt="location" />
                {/* Updated Font Awesome Icon */}
                <p className="text-[#2D3B4E] text-[12px] font-normal font-Bricolage">
                  Beach near Clock Tower, California USA
                </p>
              </div>
              <h3 className="text-[18px] font-semibold text-[#141D2B] font-Bricolage mt-2">
                4.7/ 5 Excellent
              </h3>
              <div className="mt-1">
                <Image src={stars} alt="" />
              </div>
              <p className="mt-2">(02 Reviews)</p>
              <div className="flex mt-2 lg:flex-row flex-col justify-between w-full">
                <div className="mt-2 text-[16px] font-medium text-[#2D3B4E] font-Bricolage">
                  <span className="font-bold text-lg">$35.00/</span>person
                </div>
                <div>
                  <button className="border bg-[#E5E5E5] border-[#F6F4FA] hover:text-white cursor-pointer hover:bg-gradient-to-r from-[#245BAA] to-[#0CA4C4] px-5 py-2 rounded-lg text-[16px] font-medium text-[#245BAA] font-Bricolage">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white shadow-lg rounded-[32px] overflow-hidden md:w-[70%] sm:w-[80%] lg:w-[26%] lg:h-[530px] xl:h-[510px]">
            <Image
              src={card2}
              alt="Card 1"
              className="w-full h-[240px] object-cover rounded-t-xl"
            />
            <div className="p-4 text-center lg:text-start w-full flex items-center lg:items-start justify-center flex-col lg:w-fit">
              <h2 className="text-[20px] font-medium font-Bricolage leading-[24px] mb-1">
                Alaska: Vintage Double Decker Bus Tour & Thames River
              </h2>
              <div className="flex items-center space-x-2 mt-3 mb-2">
                <Image src={location} alt="location" />
                {/* Updated Font Awesome Icon */}
                <p className="text-[#2D3B4E] text-[12px] font-normal font-Bricolage">
                  Beach near Clock Tower, California USA
                </p>
              </div>
              <h3 className="text-[18px] font-semibold text-[#141D2B] font-Bricolage mt-2">
                4.7/ 5 Excellent
              </h3>
              <div className="mt-1">
                <Image src={stars} alt="" />
              </div>
              <p className="mt-2">(02 Reviews)</p>
              <div className="flex mt-2 lg:flex-row flex-col justify-between w-full">
                <div className="mt-2 text-[16px] font-medium text-[#2D3B4E] font-Bricolage">
                  <span className="font-bold text-lg">$35.00/</span>person
                </div>
                <div>
                  <button className="border bg-[#E5E5E5] border-[#F6F4FA] hover:text-white cursor-pointer hover:bg-gradient-to-r from-[#245BAA] to-[#0CA4C4] px-5 py-2 rounded-lg text-[16px] font-medium text-[#245BAA] font-Bricolage">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white shadow-lg rounded-[32px] overflow-hidden md:w-[70%] sm:w-[80%] lg:w-[26%] lg:h-[530px] xl:h-[510px]">
            <Image
              src={card3}
              alt="Card 1"
              className="w-full h-[240px] object-cover rounded-t-xl"
            />
            <div className="p-4 text-center lg:text-start w-full flex items-center lg:items-start justify-center flex-col lg:w-fit">
              <h2 className="text-[20px] font-medium font-Bricolage leading-[24px] mb-1">
                Alaska: Vintage Double Decker Bus Tour & Thames River
              </h2>
              <div className="flex items-center space-x-2 mt-3 mb-2">
                <Image src={location} alt="location" />
                {/* Updated Font Awesome Icon */}
                <p className="text-[#2D3B4E] text-[12px] font-normal font-Bricolage">
                  Beach near Clock Tower, California USA
                </p>
              </div>
              <h3 className="text-[18px] font-semibold text-[#141D2B] font-Bricolage mt-2">
                4.7/ 5 Excellent
              </h3>
              <div className="mt-1">
                <Image src={stars} alt="" />
              </div>
              <p className="mt-2">(02 Reviews)</p>
              <div className="flex mt-2 lg:flex-row flex-col justify-between w-full">
                <div className="mt-2 text-[16px] font-medium text-[#2D3B4E] font-Bricolage">
                  <span className="font-bold text-lg">$35.00/</span>person
                </div>
                <div>
                  <button className="border bg-[#E5E5E5] border-[#F6F4FA] hover:text-white cursor-pointer hover:bg-gradient-to-r from-[#245BAA] to-[#0CA4C4] px-5 py-2 rounded-lg text-[16px] font-medium text-[#245BAA] font-Bricolage">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Image */}
        {/* <Image
          src={left}
          alt="right shape"
          className="absolute right-0 top-1/2 transform -translate-y-1/2 w-20 sm:w-28 md:w-36 lg:w-48 -z-10"
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

export default Third;
