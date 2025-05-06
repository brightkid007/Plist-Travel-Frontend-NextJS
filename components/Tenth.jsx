import React from "react";
import img from "/public/Images/Group-256.png";
import img1 from "/public/Images/image (17).png";
import img2 from "/public/Images/image (18).png";
import img3 from "/public/Images/image (19).png";
import Image from "next/image";

function Tenth() {
  return (
    <div
      style={{
        backgroundImage: `url("/Images/Group-256.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="relative w-[100%] mt-10 flex justify-center items-center"
    >
      <div className="lg:p-10 sm:p-5 px-2 py-5 mt-6 w-[95%] lg:w-[73%] lg:mx-auto">
        <div>
          <h3 className="border border-blue-700 bg-gradient-to-r font-Ubuntu from-[#245BAA] to-[#0CA4C4] rounded-full text-white w-fit px-3 flex justify-center py-1 text-sm sm:text-base">
            TOURS AND Attractions
          </h3>
          <h1 className="text-white lg:text-[42px] font-medium text-2xl mt-3 font-Bricolage">
            Provided multiple service in different area’s
          </h1>
          <p className="text-[16px] font-normal font-Bricolage text-white lg:w-[75%] w-full mt-1">
            Et labore harum non nobis ipsum eum molestias mollitia et corporis
            praesentium a laudantium internos. Non quis eius quo eligendi
            corrupti et fugiat nulla qui soluta recusandae in maxime quasi aut
            ducimus illum aut optio quibusdam!
          </p>
        </div>
        <div className="md:grid flex grid-cols-3 sm:gap-8 gap-5 sm:mt-10 mt-6 lg:flex-row flex-col">
          <div>
            <Image src={img1} alt="" className="w-full" />
          </div>
          <div>
            <Image src={img2} alt="" className="w-full" />
          </div>
          <div>
            <Image src={img3} alt="" className="w-full" />
          </div>
        </div>
        <button className="text-[#0CA4C4] border border-white font-Bricolage bg-white px-3 py-2 rounded-md sm:mt-10 mt-5">
          Explore More
        </button>
      </div>
    </div>
  );
}

export default Tenth;
