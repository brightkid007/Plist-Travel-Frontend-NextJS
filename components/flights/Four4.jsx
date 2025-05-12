import React from "react";
import bgImage from "/public/Images/Group-280.png";
import mann from "/public/Images/Frame (2).png";
import Image from "next/image";

function Four4() {
  return (
    <div
      className="lg:h-[524px] h-auto bg-cover bg-center flex items-center justify-center lg:mt-40 mt-20 flex-col-reverse lg:py-0 pt-12 lg:flex-row gap-8 lg:gap-36 px-4"
      style={{ backgroundImage: `url("/Images/Group-280.png")` }}
    >
      <div>
        <Image src={mann} alt="" className="lg:h-[629px] h-auto lg:-mt-28" />
      </div>
      <div className="bg-[#fff] rounded-2xl w-full h-[350px] sm:h-[400px] lg:w-[40%] md:h-[436px] text-center flex flex-col justify-center items-center px-4">
        <h1 className=" text-[28px] font-bold lg:text-[32px] xl:text-[42px] font-Bricolage mt-2 text-center lg:w-[90%] w-[100%] text-[#11161F]">
          Get Amazing Rates at Fight Booking Worldwide
        </h1>
        <h4 className="text-[#1F2836] lg:text-[12px] xl:text-[16px] font-normal font-Bricolage mt-4 lg:w-[86%]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Urna, tortor
          tempus. Lorem ipsum dolor sit amet, consectetur tortoradipiscing elit.
          Urna, tortor tempus.{" "}
        </h4>
        <button className="bg-[#17B8CA] text-[16px] font-semibold font-Bricolage px-[16px] py-[12px] rounded-[12px] mt-8 text-white">
          Find Deals
        </button>
      </div>
    </div>
  );
}

export default Four4;
