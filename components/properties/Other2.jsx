import React from "react";

function Other2() {
  return (
    <div className="px-4 md:px-10 lg:px-28 py-10 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:mt-10 mt-5 lg:w-[80%] mx-auto lg:gap-16">
      {/* First Box */}
      <div
        style={{
          backgroundImage: `url("/Images/Group-108.png")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="relative w-full h-[300px] lg:h-[390px] rounded-[12px] flex items-center justify-center"
      >
        <div className="relative z-10  text-white px-4 md:w-[90%] w-[94%]">
          <h1 className="text-[12px] md:text-[14.65px] font-normal font-Bricolage text-white">
            Enjoy these cool staycation promotions in Singapore
          </h1>
          <p className="mt-2 text-[16px] md:text-[30px] font-bold font-Bricolage">
            Best staycation Deals
          </p>
          <button className=" bg-[#fff] px-6 pr-8 py-4 rounded-md mt-32 text-black font-Bricolage font-medium cursor-pointer">
            See Attractions
          </button>
        </div>
      </div>
      {/* Second Box */}
      <div
        style={{
          backgroundImage: `url("/Images/thirteen-2nd.png")`,
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
            All Time Favourite <br /> Attractions in Dubai
          </p>
          <button className=" bg-[#fff] px-6 pr-8 py-4 rounded-md mt-32 text-black font-Bricolage font-medium cursor-pointer">
            See Attractions
          </button>
        </div>
      </div>
    </div>
  );
}

export default Other2;
