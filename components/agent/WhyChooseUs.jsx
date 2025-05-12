import Image from "next/image";
import chooseOne from "/public/Images/become-agent/chooseOne.png";
import chooseTwo from "/public/Images/become-agent/chooseTwo.png";
import chooseThree from "/public/Images/become-agent/chooseThree.png";
import chooseFour from "/public/Images/become-agent/chooseFour.png";
import chooseFive from "/public/Images/become-agent/chooseFive.png";
import chooseSix from "/public/Images/become-agent/chooseSix.png";

const WhyChooseUs = () => {
  return (
    <div className="lg:mt-24 md:mt-14 sm:mt-12 mt-5 text-center xl:px-44 lg:px-16 px-6">
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center">
          <p className="xl:text-[72px] lg:text-[60px] sm:text-[52px] text-[40px] font-bold font-Bricolage text-black">
            Why Choose US
          </p>
          <p className="sm:text-[16px] text-[15px] font-normal font-Bricolage text-black mt-1 sm:w-[60%] w-[90%]">
            Our solutions serve a range of businesses across a variety of
            industries. Find your industry to see how we can help you.
          </p>
        </div>
      </div>
      <div className="flex justify-between flex-wrap lg:mt-16 md:mt-5 sm:mt-4 mt-0">
        <div className="bg-[#F3F3F3] border border-[#DBDBDB] explore-cardBG flex flex-col items-center justify-center rounded-[24px] md:w-[48%] lg:w-[32%] w-full px-[30px] py-[20px] mt-8 h-[300px] md:h-[350px]">
          <Image src={chooseOne} />
          <p className="text-[24px] font-semibold font-Bricolage text-[#141D2B] mt-5">
            Every Time Update
          </p>
          <p className="text-[16px] font-normal font-Bricolage text-[#2D3B4E] mt-5">
            Discover exciting experiences curated to make your trip
            unforgettable
          </p>
        </div>
        <div className="bg-[#F3F3F3] border border-[#DBDBDB] explore-cardBG flex flex-col items-center justify-center rounded-[24px] md:w-[48%] lg:w-[32%] w-full px-[30px] py-[20px] mt-8 h-[300px] md:h-[350px]">
          <Image src={chooseTwo} />
          <p className="text-[24px] font-semibold font-Bricolage text-[#141D2B] mt-5">
            Save Your Money
          </p>
          <p className="text-[16px] font-normal font-Bricolage text-[#2D3B4E] mt-5">
            Discover exciting experiences curated to make your trip
            unforgettable
          </p>
        </div>
        <div className="bg-[#F3F3F3] border border-[#DBDBDB] explore-cardBG flex flex-col items-center justify-center rounded-[24px] md:w-[48%] lg:w-[32%] w-full px-[30px] py-[20px] mt-8 h-[300px] md:h-[350px]">
          <Image src={chooseThree} className="w-[90px] h-[90px]" />
          <p className="text-[24px] font-semibold font-Bricolage text-[#141D2B] mt-5">
            24/7 Expert Support
          </p>
          <p className="text-[16px] font-normal font-Bricolage text-[#2D3B4E] mt-5">
            Discover exciting experiences curated to make your trip
            unforgettable
          </p>
        </div>
        <div className="bg-[#F3F3F3] border border-[#DBDBDB] explore-cardBG flex flex-col items-center justify-center rounded-[24px] md:w-[48%] lg:w-[32%] w-full px-[30px] py-[20px] mt-8 h-[300px] md:h-[350px]">
          <Image src={chooseFive} />
          <p className="text-[24px] font-semibold font-Bricolage text-[#141D2B] mt-5">
            Languages Available
          </p>
          <p className="text-[16px] font-normal font-Bricolage text-[#2D3B4E] mt-5">
            Discover exciting experiences curated to make your trip
            unforgettable
          </p>
        </div>
        <div className="bg-[#F3F3F3] border border-[#DBDBDB] explore-cardBG flex flex-col items-center justify-center rounded-[24px] md:w-[48%] lg:w-[32%] w-full px-[30px] py-[20px] mt-8 h-[300px] md:h-[350px]">
          <Image src={chooseFour} />
          <p className="text-[24px] font-semibold font-Bricolage text-[#141D2B] mt-5">
            Every Travelers Insauarance
          </p>
          <p className="text-[16px] font-normal font-Bricolage text-[#2D3B4E] mt-5">
            Discover exciting experiences curated to make your trip
            unforgettable
          </p>
        </div>
        <div className="bg-[#F3F3F3] border border-[#DBDBDB] explore-cardBG flex flex-col items-center justify-center rounded-[24px] md:w-[48%] lg:w-[32%] w-full px-[30px] py-[20px] mt-8 h-[300px] md:h-[350px]">
          <Image src={chooseSix} className="w-[100px] h-[90px]" />
          <p className="text-[24px] font-semibold font-Bricolage text-[#141D2B] mt-5">
            Great Managment
          </p>
          <p className="text-[16px] font-normal font-Bricolage text-[#2D3B4E] mt-5">
            Discover exciting experiences curated to make your trip
            unforgettable
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
