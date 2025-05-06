import { useState } from "react";
import FaqsImage from "/public/Images/become-agent/faqsImage.png";
import Image from "next/image";

const faqData = [
  {
    question: "What services does Plist Travel provide?",
    answer:
      "We specialize in customized travel packages, hotel bookings, flight reservations, visa assistance, travel insurance, and guided tours — all under one roof.",
  },
  {
    question: "What services does Plist Travel provide?",
    answer:
      "We specialize in customized travel packages, hotel bookings, flight reservations, visa assistance, travel insurance, and guided tours — all under one roof.",
  },
  {
    question: "What services does Plist Travel provide?",
    answer:
      "We specialize in customized travel packages, hotel bookings, flight reservations, visa assistance, travel insurance, and guided tours — all under one roof.",
  },
  {
    question: "What services does Plist Travel provide?",
    answer:
      "We specialize in customized travel packages, hotel bookings, flight reservations, visa assistance, travel insurance, and guided tours — all under one roof.",
  },
  {
    question: "What services does Plist Travel provide?",
    answer:
      "We specialize in customized travel packages, hotel bookings, flight reservations, visa assistance, travel insurance, and guided tours — all under one roof.",
  },
  {
    question: "What services does Plist Travel provide?",
    answer:
      "We specialize in customized travel packages, hotel bookings, flight reservations, visa assistance, travel insurance, and guided tours — all under one roof.",
  },
];

const Faqs = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="xl:px-44 lg:px-16 px-6 lg:mt-24 md:mt-14 sm:mt-12 mt-7 flex flex-col items-center">
      <p className="xl:text-[72px] lg:text-[60px] sm:text-[52px] text-center text-[30px] font-medium lg:leading-[80px] sm:leading-[68px] leading-[40px] font-Bricolage text-black md:w-[90%] w-[96%]">
        Expand your travel offering with our inventory
      </p>
      <div className="grid lg:grid-cols-2 gap-6 items-start md:mt-16 sm:mt-12 mt-7 w-full">
        <div className="flex flex-col gap-5">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className={`rounded-[24px] px-[14px] transition-all duration-300 ${
                activeIndex === index
                  ? "bg-[#5627E2] text-white md:py-[33px] py-[20px]"
                  : "bg-white border border-[#5627E2] md:py-[18px] py-[12px]"
              }`}
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex justify-between items-center focus:outline-none"
              >
                <span
                  className={`font-semibold sm:text-[24px] text-[18px] font-Bricolage text-left ${
                    activeIndex === index ? "text-white" : "text-indigo-700"
                  }`}
                >
                  {faq.question}
                </span>
                <span
                  className={`${
                    activeIndex === index
                      ? "rotate-[360deg]"
                      : "rotate-[270deg]"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M15.9974 29.333C8.65073 29.333 2.66406 23.3463 2.66406 15.9997C2.66406 8.65301 8.65073 2.66634 15.9974 2.66634C23.3441 2.66634 29.3307 8.65301 29.3307 15.9997C29.3307 23.3463 23.3441 29.333 15.9974 29.333ZM21.4107 13.613C21.2107 13.413 20.9574 13.3197 20.7041 13.3197C20.4507 13.3197 20.1974 13.413 19.9974 13.613L15.9974 17.613L11.9974 13.613C11.6107 13.2263 10.9707 13.2263 10.5841 13.613C10.1974 13.9997 10.1974 14.6397 10.5841 15.0263L15.2907 19.733C15.6774 20.1197 16.3174 20.1197 16.7041 19.733L21.4107 15.0263C21.7974 14.6263 21.7974 13.9997 21.4107 13.613Z"
                      fill={`${
                        activeIndex === index
                          ? "white"
                          : "url(#paint0_linear_2004_240)"
                      }`}
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_2004_240"
                        x1="2.66406"
                        y1="15.9997"
                        x2="29.3307"
                        y2="15.9997"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#245BAA" />
                        <stop offset="1" stop-color="#633ED5" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </button>
              {activeIndex === index && (
                <div className="mt-2 text-[16px] font-normal font-Bricolage text-white">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="max-[767px]:h-[400px] max-[639px]:h-[300px] max-[1023px]:h-[500px] rounded-[24px]">
          <Image
            src={FaqsImage}
            alt="FaqsImage"
            className="w-full h-full lg:object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Faqs;
