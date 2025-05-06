import React from "react";
import one from "/public/Images/image (14).png";
import two from "/public/Images/image (15).png";
import icon from "/public/Images/PT-iconlogo 1.png";
import property3 from "/public/Images/property3.png";
import property4 from "/public/Images/property4.png";
import property5 from "/public/Images/property5.png";
import three from "/public/Images/image (16).png";
import Image from "next/image";

function Seventh() {
  return (
    <div className="lg:px-28 px-2 py-20 lg:w-[83%] lg:mx-auto">
      {/* Header Section */}
      <div className="flex flex-col justify-center items-center text-center">
        <p className="border border-blue-700 bg-gradient-to-r font-Ubuntu from-[#245BAA] to-[#0CA4C4] rounded-full text-white w-fit px-3 mx-auto flex justify-center py-1 text-sm sm:text-base">
          CONVINENT BOOKING
        </p>
        <h1 className="text-3xl sm:text-5xl md:text-[42px] sm:w-[567px] w-[95%] text-center mt-4 font-medium text-[#141D2B] font-Bricolage">
          Connect your property with multiple channels
        </h1>
        <p className="lg:text-[16px] font-normal text-[14px] font-Bricolage text-[#2D3B4E] md:w-[606px] w-full mx-auto mt-5">
          Booking system allows for quick and convenient accommodation booking.
          The timetable is intuitive and user-friendly.
        </p>
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:mt-20 mt-12">
        {/* Image 1 */}
        <div>
          <Image src={one} alt="image1" className="w-full h-full rounded-xl" />
        </div>

        {/* Image 2 */}
        <div>
          <Image src={two} alt="image2" className="w-full h-full rounded-xl" />
        </div>

        {/* Card 1 */}
        <div className="border border-[#EEFAFF] bg-[#EEFAFF] px-5 py-10 rounded-3xl">
          <Image src={property3} alt="property3" />
        </div>

        {/* Card 2 */}
        <div className="border border-[#EEFAFF] bg-[#EEFAFF] px-5 py-10 rounded-3xl">
          <Image src={property4} alt="property4" />
        </div>

        {/* Gradient Card with Button */}
        <div className="border-gradient-to-r from-[#245BAA] to-[#0CA4C4] rounded-3xl text-black text-center">
          <Image src={property5} alt="property5" className="w-full h-full" />
        </div>

        {/* Image 3 */}
        <div>
          <Image
            src={three}
            alt="image3"
            className="w-full h-full rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}

export default Seventh;
