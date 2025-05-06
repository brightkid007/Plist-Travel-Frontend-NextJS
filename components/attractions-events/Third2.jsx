import React from "react";
import right from "/public/Images/right-shape 2.png";
import left from "/public/Images/right-shape 1.png";
import card1 from "/public/Images/image (11).png"; // Sample card images
import card2 from "/public/Images/image (12).png";
import card3 from "/public/Images/image (13).png";
import card4 from "/public/Images/image (31).png";
import card5 from "/public/Images/image (32).png";
import card6 from "/public/Images/image (33).png";
import card7 from "/public/Images/image (34).png";
import card8 from "/public/Images/image (35).png";
import card9 from "/public/Images/image (36).png";
import fivestar from "/public/Images/fivestar.png";
import location from "/public/Images/location.svg";
import Image from "next/image";

function Sixth() {
  return (
    <div className="relative lg:mt-24 mt-10 flex flex-col items-center px-4 lg:w-[80%] lg:mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="border border-[#054CA3] text-[#054CA3] text-center w-fit mx-auto rounded-full mt-10 md:mt-16 text-sm sm:text-base font-Bricolage text-[18px] font-bold py-[10px] px-[12px]">
          Tours & Attractions
        </p>
        <h1 className="text-xl sm:text-2xl md:text-[42px] font-medium text-[#141D2B] font-Bricolage text-center mt-4 w-full sm:w-[90%] md:w-[70%] lg:w-auto mx-auto">
          Top Destination
        </h1>
      </div>

      {/* Cards Section with Side Images */}
      <div className="relative flex items-center justify-center w-full">
        {/* Left Image */}

        {/* Cards */}
        <div className="relative flex items-center justify-center w-full">
          {/* Left Image */}

          {/* Cards */}
          <div className="flex flex-wrap justify-center gap-6 z-10 mt-0">
            {/* Card 1 */}
            <div className=" overflow-hidden w-full sm:w-[300px] md:w-[416px]">
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
                <div className=" text-[#054CA3] text-[24px] font-normal font-Bricolage font-bold mt-1">
                  <span className="font-medium font-Bricolage text-[#1F2836] text-[16px]">
                    From
                  </span>{" "}
                  $150.00
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="  overflow-hidden w-full sm:w-[300px] md:w-[416px]">
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
            <div className="  overflow-hidden w-full sm:w-[300px] md:w-[416px]">
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

            {/* Card 3 */}
            <div className="  overflow-hidden w-full sm:w-[300px] md:w-[416px]">
              <Image
                src={card4}
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
            <div className="  overflow-hidden w-full sm:w-[300px] md:w-[416px]">
              <Image
                src={card5}
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
            <div className="  overflow-hidden w-full sm:w-[300px] md:w-[416px]">
              <Image
                src={card6}
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
            <div className="  overflow-hidden w-full sm:w-[300px] md:w-[416px]">
              <Image
                src={card7}
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
            <div className="  overflow-hidden w-full sm:w-[300px] md:w-[416px]">
              <Image
                src={card8}
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
            <div className="  overflow-hidden w-full sm:w-[300px] md:w-[416px]">
              <Image
                src={card9}
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
