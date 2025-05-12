import React, { useState } from "react";
import Image from "next/image";
import faqImage from "/public/Images/faq-png.png";
import { ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";

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

function Eleventh() {
  const [activeIndex, setActiveIndex] = useState(0); // initially open the first

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="flex justify-center lg:mt-28 mt-14 lg:px-0 px-2 lg:w-[75%] lg:mx-auto">
      <div className="lg:w-[90%] w-full flex justify-between lg:flex-row flex-col">
        {/* Left FAQ Section */}
        <div className="xl:w-[620px] lg:w-[520px] w-full">
          <h3 className="border border-blue-700 bg-gradient-to-r font-Ubuntu from-[#245BAA] to-[#0CA4C4] rounded-full text-white w-fit px-3 flex justify-center py-1 text-sm sm:text-base mx-auto lg:mx-0">
            Have a question?
          </h3>
          <h1 className="text-[30px] max-[640px]:leading-[48px] mt-4 font-Bricolage text-[#141D2B] font-medium lg:text-start text-center">
            Frequently asked questions
          </h1>
          <div className="lg:w-[80%]">
            {faqData.map((faq, idx) => (
              <div
                key={idx}
                className="border border-gray-300 lg:w-[100%] w-full p-3 mt-7 cursor-pointer transition-all duration-500 "
                onClick={() => toggleFaq(idx)}
              >
                <h1 className="font-semibold sm:text-[18px] text-[13px] text-black font-Bricolage flex justify-between items-center">
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
        </div>

        {/* Right Image */}
        <div className="mt-10 lg:mt-0 xl:w-[500px] lg:w-[50%] w-full">
          <Image src={faqImage} alt="faqImage" className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}

export default Eleventh;
