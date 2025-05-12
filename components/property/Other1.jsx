import React from "react";
import pic24 from "/public/Images/image (24).png";
import pic25 from "/public/Images/image (25).png";
import pic26 from "/public/Images/image (26).png";
import pic27 from "/public/Images/image (27).png";
import pic28 from "/public/Images/image (28).png";
import pic29 from "/public/Images/image (29).png";
import rate from "/public/Images/Rating.png";
import location from "/public/Images/location.svg";
import Image from "next/image";

function Other1() {
  // Array of hotel card data
  const cards = [
    { img: pic24, title: "Staycity Aparthotels Deptford Bridge Station" },
    { img: pic25, title: "Staycity Aparthotels Deptford Bridge Station" },
    { img: pic26, title: "Staycity Aparthotels Deptford Bridge Station" },
    { img: pic27, title: "Staycity Aparthotels Deptford Bridge Station" },
    { img: pic28, title: "Staycity Aparthotels Deptford Bridge Station" },
    { img: pic29, title: "Staycity Aparthotels Deptford Bridge Station" },
    { img: pic24, title: "Staycity Aparthotels Deptford Bridge Station" },
    { img: pic25, title: "Staycity Aparthotels Deptford Bridge Station" },
  ];

  return (
    <div className="bg-[#E6ECEE] pt-3 mt-20 pb-10">
      <div>
        <h4 className="border border-[#054CA3] text-[#054CA3] text-center w-fit mx-auto rounded-full md:mt-16 mt-8 text-sm sm:text-base font-Bricolage text-[18px] font-bold py-[10px] px-[12px] bg-white">
          Top Hotels in World
        </h4>
        <h1 className="text-xl sm:text-2xl md:text-[42px] font-medium text-[#141D2B] font-Bricolage text-center mt-4 w-full sm:w-[90%] md:w-[70%] lg:w-[50%] mx-auto">
          Popular Hotels
        </h1>
        <div className="flex gap-3 justify-center md:mt-0 mt-8 flex-wrap">
          {["New York", "London", "Paris", "Sydney"].map((city, idx) => (
            <div key={idx}>
              <h4
                className={`border border-[#054CA3] text-[#054CA3] text-center w-fit mx-auto rounded-full mt-0 md:mt-16 text-sm sm:text-base font-Bricolage text-[16px] font-bold py-[10px] px-[16px] ${
                  idx === 0 ? "bg-[#054CA3] text-white" : "bg-white text-black"
                }`}
              >
                {city}
              </h4>
            </div>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-32 gap-x-8 px-4 mt-4 lg:w-[70%] mx-auto">
        {cards.map((card, index) => (
          <div key={index} className="relative w-full mt-14 h-auto">
            <Image
              src={card.img}
              alt={`Hotel ${index + 1}`}
              className="w-full h-auto rounded-xl lg:h-[300px] object-cover"
            />

            <div className="absolute -bottom-36 left-1/2 -translate-x-1/2 bg-white rounded-3xl p-4 shadow-lg w-[100%] h-[204px] lg:h-[250px] mt-8">
              <Image src={rate} alt="Rating" className="mb-2" />
              <div className="border-b border-dashed"></div>
              <div className="flex items-center gap-1 my-2 mt-4">
                <Image src={location} alt="location" />
                <p className="text-[12px] font-normal text-[#2D3B4E] font-Bricolage">
                  Beach near Clock Tower
                </p>
              </div>
              <h1 className="font-medium font-Bricolage text-[#141D2B] text-[16px]">
                {card.title}
              </h1>
              <p className="text-[18px] font-medium text-[#5C697E] font-Bricolage mt-6">
                From{" "}
                <span className="text-[#054CA3] font-semibold text-[25px]">
                  $104.30
                </span>{" "}
                <span className="line-through text-gray-500">$149.00</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-52">
        <button className="bg-[#054CA3] cursor-pointer text-white px-6 py-2 rounded-lg hover:bg-[#033f88] transition-all duration-300">
          View All
        </button>
      </div>
    </div>
  );
}

export default Other1;
