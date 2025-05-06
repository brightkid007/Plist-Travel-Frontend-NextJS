import React from "react";
import bgImage from "/public/Images/Group-260.png";
import mann from "/public/Images/Group (2).png";
import Image from "next/image";

function Other3() {
  return (
    <div
      className="lg:h-[524px] h-auto bg-cover bg-center flex items-center justify-center lg:mt-40 mt-20 flex-col-reverse lg:py-0 py-12 lg:flex-row gap-8 px-4"
      style={{ backgroundImage: `url("/Images/Group-260.png")` }}
    >
      <div>
        <Image src={mann} alt="" className="lg:h-[629px] h-auto lg:-mt-28" />
      </div>
      <div className="other3-BG w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[496px] lg:h-[496px] rounded-full text-center flex flex-col justify-center items-center px-4">
        <h4 className="text-white text-[16px] md:text-[24px] font-bold font-Bricolage">
          Happy Holiday
        </h4>
        <h1 className="text-white text-[24px] md:text-[42px] font-bold font-Bricolage mt-6 md:leading-[56px] leading-[40px] text-center">
          Get Amazing Rates at Hotels Worldwide
        </h1>
      </div>
    </div>
  );
}

export default Other3;
