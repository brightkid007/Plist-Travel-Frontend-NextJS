import React from "react";
import flogo from "/public/Images/image 956.png";
import flogo1 from "/public/Images/image 957.png";
import flogo2 from "/public/Images/image 958.png";
import flogo3 from "/public/Images/image 959.png";
import Image from "next/image";

function Four3() {
  return (
    <div className="px-10 sm:px-8 md:px-16 lg:px-24 lg:mt-32 mt-16 lg:w-[70%] lg:mx-auto">
      <div>
        <p className="border border-[#17B8CA] text-[#17B8CA] text-center w-fit mx-auto rounded-full mt-16 text-sm sm:text-base font-Bricolage text-[18px] font-bold py-[10px] px-[12px]">
          Top Deals
        </p>
        <h1 className="text-xl sm:text-2xl md:text-[42px] font-medium text-[#141D2B] font-Bricolage text-center mt-4 w-full mx-auto">
          Featured Flight Deals
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        <div>
          <Image src={flogo} className="w-full" alt="Flight deal 1" />
        </div>
        <div>
          <Image src={flogo1} className="w-full" alt="Flight deal 2" />
        </div>
        <div>
          <Image src={flogo2} className="w-full" alt="Flight deal 3" />
        </div>
        <div>
          <Image src={flogo3} className="w-full" alt="Flight deal 4" />
        </div>
      </div>
    </div>
  );
}

export default Four3;
