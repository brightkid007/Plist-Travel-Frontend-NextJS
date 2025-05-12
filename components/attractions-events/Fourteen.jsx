import React from "react";
import img9 from "/public/Images/Link (1).png";
import img10 from "/public/Images/Link (2).png";
import img11 from "/public/Images/Link.png";
import Image from "next/image";

function Fourteen() {
  return (
    <div className="px-4 sm:px-8 lg:px-32 md:mt-14 mt-6 lg:w-[85%] lg:mx-auto">
      {/* Top Heading */}
      <div>
        <p className="border border-blue-700 bg-gradient-to-r from-[#245BAA] to-[#0CA4C4] rounded-full text-white w-fit px-3 flex justify-center font-Bricolage py-1 text-sm sm:text-base">
          Lorem ipsum
        </p>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-Bricolage font-bold w-full lg:w-[50%] md:mt-5 mt-3">
          Travel Blogs
        </h1>
      </div>

      {/* Blog Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:mt-10 mt-6">
        <div>
          <Image src={img9} alt="Blog 1" className="w-full rounded-md" />
          <p className="text-[13.45px] font-normal font-Bricolage text-[#2D3B4E] mt-5">
            April 06 2023 | By Ali Tufan
          </p>
          <h3 className="text-[17.3px] text-[#141D2B] font-Bricolage font-semibold mt-2">
            Kenya vs Tanzania Safari: The Better African Safari Experience
          </h3>
        </div>

        <div>
          <Image src={img10} alt="Blog 2" className="w-full rounded-md" />
          <p className="text-[13.45px] font-normal font-Bricolage text-[#2D3B4E] mt-5">
            April 06 2023 | By Ali Tufan
          </p>
          <h3 className="text-[17.3px] text-[#141D2B] font-Bricolage font-semibold mt-2">
            Kenya vs Tanzania Safari: The Better African Safari Experience
          </h3>
        </div>

        <div>
          <Image src={img11} alt="Blog 3" className="w-full rounded-md" />
          <p className="text-[13.45px] font-normal font-Bricolage text-[#2D3B4E] mt-5">
            April 06 2023 | By Ali Tufan
          </p>
          <h3 className="text-[17.3px] text-[#141D2B] font-Bricolage font-semibold mt-2">
            Kenya vs Tanzania Safari: The Better African Safari Experience
          </h3>
        </div>
      </div>
    </div>
  );
}

export default Fourteen;
