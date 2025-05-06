import React from "react";

function Holi3() {
  return (
    <div className="px-4 md:px-10 lg:px-32 py-10 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:mt-24 mt-5 lg:w-[83%] lg:mx-auto">
      {/* First Box */}
      <div
        style={{
          backgroundImage: `url("/Images/imageHoliday.png")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="relative w-full h-[300px] lg:h-[390px] rounded-[12px] flex items-center justify-center"
      >
        <div className="relative z-10  text-white px-4 md:w-[90%] w-[94%]">
          <h1 className="text-[24px] md:text-[42px] font-normal font-Bricolage text-white">
            News & views from Havezic
          </h1>
          <button className=" bg-[#fff] px-6 pr-8 py-4 rounded-md mt-32 text-black font-Bricolage font-medium cursor-pointer">
            See Attractions
          </button>
        </div>
      </div>
      {/* Second Box */}
      <div
        style={{
          backgroundImage: `url("/Images/imageHoliday(1).png")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="relative w-full h-[300px] lg:h-[390px] rounded-[12px] flex items-center justify-center"
      >
        <div className="relative z-10  text-white px-4 md:w-[90%] w-[94%]">
          <h1 className="text-[12px] md:text-[14.65px] font-normal font-Bricolage text-white">
            Don't forget to check out these Attractions while you're here
          </h1>
          <p className="mt-2 text-[16px] md:text-[30px] font-bold font-Bricolage">
            All Time Favourite Attractions in Dubai
          </p>
          <button className=" bg-[#fff] px-6 pr-8 py-4 rounded-md mt-32 text-black font-Bricolage font-medium cursor-pointer">
            See Attractions
          </button>
        </div>
      </div>
    </div>
  );
}

export default Holi3;
