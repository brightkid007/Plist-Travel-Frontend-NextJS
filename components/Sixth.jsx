import React from "react";
import right from "/public/Images/right-shape 2.png";
import left from "/public/Images/right-shape 1.png";
import card1 from "/public/Images/image (11).png"; // Sample card images
import card2 from "/public/Images/image (12).png";
import card3 from "/public/Images/image (13).png";
import fivestar from "/public/Images/fivestar.png";
import location from "/public/Images/location.svg";
import Image from "next/image";

function Sixth() {
  return (
    <div className="relative lg:mt-36 mt-12 flex flex-col items-center px-4 lg:w-[80%] lg:mx-auto">
      {/* Header */}
      <div className="text-center md:mb-12 mb-4">
        <p className="border border-blue-700 bg-gradient-to-r font-Ubuntu from-[#245BAA] to-[#0CA4C4] rounded-full text-white w-[60%] sm:w-[40%] md:w-[30%] mx-auto flex justify-center py-1 text-sm sm:text-base">
          Featured
        </p>
        <h1 className="text-3xl sm:text-5xl md:text-[42px] mt-4 font-medium text-[#141D2B] font-Bricolage">
          Top DealsTravel Package
        </h1>
      </div>

      {/* Cards Section with Side Images */}
      <div className="relative flex items-center justify-center w-full">
        {/* Left Image */}

        {/* Cards */}
        <div className="flex flex-wrap justify-center gap-6 z-10 mt-6">
          {/* Card 1 */}
          <div className=" overflow-hidden w-full sm:w-[300px] md:w-[27.5%]">
            <Image
              src={card1}
              alt="Card 1"
              className="w-full h-[310px] object-cover"
            />
            <div className="px-1">
              <div className="flex justify-between mt-3">
                <div>
                  <Image src={fivestar} alt="fivestar" />
                </div>
                <div className="text-[12px] font-normal font-Bricolage text-black">
                  48 Reviews
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {/* Updated Font Awesome Icon */}
                <p className="text-[#2D3B4E] font-Bricolage font-normal text-[12px] flex items-center gap-1.5 mt-3">
                  {" "}
                  <Image src={location} alt="location" />
                  Istanbul, Turkey
                </p>
              </div>
              <h3 className="font-medium font-Bricolage mt-1 text-[16px]">
                Giverny and Versailles Small Group Day Trip
              </h3>
              <div className=" text-[#054CA3] text-[24px] font-Bricolage font-bold mt-1">
                <span className="font-medium font-Bricolage text-[#1F2836] text-[16px]">
                  From
                </span>{" "}
                $150.00
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="  overflow-hidden w-full sm:w-[300px] md:w-[27.5%]">
            <Image
              src={card2}
              alt="Card 1"
              className="w-full h-[310px] object-cover"
            />
            <div className="px-1">
              <div className="flex justify-between mt-3">
                <div>
                  <Image src={fivestar} alt="" />
                </div>
                <div className="text-[12px] font-normal font-Bricolage text-black">
                  48 Reviews
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {/* Updated Font Awesome Icon */}
                <p className="text-[#2D3B4E] font-Bricolage font-normal text-[12px] flex items-center gap-1.5 mt-3">
                  {" "}
                  <Image src={location} alt="location" />
                  Istanbul, Turkey
                </p>
              </div>
              <h3 className="font-medium font-Bricolage mt-1 text-[16px]">
                Giverny and Versailles Small Group Day Trip
              </h3>
              <div className=" text-[#054CA3] text-[24px] font-normal font-Bricolage font-bold mt-1">
                <span className="font-medium font-Bricolage text-[#1F2836] text-[16px]">
                  From
                </span>{" "}
                $150.00
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="  overflow-hidden w-full sm:w-[300px] md:w-[27.5%]">
            <Image
              src={card3}
              alt="Card 1"
              className="w-full h-[310px] object-cover"
            />
            <div className="px-1">
              <div className="flex justify-between mt-3">
                <div>
                  <Image src={fivestar} alt="" />
                </div>
                <div className="text-[12px] font-normal font-Bricolage text-black">
                  48 Reviews
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {/* Updated Font Awesome Icon */}
                <p className="text-[#2D3B4E] font-Bricolage font-normal text-[12px] flex items-center gap-1.5 mt-3">
                  {" "}
                  <Image src={location} alt="location" />
                  Istanbul, Turkey
                </p>
              </div>
              <h3 className="font-medium font-Bricolage mt-1 text-[16px]">
                Giverny and Versailles Small Group Day Trip
              </h3>
              <div className=" text-[#054CA3] text-[24px] font-normal font-Bricolage font-bold mt-1">
                <span className="font-medium font-Bricolage text-[#1F2836] text-[16px]">
                  From
                </span>{" "}
                $150.00
              </div>
            </div>
          </div>
        </div>

        {/* Right Image */}
      </div>
      <div>
        <button className="border font-Bricolage bg-gradient-to-r from-[#245BAA] to-[#0CA4C4] lg:px-5 px-20 py-2 rounded-lg text-white mt-10">
          Explore More
        </button>
      </div>
    </div>
  );
}

export default Sixth;
