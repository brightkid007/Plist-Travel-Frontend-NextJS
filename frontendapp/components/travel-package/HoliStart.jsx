import React from "react";
import Image from "next/image";
import image9691st from "/public/Images/image-969(1).png";
import image9692nd from "/public/Images/image-969(2).png";
import image9693rd from "/public/Images/image-969(3).png";
import location from "/public/Images/location.svg";

const HoliStart = () => {
  return (
    <div className="px-10 sm:px-8 md:px-16 lg:px-24 lg:mt-32 mt-16 lg:w-[80%] lg:mx-auto">
      <div>
        <p className="border border-[#054CA3] text-[#054CA3] text-center w-fit mx-auto rounded-full mt-16 text-sm sm:text-base font-Bricolage text-[18px] font-bold py-[10px] px-[12px]">
          Holiday Packages
        </p>
        <h1 className="text-xl sm:text-2xl md:text-[42px] font-medium text-[#141D2B] font-Bricolage text-center mt-4 w-full mx-auto">
          Most Popular
        </h1>
      </div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 lg:mt-16 mt-8 text-center lg:text-start">
        <div className="w-full flex items-center justify-center flex-col mb-3 lg:mb-0 lg:items-start">
          <Image
            src={image9691st}
            alt="image9691st"
            className="w-full flex items-center justify-center"
          />
          <p className="text-[16px] font-medium font-Bricolage text-[#054CA3] mt-5">
            Island's of the sea
          </p>
          <div className="flex items-center space-x-2 mt-2">
            <Image src={location} alt="location" />
            <p className="text-[#2D3B4E] font-Bricolage font-normal text-[14px]">
              Istanbul, Turkey
            </p>
          </div>
        </div>
        <div className="w-full flex items-center justify-center flex-col mb-3 lg:mb-0 lg:items-start">
          <Image src={image9692nd} alt="image9692nd" className="w-full" />
          <p className="text-[16px] font-medium font-Bricolage text-[#054CA3] mt-5">
            Island's of the sea
          </p>
          <div className="flex items-center space-x-2 mt-2">
            <Image src={location} alt="location" />
            <p className="text-[#2D3B4E] font-Bricolage font-normal text-[14px]">
              Istanbul, Turkey
            </p>
          </div>
        </div>
        <div className="w-full flex items-center justify-center flex-col mb-3 lg:mb-0 lg:items-start">
          <Image src={image9693rd} alt="image9693rd" className="w-full" />
          <p className="text-[16px] font-medium font-Bricolage text-[#054CA3] mt-5">
            Island's of the sea
          </p>
          <div className="flex items-center space-x-2 mt-2">
            <Image src={location} alt="location" />
            <p className="text-[#2D3B4E] font-Bricolage font-normal text-[14px]">
              Istanbul, Turkey
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoliStart;
