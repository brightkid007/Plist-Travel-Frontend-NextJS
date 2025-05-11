import React from "react";
import pic1 from "/public/Images/Group-159.png";
import pic2 from "/public/Images/Group 160.png";
import pic3 from "/public/Images/Group 161.png";
import pic4 from "/public/Images/Group 162.png";
import Image from "next/image";

function Other() {
  return (
    <div className="px-4 sm:px-10 lg:px-28 lg:w-[80%] lg:mx-auto">
      <div>
        <h4 className="border border-[#054CA3] text-[#054CA3] text-center w-fit mx-auto rounded-full mt-16 text-sm sm:text-base font-Bricolage text-[18px] font-bold py-[10px] px-[12px]">
          Popular Destinations
        </h4>
        <h1 className="text-xl sm:text-2xl md:text-[42px] font-medium text-[#141D2B] font-Bricolage text-center mt-4 w-full sm:w-[90%] md:w-[70%] lg:w-[50%] mx-auto">
          These popular destinations have a lot to offer
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:mt-14 mt-10">
        <div>
          <Image src={pic1} alt="Destination 1" className="w-full h-auto" />
        </div>
        <div>
          <Image src={pic2} alt="Destination 2" className="w-full h-auto" />
        </div>
        <div>
          <Image src={pic3} alt="Destination 3" className="w-full h-auto" />
        </div>
        <div>
          <Image src={pic4} alt="Destination 4" className="w-full h-auto" />
        </div>
      </div>
    </div>
  );
}

export default Other;
