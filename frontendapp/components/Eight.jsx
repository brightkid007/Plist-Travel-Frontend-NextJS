import React from "react";
// import man from "/public/Images/Group (1).png";

function Eight() {
  return (
    <div
      className="flex justify-center px-4 lg:mt-20 mt-0 bg-cover lg:h-[488px]"
      style={{ backgroundImage: "url(/Images/eight-BG.png)" }}
    >
      <div className="flex flex-col-reverse lg:flex-row justify-between items-center w-full max-w-6xl py-3">
        <div className="lg:w-[70%] w-full text-center items-center">
          <h1 className="text-white font-semibold text-[16px] sm:text-[20px] font-Bricolage sm:text-[32px] lg:text-[42px] text-center">
            We partner with travel agents across the globe, bringing new realms
            of luxury travel options to your clients
          </h1>
          <button className="font-Bricolage bg-gradient-to-r from-[#245BAA] to-[#0CA4C4] lg:px-2 px-5 py-2 rounded-lg text-white mt-10">
            Explore More
          </button>
        </div>
      </div>
    </div>
  );
}

export default Eight;
