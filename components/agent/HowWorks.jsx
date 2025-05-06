import Image from "next/image";
import howWorks1 from "/public/Images/become-agent/howWorks1.png";
import howWorks2 from "/public/Images/become-agent/howWorks2.png";
import howWorks3 from "/public/Images/become-agent/howWorks3.png";

const HowWorks = () => {
  return (
    <div className="xl:px-44 lg:px-16 px-6 lg:mt-24 md:mt-12 mt-6 md:mb-20 sm:mb-12 mb-6">
      <div className="flex flex-col items-center">
        <p className="md:text-[72px] sm:text-[52px] text-[40px] font-bold font-Bricolage text-black">
          How It Works
        </p>
        <p className="lg:text-[16px] md:text-[20px] text-[14px] font-medium leading-[20px] font-Bricolage text-center text-black lg:w-[40%] w-[90%]">
          Our solutions serve a range of businesses across a variety of
          industries. Find your industry to see how we can help you.
        </p>
      </div>
      <div className="w-full flex lg:flex-row flex-col lg:gap-0 gap-8 justify-between md:mt-16 sm:mt-12 mt-8">
        <div className="lg:w-[32.5%] w-full">
          <Image src={howWorks1} alt="howWorks1" className="w-full" />
        </div>
        <div className="lg:w-[32.5%] w-full">
          <Image src={howWorks2} alt="howWorks2" className="w-full" />
        </div>
        <div className="lg:w-[32.5%] w-full">
          <Image src={howWorks3} alt="howWorks3" className="w-full" />
        </div>
      </div>
    </div>
  );
};

export default HowWorks;
