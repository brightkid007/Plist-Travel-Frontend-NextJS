import React from "react";
import image1 from "/public/Images/GroupOne.png";
// import image1 from "/public/Images/Group.png";
import image2 from "/public/Images/image.png";
import image3 from "/public/Images/image (1).png";
import image4 from "/public/Images/GroupFour.png";
import image5 from "/public/Images/GroupFive.png";
import GroupOnemini from "/public/Images/GroupOnemini.svg";
import GroupTwomini from "/public/Images/GroupTwomini.svg";
import GroupThreemini from "/public/Images/GroupThreemini.svg";
import GroupFourmini from "/public/Images/GroupFourmini.svg";
import GroupFivemini from "/public/Images/GroupFivemini.svg";
import badge from "/public/Images/Travel 14.png"; // small top-left icon
import Image from "next/image";

function Second() {
  const cards = [
    {
      image: image1,
      badge: GroupOnemini,
      textBg: "bg-[#F9F9F9]", // Gray background
      border: "border-blue-600",
      title: "Hotel Booking",
      description:
        "Book your ideal stay with access to thousands of hotels, from budget to luxury",
    },
    {
      image: image2,
      badge: GroupTwomini,
      textBg: "bg-[#F9F9F9]",
      border: "border-orange-400",
      title: "Tours & Attractions",
      description:
        "Discover exciting experiences curated to make your trip unforgettable",
    },
    {
      image: image3,
      badge: GroupThreemini,
      textBg: "bg-[#F9F9F9]",
      border: "border-cyan-400",
      title: "Flight Booking",
      description:
        "Find the perfect flights at unbeatable prices, with easy booking and flexible options.",
    },
    {
      image: image4,
      badge: GroupFourmini,
      textBg: "bg-[#F9F9F9]",
      border: "border-purple-500",
      title: "Channel Manager",
      description:
        "Manage bookings across platforms, keeping availability and rates up-to-date.",
    },
    {
      image: image5,
      badge: GroupFivemini,
      textBg: "bg-[#F9F9F9]",
      border: "border-gray-400",
      title: "Rides",
      description:
        "Choose from a wide range of rental cars which suit needs—drive in style wherever you!",
    },
  ];

  return (
    <div
      className="pl-4 lg:pl-20 py-10 bg-white lg:pt-28 bg-cover"
      // style={{ backgroundImage: "url(/Images/Section2-BG.png)" }}
    >
      <div className=" lg:w-[80%] lg:mx-auto">
        <p className="text-[16px] text-white font-bold mb-1 font-Bricolage border border-blue-700 py-[6px] px-[12px] w-fit text-center rounded-full bg-gradient-to-r from-[#245BAA] to-[#0CA4C4]">
          CATEGORY
        </p>
        <h2 className="text-2xl lg:text-[42px] font-medium font-Bricolage md:mb-12 mb-6">
          We Offer Best Services
        </h2>
      </div>

      <div className="flex lg:grid grid-cols-5 gap-6 overflow-x-auto pb-4 lg:overflow-x-visible lg:ml-[10%]">
        {/* <div>
            <Image src={graphic} alt='' className='w-[50%]'/>
        </div> */}
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`min-w-[306px] lg:min-w-0 lg:w-auto rounded-xl shadow-md overflow-hidden border-t-4 ${card.border} hover:shadow-lg transition duration-300`}
          >
            <div className="relative bg-white flex flex-col justify-end h-[350px]">
              {/* Badge icon — visible on all cards now */}
              <div className="absolute top-44 z-[2] w-full flex justify-center">
                <Image
                  src={card.badge}
                  alt="badge"
                  className="w-[56px] h-[56px]"
                />
              </div>

              {/* Main image */}
              <Image
                src={card.image}
                alt={`Card ${idx}`}
                className="w-full h-full object-cover"
              />

              {/* Text section */}
              <div
                className={`absolute bottom-2 left-2 right-2 p-4 text-center h-[140px] ${card.textBg} ${card.border} text-black rounded-xl`}
              >
                <h3 className="font-semibold text-[20px] mb-1 mt-5 font-Bricolage text-[#141D2B]">
                  {card.title}
                </h3>
                <p className="text-[14px] font-normal font-Bricolage text-[#2D3B4E]">
                  {card.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Second;
