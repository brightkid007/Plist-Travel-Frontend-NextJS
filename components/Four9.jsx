import React from "react";
import img12 from "/public/Images/Link (3).png";
import img13 from "/public/Images/Link (5).png";
import img14 from "/public/Images/Link (4).png";
import Image from "next/image";

function Four9() {
  return (
    <div className="px-4 sm:px-8 lg:px-32 md:mt-14 mt-6 lg:w-[85%] lg:mx-auto">
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

export default Four9;
