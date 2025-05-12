import React, { useState } from "react";
import Image from "next/image";
import faqImage from "/public/Images/other5-Bg.png";
import { ArrowLeft, ArrowUpRight, ChevronRight, ChevronUp } from "lucide-react";

const faqData = [
  {
    question: "Can I Store My Luggage Somewhere?",
    answer:
      "Stasher has locations worldwide where you can store your luggage while you explore the city. Exclusive to Havezic customers, bookings can be made online here, and use the coupon code Havezic for 10% off.",
  },
  {
    question: "How will I receive my payment?",
    answer:
      "Payments are processed online and sent directly to your provided bank account or digital wallet within 5 business days.",
  },
  {
    question: "Should I print a receipt to show the tour guide?",
    answer:
      "You don’t need to print a receipt; just show your digital confirmation email to the tour guide at check-in.",
  },
  {
    question: "How much does it cost to do a private tour?",
    answer:
      "Private tour costs vary by location and duration. Prices start around $100 and can go up depending on the experience.",
  },
];

function Four7() {
  const [activeIndex, setActiveIndex] = useState(0); // initially open the first

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="flex justify-center lg:mt-28 mt-14 lg:px-0 px-2 lg:w-[87%] mx-auto">
      <div className="lg:w-[80%] w-full flex justify-between lg:flex-row flex-col">
        {/* Left FAQ Section */}
        <div className="w-full lg:w-[55%]">
          <h4 className="border border-[#054CA3] text-[#054CA3] text-start w-fit rounded-full text-sm sm:text-base font-Bricolage text-[18px] font-bold py-[10px] px-[12px]">
            Have a question?
          </h4>
          <h1 className="text-[42px] max-[640px]:leading-[48px] mt-4 font-Bricolage text-[#141D2B] font-medium lg:text-start text-center">
            Frequently asked questions
          </h1>

          {faqData.map((faq, idx) => (
            <div
              key={idx}
              className="border border-gray-300 lg:w-[100%] w-full p-3 mt-7 cursor-pointer transition-all duration-500 "
              onClick={() => toggleFaq(idx)}
            >
              <h1 className="font-semibold sm:text-[20px] text-[16px] text-gray-800 font-Bricolage flex justify-between items-center">
                {faq.question}
                <span>
                  {activeIndex === idx ? <ChevronUp /> : <ChevronRight />}
                </span>
              </h1>
              {activeIndex === idx && (
                <p className="text-sm mt-2 font-Bricolage text-gray-600">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Right Image */}
        <div className="mt-10 lg:mt-0 w-full lg:w-[40%]">
          <Image src={faqImage} alt="faqImage" className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}

export default Four7;
