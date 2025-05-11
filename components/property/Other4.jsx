import React from "react";
import go from "/public/Images/Group 261.png";
import Image from "next/image";
import colorSquare from "/public/Images/colors-square.svg";

function Other4() {
  return (
    <div className="lg:w-[70%] mx-auto">
      <div>
        <h4 className="border border-[#054CA3] text-[#054CA3] text-center w-fit mx-auto rounded-full mt-16 text-sm sm:text-base font-Bricolage text-[18px] font-bold py-[10px] px-[12px]">
          CONVINENT BOOKING
        </h4>
        <h1 className="text-xl sm:text-2xl md:text-[42px] font-medium text-[#141D2B] font-Bricolage text-center mt-4 w-full sm:w-[90%] md:w-[70%] lg:w-[50%] mx-auto">
          Connect your property with multiple channels
        </h1>
      </div>

      <div className="flex md:gap-10 gap-5 lg:justify-center ms-0 mt-10 lg:flex-row flex-col lg:px-0 px-3">
        <div className="lg:w-[50%] lg:mx-auto">
          <Image src={go} alt="" className="h-full max-[1024px]:w-full" />
        </div>
        <div className="flex flex-col gap-6 w-full lg:w-[80%] xl:w-full">
          <div className="bg-[#DAECF0] h-[244px] lg:w-[80%] xl:w-[100%] px-9 py-7 w-full rounded-xl">
            <div className="flex flex-col">
              <Image src={colorSquare} alt="colorSquare" />
              <h1 className="text-[24px] font-medium text-[#11161F] font-Bricolage mt-2">
                Ease of use
              </h1>
            </div>
            <p className="text-[14px] font-normal text-[#1F2836] font-Bricolage mt-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Urna,
              tortor tempus. Lorem ipsum dolor sit amet, consectetur
              tortoradipiscing elit. Urna, tortor tempus.{" "}
            </p>
          </div>
          <div className="bg-[#DAECF0] lg:w-[80%] xl:w-[100%] h-[244px] w-[100%] px-9 py-7 rounded-xl">
            <div className="flex flex-col">
              <Image src={colorSquare} alt="colorSquare" />
              <h1 className="text-[24px] font-medium text-[#11161F] font-Bricolage mt-2">
                Devices synchronization
              </h1>
            </div>
            <p className="text-[14px] font-normal text-[#1F2836] font-Bricolage mt-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Urna,
              tortor tempus. Lorem ipsum dolor sit amet, consectetur
              tortoradipiscing elit. Urna, tortor tempus.{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Other4;
