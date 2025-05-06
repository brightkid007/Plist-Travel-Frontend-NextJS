import React from "react";
import card1 from "/public/Images/image (38).png"; // Sample card images
import card2 from "/public/Images/image (39).png";
import card3 from "/public/Images/image (40).png";
import card4 from "/public/Images/image (41).png";
import card5 from "/public/Images/image (42).png";
import card6 from "/public/Images/image (43).png";
import stars from "/public/Images/Rating.png";
import location from "/public/Images/location.svg";
import Image from "next/image";

function Holi1() {
  return (
    <div className="relative lg:mt-20 mt-3 flex flex-col items-center px-4 lg:w-[70%] lg:mx-auto">
      {/* Header */}
      <div className="text-center lg:mb-12 mb-6">
        <p className="border border-[#054CA3] text-[#054CA3] text-center w-fit mx-auto rounded-full mt-16 text-sm sm:text-base font-Bricolage text-[18px] font-bold py-[10px] px-[12px]">
          Top Deals
        </p>
        <h1 className="text-xl sm:text-2xl md:text-[42px] font-medium text-[#141D2B] font-Bricolage text-center mt-4 w-full mx-auto">
          Featured Holiday Package
        </h1>
      </div>

      {/* Cards Section with Side Images */}
      <div className="relative flex items-center justify-center w-full">
        {/* Left Image */}

        {/* Cards */}
        <div className="flex flex-wrap lg:grid lg:grid-cols-3 lg:gap-12 justify-center w-full gap-6 z-10">
          {/* Card 1 */}
          <div className="border border-[#A9A9A9] md:w-auto w-full p-2 rounded-[18px]">
            <Image
              src={card1}
              alt="Card 1"
              className="w-full h-48 object-cover"
            />
            <div className="p-3 pb-2">
              <div className="flex justify-between mt-3">
                <div>
                  <Image src={stars} alt="" />
                </div>
                <div className="text-[12px] font-normal font-Bricolage text-[#000000]">
                  48 Reviews
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Image src={location} alt="location" />
                <p className="text-[#2D3B4E] font-Bricolage font-normal text-[14px]">
                  Istanbul, Turkey
                </p>
              </div>
              <h3 className="font-medium mt-2 text-[16px] font-Bricolage">
                Giverny and Versailles Small Group Day Trip
              </h3>
              <div className="flex justify-between items-center">
                <div className="font-medium mt-2 text-[16px] font-Bricolage text-[#054CA3]">
                  <span className="font-semibold text-black text-xs text-black">
                    From
                  </span>{" "}
                  $150.00
                </div>
                <div>
                  <button className="border bg-[#054CA3] px-5 h-[40px] text-[16px] font-medium font-Bricolage text-white rounded-[12px] mt-2">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className=" border border-black p-2 md:w-auto w-full rounded-md">
            <Image
              src={card2}
              alt="Card 1"
              className="w-full h-48 object-cover"
            />
            <div className="p-3 pb-2">
              <div className="flex justify-between mt-3">
                <div>
                  <Image src={stars} alt="" />
                </div>
                <div className="text-[12px] font-normal font-Bricolage text-[#000000]">
                  48 Reviews
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {/* Updated Font Awesome Icon */}
                <p className="text-gray-600 text-sm"> Istanbul, Turkey</p>
              </div>
              <h3 className="font-medium mt-2 text-[16px] font-Bricolage">
                Giverny and Versailles Small Group Day Trip
              </h3>
              <div className="flex justify-between items-center">
                <div className="font-medium mt-2 text-[16px] font-Bricolage text-[#054CA3]">
                  <span className="font-semibold text-black text-xs text-black">
                    From
                  </span>{" "}
                  $150.00
                </div>
                <div>
                  <button className="border bg-[#054CA3] px-5 h-[40px] text-[16px] font-medium font-Bricolage text-white rounded-[12px] mt-2">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className=" border border-black p-2 md:w-auto w-full rounded-md">
            <Image
              src={card3}
              alt="Card 1"
              className="w-full h-48 object-cover"
            />
            <div className="p-3 pb-2">
              <div className="flex justify-between mt-3">
                <div>
                  <Image src={stars} alt="" />
                </div>
                <div className="text-[12px] font-normal font-Bricolage text-[#000000]">
                  48 Reviews
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {/* Updated Font Awesome Icon */}
                <p className="text-gray-600 text-sm"> Istanbul, Turkey</p>
              </div>
              <h3 className="font-medium mt-2 text-[16px] font-Bricolage">
                Giverny and Versailles Small Group Day Trip
              </h3>
              <div className="flex justify-between items-center">
                <div className="font-medium mt-2 text-[16px] font-Bricolage text-[#054CA3]">
                  <span className="font-semibold text-black text-xs text-black">
                    From
                  </span>{" "}
                  $150.00
                </div>
                <div>
                  <button className="border bg-[#054CA3] px-5 h-[40px] text-[16px] font-medium font-Bricolage text-white rounded-[12px] mt-2">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className=" border border-black p-2 md:w-auto w-full rounded-md">
            <Image
              src={card4}
              alt="Card 1"
              className="w-full h-48 object-cover"
            />
            <div className="p-3 pb-2">
              <div className="flex justify-between mt-3">
                <div>
                  <Image src={stars} alt="" />
                </div>
                <div className="text-[12px] font-normal font-Bricolage text-[#000000]">
                  48 Reviews
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {/* Updated Font Awesome Icon */}
                <p className="text-gray-600 text-sm"> Istanbul, Turkey</p>
              </div>
              <h3 className="font-medium mt-2 text-[16px] font-Bricolage">
                Giverny and Versailles Small Group Day Trip
              </h3>
              <div className="flex justify-between items-center">
                <div className="font-medium mt-2 text-[16px] font-Bricolage text-[#054CA3]">
                  <span className="font-semibold text-black text-xs text-black">
                    From
                  </span>{" "}
                  $150.00
                </div>
                <div>
                  <button className="border bg-[#054CA3] px-5 h-[40px] text-[16px] font-medium font-Bricolage text-white rounded-[12px] mt-2">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className=" border border-black p-2 md:w-auto w-full rounded-md">
            <Image
              src={card5}
              alt="Card 1"
              className="w-full h-48 object-cover"
            />
            <div className="p-3 pb-2">
              <div className="flex justify-between mt-3">
                <div>
                  <Image src={stars} alt="" />
                </div>
                <div className="text-[12px] font-normal font-Bricolage text-[#000000]">
                  48 Reviews
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {/* Updated Font Awesome Icon */}
                <p className="text-gray-600 text-sm"> Istanbul, Turkey</p>
              </div>
              <h3 className="font-medium mt-2 text-[16px] font-Bricolage">
                Giverny and Versailles Small Group Day Trip
              </h3>
              <div className="flex justify-between items-center">
                <div className="font-medium mt-2 text-[16px] font-Bricolage text-[#054CA3]">
                  <span className="font-semibold text-black text-xs text-black">
                    From
                  </span>{" "}
                  $150.00
                </div>
                <div>
                  <button className="border bg-[#054CA3] px-5 h-[40px] text-[16px] font-medium font-Bricolage text-white rounded-[12px] mt-2">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className=" border border-black p-2 md:w-auto w-full rounded-md">
            <Image
              src={card6}
              alt="Card 1"
              className="w-full h-48 object-cover"
            />
            <div className="p-3 pb-2">
              <div className="flex justify-between mt-3">
                <div>
                  <Image src={stars} alt="" />
                </div>
                <div className="text-[12px] font-normal font-Bricolage text-[#000000]">
                  48 Reviews
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {/* Updated Font Awesome Icon */}
                <p className="text-gray-600 text-sm"> Istanbul, Turkey</p>
              </div>
              <h3 className="font-medium mt-2 text-[16px] font-Bricolage">
                Giverny and Versailles Small Group Day Trip
              </h3>
              <div className="flex justify-between items-center">
                <div className="font-medium mt-2 text-[16px] font-Bricolage text-[#054CA3]">
                  <span className="font-semibold text-black text-xs text-black">
                    From
                  </span>{" "}
                  $150.00
                </div>
                <div>
                  <button className="border bg-[#054CA3] px-5 h-[40px] text-[16px] font-medium font-Bricolage text-white rounded-[12px] mt-2">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Image */}
      </div>
    </div>
  );
}

export default Holi1;
