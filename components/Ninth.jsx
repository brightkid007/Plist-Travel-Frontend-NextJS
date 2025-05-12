import React from "react";
import image1 from "/public/Images/Group 254 (1).png";
import image2 from "/public/Images/Group 255.png";
import image3 from "/public/Images/Mask group.png";
import Image from "next/image";

function Ninth() {
  return (
    <div className="flex justify-center mt-14 lg:w-[75%] lg:mx-auto">
      <div className="lg:w-[90%] w-[95%] bg-[#EEFAFF] flex rounded-lg lg:flex-row flex-col">
        <div>
          <h1 className="lg:text-[42px] font-Bricolage text-[36px] lg:w-[70%] w-full lg:ms-14 ms-2 lg:mt-24 mt-5  text-[#245BAA] font-bold">
            Let’s make your next holiday amazing
          </h1>
          <div className="lg:mt-36 mt-20 lg:block hidden">
            <Image src={image3} alt="" />
          </div>
          <div className="lg:mt-36 mt-20 lg:hidden block">
            <Image src={image3} alt="" className="w-full" />
          </div>
        </div>
        <div className="flex mt-24 lg:flex-row flex-col ">
          <div>
            <Image src={image1} alt="" className="lg:block hidden" />
            <Image src={image1} alt="" className="lg:hidden block w-full" />
          </div>
          <div>
            <Image src={image2} alt="" className="lg:block hidden" />
            <Image src={image2} alt="" className="lg:hidden block w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ninth;
