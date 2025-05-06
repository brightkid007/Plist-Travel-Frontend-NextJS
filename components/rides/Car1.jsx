import React from "react";
import car1 from "/public/Images/Group 213.png";
import car2 from "/public/Images/Group 214.png";
import car3 from "/public/Images/Group 215.png";
import car4 from "/public/Images/Group 216.png";
import car5 from "/public/Images/Group 217.png";
import car6 from "/public/Images/Group 218.png";
import car7 from "/public/Images/Group 219.png";
import car8 from "/public/Images/Group 220.png";
import Image from "next/image";

function Car1() {
  return (
    <div className="lg:mt-24 mt-2">
      <div className="text-center lg:mb-20 mb-8">
        <p className="border border-[#054CA3] text-[#054CA3] text-center w-fit mx-auto rounded-full mt-16 text-sm sm:text-base font-Bricolage text-[18px] font-bold py-[10px] px-[12px]">
          Top Rides
        </p>
        <h1 className="text-xl sm:text-2xl md:text-[42px] font-medium text-[#141D2B] font-Bricolage text-center mt-4 w-full sm:w-[90%] md:w-[70%] lg:w-[50%] mx-auto">
          Select by Category
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 lg:px-20 lg:w-[80%] mx-auto">
        <div>
          <Image src={car1} alt="" className="w-full" />
        </div>
        <div>
          <Image src={car2} alt="" className="w-full" />
        </div>
        <div>
          <Image src={car3} alt="" className="w-full" />
        </div>
        <div>
          <Image src={car4} alt="" className="w-full" />
        </div>
        <div>
          <Image src={car5} alt="" className="w-full" />
        </div>
        <div>
          <Image src={car6} alt="" className="w-full" />
        </div>
        <div>
          <Image src={car7} alt="" className="w-full" />
        </div>
        <div>
          <Image src={car8} alt="" className="w-full" />
        </div>
      </div>
    </div>
  );
}

export default Car1;
