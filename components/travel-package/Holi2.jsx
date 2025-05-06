import React from "react";
import bgImg from "/public/Images/Group-287.png";
import boob from "/public/Images/Frame (6).png";
import Image from "next/image";

function Holi2() {
  return (
    <div
      className="bg-cover bg-center bg-no-repeat lg:h-[613px] h-auto flex items-center justify-center text-white text-4xl font-bold md:mt-20 mt-12"
      style={{ backgroundImage: `url("/Images/Group-287.png")` }}
    >
      <div className="px-2 flex gap-5 items-center lg:flex-row flex-col-reverse">
        <div className="lg:w-[750px] lg:h-[691px] mt-0">
          <Image src={boob} alt="" className="w-full h-full" />
        </div>
        <div className="text-center mt-6 lg:mt-20">
          <h1 className="lg:text-[42px] text-[28px] font-bold font-Bricolage">
            Get Amazing Rates at Fight Booking Worldwide
          </h1>
          <p className="lg:text-[14px] text-[12px] font-normal font-Bricolage lg:w-[60%] w-[100%] lg:ms-40 ms-0 mt-3">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Urna,
            tortor tempus. Lorem ipsum dolor sit amet, consectetur
            tortoradipiscing elit. Urna, tortor tempus.{" "}
          </p>
          <button className="bg-[#7964D8] font-Bricolage text-sm px-5 py-2 rounded-md mt-5">
            Find Deals
          </button>
        </div>
      </div>
    </div>
  );
}

export default Holi2;
