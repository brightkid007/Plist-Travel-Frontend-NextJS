import React from "react";
import fpic from "/public/Images/Group 272.png";
import fpic1 from "/public/Images/Group 273.png";
import fpic2 from "/public/Images/Group 274.png";
import fpic3 from "/public/Images/Group 272.png";
import fpic4 from "/public/Images/Group 275.png";
import fpic5 from "/public/Images/Group 276.png";
import fpic6 from "/public/Images/Group 278.png";
import fpic7 from "/public/Images/Group 279.png";
import Image from "next/image";

function Four1() {
  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24 lg:w-[80%] lg:mx-auto">
      <div>
        <p className="border border-[#054CA3] text-[#054CA3] text-center w-fit mx-auto rounded-full mt-16 text-sm sm:text-base font-Bricolage text-[18px] font-bold py-[10px] px-[12px]">
          Tours & Attractions
        </p>
        <h1 className="text-xl sm:text-2xl md:text-[42px] font-medium text-[#141D2B] font-Bricolage text-center mt-4 w-full sm:w-[90%] md:w-[70%] lg:w-[50%] mx-auto">
          Travel Deals
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        <div>
          <Image src={fpic} className="w-full" alt="deal 1" />
        </div>
        <div>
          <Image src={fpic1} className="w-full" alt="deal 2" />
        </div>
        <div>
          <Image src={fpic2} className="w-full" alt="deal 3" />
        </div>
        <div>
          <Image src={fpic3} className="w-full" alt="deal 4" />
        </div>
        <div>
          <Image src={fpic4} className="w-full" alt="deal 5" />
        </div>
        <div>
          <Image src={fpic5} className="w-full" alt="deal 6" />
        </div>
        <div>
          <Image src={fpic6} className="w-full" alt="deal 7" />
        </div>
        <div>
          <Image src={fpic7} className="w-full" alt="deal 8" />
        </div>
      </div>
    </div>
  );
}

export default Four1;
