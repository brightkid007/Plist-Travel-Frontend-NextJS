import React from "react";
import pic174 from "/public/Images/Group 174.png";
import pic175 from "/public/Images/Group 175.png";
import pic176 from "/public/Images/Group 176.png";
import pic264 from "/public/Images/Group 264.png";
import pic178 from "/public/Images/Group 178.png";
import pic179 from "/public/Images/Group 179.png";
import Image from "next/image";

function Third1() {
  return (
    <div className="lg:w-[80%] lg:mx-auto">
      <div>
        <h4 className="border border-[#054CA3] text-[#054CA3] text-center w-fit mx-auto rounded-full mt-10 md:mt-16 text-sm sm:text-base font-Bricolage text-[18px] font-bold py-[10px] px-[12px]">
          Tours & Attractions
        </h4>
        <h1 className="text-xl sm:text-2xl md:text-[42px] font-medium text-[#141D2B] font-Bricolage text-center mt-4 w-full sm:w-[90%] md:w-[70%] lg:w-[50%] mx-auto">
          Top Destination
        </h1>
      </div>

      <div className="xl:px-32 lg:px-12 px-3 mt-8">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-5 lg:flex-row flex-col">
          <div>
            <Image src={pic174} alt="" className="w-full" />
          </div>
          <div>
            <Image src={pic175} alt="" className="w-full" />
          </div>
        </div>

        <div className="grid md:grid-cols-4 grid-cols-2 gap-5 lg:flex-row flex-col mt-5">
          <div>
            <Image src={pic176} alt="" className="w-full" />
          </div>
          <div>
            <Image src={pic264} alt="" className="w-full" />
          </div>
          <div>
            <Image src={pic178} alt="" className="w-full" />
          </div>
          <div>
            <Image src={pic179} alt="" className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Third1;
