import React from "react";
import img12 from "/public/Images/Link (3).png";
import img13 from "/public/Images/Link (5).png";
import img14 from "/public/Images/Link (4).png";
import Image from "next/image";

function Other7() {
  return (
    <div className="px-4 sm:px-8 lg:px-32 md:mt-14 mt-6 lg:w-[83%] lg:mx-auto">
      {/* Top Heading */}
      <div>
        <h4 className="border border-[#054CA3] text-[#054CA3] text-start w-fit rounded-full text-sm sm:text-base font-Bricolage text-[18px] font-bold py-[10px] px-[12px]">
          Have a question?
        </h4>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-Bricolage font-bold w-full lg:w-[50%] md:mt-5 mt-3">
          Travel Blogs
        </h1>
      </div>

      {/* Blog Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:mt-10 mt-6">
        <div>
          <Image src={img12} alt="Blog 1" className="w-full rounded-md" />
          <p className="text-[13.45px] font-normal font-Bricolage text-[#2D3B4E] mt-5">
            April 06 2023 | By Ali Tufan
          </p>
          <h3 className="text-[17.3px] text-[#141D2B] font-Bricolage font-semibold mt-2">
            Kenya vs Tanzania Safari: The Better African Safari Experience
          </h3>
        </div>

        <div>
          <Image src={img13} alt="Blog 2" className="w-full rounded-md" />
          <p className="text-[13.45px] font-normal font-Bricolage text-[#2D3B4E] mt-5">
            April 06 2023 | By Ali Tufan
          </p>
          <h3 className="text-[17.3px] text-[#141D2B] font-Bricolage font-semibold mt-2">
            Kenya vs Tanzania Safari: The Better African Safari Experience
          </h3>
        </div>

        <div>
          <Image src={img14} alt="Blog 3" className="w-full rounded-md" />
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

export default Other7;
