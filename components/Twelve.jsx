import React from "react";
import twelveMan from "/public/Images/twelve-man.svg";
import Image from "next/image";

function Twelve() {
  return (
    <>
      <div
        className="lg:h-[468px] lg:mt-64 mt-16 md:p-10 p-5 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url("/Images/twelve-BG.png")` }}
      >
        <div className="flex justify-between lg:flex-row flex-col lg:w-[80%] lg:mx-auto">
          <div className="lg:ms-32 ms-0 lg:w-[60%] xl:w-[50%]">
            <h3 className="border border-blue-700 bg-gradient-to-r from-[#245BAA] to-[#0CA4C4] rounded-full text-white h-[36px] w-[160px] flex justify-center items-center text-center">
              Become a vendor
            </h3>
            <h1 className="lg:text-[42px] font-medium font-Bricolage text-2xl text-white md:mt-5 mt-3">
              Open Your Network
            </h1>
            <p className="md:text-[16px] text-[14px] font-normal text-white lg:w-[70%] w-full md:mt-4 mt-2">
              Et labore harum non nobis ipsum eum molestias mollitia et corporis
              praesentium a laudantium internos. Non quis eius quo eligendi
              corrupti et fugiat nulla qui soluta recusandae in maxime quasi aut
              ducimus illum aut optio quibusdam!
            </p>
            <button className="text-[#0CA4C4] font-medium cursor-pointer font-Bricolage border border-white bg-white px-3 py-2 rounded-md md:mt-5 mt-4">
              Explore More
            </button>
          </div>

          <div className="lg:w-[75%] w-full lg:mt-0 mt-8 lg:absolute flex lg:justify-end justify-center">
            <Image src={twelveMan} alt="" className="lg:-mt-52" />
          </div>
        </div>
      </div>
    </>
  );
}

export default Twelve;
