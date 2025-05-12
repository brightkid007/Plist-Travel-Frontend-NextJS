import Image from "next/image";
import packageOne from "/public/Images/plist-travel/packageOne.png";
import packageTwo from "/public/Images/plist-travel/packageTwo.png";
import packageThree from "/public/Images/plist-travel/packageThree.png";
import packageFour from "/public/Images/plist-travel/packageFour.png";
import packageFive from "/public/Images/plist-travel/packageFive.png";
import packageSix from "/public/Images/plist-travel/packageSix.png";
import packageSeven from "/public/Images/plist-travel/packageSeven.png";
import packageEight from "/public/Images/plist-travel/packageEight.png";

const PackageInterest = () => {
  return (
    <div className="bg-[#EEEEEE] -mt-9 sm:-mt-16 md:-mt-20 w-[90%] sm:w-[80%] md:w-[75%] mx-auto rounded-[44px] flex flex-col items-center pb-11">
      <div className="md:mt-14 sm:mt-10 mt-7 w-[90%]">
        <p className="text-[32px] font-semibold text-center font-Bricolage text-[#11161F] max-[639px]:leading-[40px]">
          Choose Your Package Interest
        </p>
        <div className="grid grid-cols-2 md:flex justify-between w-full xl:mt-12 lg:mt-8 md:mt-5 sm:mt-3 mt-2 gap-4">
          <div className="lg:w-[19%] md:w-[48%] w-full">
            <Image src={packageOne} className="w-full" alt="Package One" />
          </div>
          <div className="lg:w-[19%] md:w-[48%] w-full">
            <Image src={packageTwo} className="w-full" alt="Package Two" />
          </div>
          <div className="lg:w-[19%] md:w-[48%] w-full">
            <Image src={packageThree} className="w-full" alt="Package Three" />
          </div>
          <div className="lg:w-[19%] md:w-[48%] w-full">
            <Image src={packageFour} className="w-full" alt="Package Four" />
          </div>
          <div className="lg:w-[19%] md:w-[48%] w-full">
            <Image src={packageFive} className="w-full" alt="Package Five" />
          </div>
        </div>
      </div>

      <div className="sm:mt-16 mt-8 w-[90%]">
        <p className="text-[32px] font-semibold text-center font-Bricolage text-[#11161F] max-[639px]:leading-[40px]">
          Your Package Option
        </p>
        <div className="grid grid-cols-2 md:flex justify-center gap-3.5 w-full xl:mt-5 lg:mt-8 md:mt-5 sm:mt-3 mt-2">
          <div className="lg:w-[19%] md:w-[48%] w-full">
            <Image src={packageSix} className="w-full" alt="Package Six" />
          </div>
          <div className="lg:w-[19%] md:w-[48%] w-full">
            <Image src={packageSeven} className="w-full" alt="Package Seven" />
          </div>
          <div className="lg:w-[19%] md:w-[48%] w-full">
            <Image src={packageEight} className="w-full" alt="Package Eight" />
          </div>
        </div>
      </div>

      <div className="lg:mt-24 md:mt-20 sm:mt-16 mt-12 flex flex-col items-center text-center max-[639px]:px-2">
        <p className="sm:text-[32px] text-[28px] font-semibold max-[660px]:leading-[40px] font-Bricolage text-[#11161F]">
          Your Travel Adventure Begins Here
        </p>
        <p className="sm:text-[16px] text-[12px] font-normal text-[#2D3B4E] font-Bricolage w-full sm:w-[80%] sm:mt-6 mt-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Urna, tortor
          tempus. Lorem ipsum dolor sit amet, consectetur tortor adipiscing
          elit. Urna, tortor tempus. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit. Urna, tortor tempus. Lorem ipsum dolor sit amet,
          consectetur tortor adipiscing.
        </p>
        <button className="px-[55px] py-[13px] rounded-[11px] bg-gradient-to-r from-[#245BAA] to-[#0CA4C4] text-[18px] font-medium font-Bricolage text-white sm:mt-10 mt-6">
          Continue
        </button>
      </div>
    </div>
  );
};

export default PackageInterest;
