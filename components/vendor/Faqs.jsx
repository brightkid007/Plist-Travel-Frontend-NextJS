import { useState } from "react";
import arrowCircle from "/public/Images/become-vendor/arrow-circle-up.svg";
import Image from "next/image";

const faqData = [
  {
    question: "What services does Plist Travel provide?",
    answer:
      "We specialize in customized travel packages, hotel bookings, flight reservations, visa assistance, travel insurance, and guided tours — all under one roof.",
  },
  {
    question: "How can I book a trip with you?",
    answer:
      "You can book a trip by contacting us via our website, email, or phone. Our travel consultants will assist you through every step!",
  },
  {
    question: "Do you offer international tour packages?",
    answer:
      "Yes, we offer a variety of international tour packages tailored to your interests and budget.",
  },
  {
    question: "Can I customize my travel itinerary?",
    answer:
      "Absolutely! We specialize in creating personalized itineraries to match your unique travel preferences.",
  },
  {
    question: "What’s included in your travel packages?",
    answer:
      "Our packages typically include accommodation, transportation, guided tours, and travel insurance. Specific inclusions vary by package.",
  },
];

const Faqs = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="xl:px-72 lg:px-48 px-6 lg:mt-24 md:mt-14 sm:mt-12 mt-5">
      <h2 className="sm:text-[72px] text-[40px] max-[640px]:leading-[52px] font-bold font-Bricolage text-center sm:mb-12 mb-6">
        Frequently asked questions
      </h2>
      <div className="divide-y divide-[#245BAA] sm:mt-4 mt-1 border-t border-b border-[#245BAA]">
        {faqData.map((faq, index) => (
          <div key={index}>
            <button
              onClick={() => toggleFaq(index)}
              className="w-full flex justify-between items-center sm:pt-7 sm:pb-4 pt-5 pb-2 text-left focus:outline-none"
            >
              <span className="sm:text-[24px] text-[14px] font-semibold font-Bricolage text-transparent bg-clip-text bg-gradient-to-r from-[#245BAA] to-[#633ED5]">
                {faq.question}
              </span>
              <span className={`${activeIndex === index ? "rotate-180" : ""}`}>
                <Image src={arrowCircle} alt="arrow-circle-up" />
              </span>
            </button>
            {activeIndex === index && (
              <div className="sm:pt-2 sm:pb-7 pt-0 pb-4 text-[#000000] font-Bricolage sm:text-[20px] text-[16px] font-medium">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faqs;
