import React from "react";
import img18 from "/public/Images/text.png";
import img19 from "/public/Images/Group-107-2.png"; // <-- Renamed
import Image from "next/image";

function Third4() {
  return (
    <div className="px-4 md:px-10 lg:px-32 py-10 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:mt-10 mt-5 lg:w-[80%] lg:mx-auto">
      {/* First Box */}
      <div
        style={{
          backgroundImage: `url("/Images/text.png")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="relative w-full sm:h-[390px] h-[280px] rounded-lg flex items-center justify-center"
      >
        <div className="relative z-10 text-white px-4">
          <h1 className="text-4xl md:text-[42px] font-Bricolage font-semibold sm:w-[70%] w-[90%]">
            The Best Cities to Travel Alone
          </h1>
          <button className="bg-white px-8 cursor-pointer py-4 rounded-md mt-20 text-[16px] font-medium font-Bricolage text-black">
            See Attractions
          </button>
        </div>
      </div>

      {/* Second Box */}
      <div
        style={{
          backgroundImage: `url("/Images/Group-107-2.png")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="relative w-full sm:h-[390px] h-[280px] rounded-lg flex items-center justify-center"
      >
        <div className="relative z-10 text-white px-4">
          <h1 className="text-4xl md:text-[42px] font-Bricolage font-semibold sm:w-[70%] w-[90%]">
            The Best Cities to Travel Alone
          </h1>
          <button className="bg-white px-8 cursor-pointer py-4 rounded-md mt-20 text-[16px] font-medium font-Bricolage text-black">
            See Attractions
          </button>
        </div>
      </div>
    </div>
  );
}

export default Third4;
