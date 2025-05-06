import Image from "next/image";
import travelAgent1 from "/public/Images/become-agent/travelAgent(1).svg";
import travelAgent2 from "/public/Images/become-agent/travelAgent(2).svg";
import travelAgent from "/public/Images/become-agent/travelAgent.png";

const TravelAgent = () => {
  return (
    <div className="bg-[#E7E7E9] lg:mt-40 md:mt-24 sm:mt-20 mt-12 lg:pt-24 md:pt-12 sm:pt-8 pt-7 pb-10 lg:pb-24 xl:px-68 lg:px-24 px-6">
      <div className="flex flex-col items-center text-center">
        <p className="xl:text-[72px] lg:text-[60px] sm:text-[52px] text-[32px] max-[639px]:leading-[40px] font-bold font-Bricolage text-black">
          Become a Travel Agent?
        </p>
        <p className="sm:text-[16px] text-[15px] font-normal font-Bricolage text-black sm:w-[460px] w-[90%] max-[639px]:mt-2">
          Our solutions serve a range of businesses across a variety of
          industries. Find your industry to see how we can help you.
        </p>
      </div>
      <div className="flex xl:gap-2 gap-4 lg:flex-row flex-col-reverse justify-between md:mt-20 sm:mt-14 mt-8">
        <div className="flex flex-col gap-8 w-full md:w-[530px] lg:mt-0 md:mt-8 mt-5">
          <div className="justify-center items-center md:justify-start md:items-start flex flex-col ">
            <Image src={travelAgent1} alt="travelAgent1" />
            <p className="text-[32px] font-semibold font-Bricolage text-black sm:mt-5 mt-4">
              Travel Discounts
            </p>
            <p className="text-[16px] font-normal font-Bricolage text-black lg:mt-5 sm:mt-4 mt-2 leading-[28px] text-center md:text-start">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. sed do ad
              minim veniam Lorem ipsum dolor sit amet, consectetur adipiscing
              elit. sed do
            </p>
          </div>
          <div className="justify-center items-center md:justify-start md:items-start flex flex-col ">
            <Image src={travelAgent2} alt="travelAgent2" />
            <p className="text-[32px] font-semibold font-Bricolage text-black sm:mt-5 mt-4">
              Earn Commission
            </p>
            <p className="text-[16px] font-normal font-Bricolage text-black lg:mt-5 sm:mt-4 mt-2 leading-[28px] text-center md:text-start">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. sed do ad
              minim veniam Lorem ipsum dolor sit amet, consectetur adipiscing
              elit. sed do
            </p>
          </div>
        </div>
        <div className="h-full max-[1024px]:w-full lg:mt-3 mt-0">
          <Image
            src={travelAgent}
            alt="travelAgent"
            className="lg:h-full md:h-[600px] lg:object-cover max-[1024px]:w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default TravelAgent;
