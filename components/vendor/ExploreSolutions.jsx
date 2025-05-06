import Image from "next/image";
import exploreImage from "/public/Images/become-vendor/exploreSolutions.png";
import exploreOne from "/public/Images/become-vendor/exploreOne.svg";
import exploreTwo from "/public/Images/become-vendor/exploreTwo.svg";
import exploreThree from "/public/Images/become-vendor/exploreThree.svg";
import exploreFour from "/public/Images/become-vendor/exploreFour.svg";
import exploreFive from "/public/Images/become-vendor/exploreFive.svg";
import exploreSix from "/public/Images/become-vendor/exploreSix.svg";

const ExploreSolutions = () => {
  return (
    <div className="lg:mt-20 md:mt-12 sm:mt-10 mt-0 text-center xl:px-44 lg:px-16 px-6">
      <div className="h-[195px] relative flex items-center justify-center">
        <div className="h-full absolute">
          <Image
            src={exploreImage}
            alt="exploreImage"
            className="h-full w-full"
          />
        </div>
        <div>
          <p className="xl:text-[72px] lg:text-[60px] md:text-[52px] sm:text-[40px] text-[20px] font-bold font-Bricolage text-black">
            Explore solutions by industry
          </p>
          <p className="sm:text-[24px] text-[16px] font-normal font-Bricolage text-black mt-2">
            Our solutions can help any business — of any size — across a wide
            range of industries enter, succeed, and thrive in the universe of
            travel.
          </p>
        </div>
      </div>
      <div className="flex justify-between flex-wrap lg:mt-10 md:mt-6 sm:mt-4 mt-0">
        <div className="bg-[#F3F3F3] border border-[#DBDBDB] explore-cardBG flex flex-col items-center justify-center rounded-[24px] md:w-[48%] lg:w-[32%] w-full px-[30px] py-[20px] mt-8 h-[300px] md:h-[350px]">
          <Image src={exploreOne} />
          <p className="text-[24px] font-semibold font-Bricolage text-[#141D2B] mt-5">
            Hotel Booking
          </p>
          <p className="text-[16px] font-normal font-Bricolage text-[#2D3B4E] mt-5">
            Book your ideal stay with access to thousands of hotels, from budget
            to luxury
          </p>
        </div>
        <div className="bg-[#F3F3F3] border border-[#DBDBDB] explore-cardBG flex flex-col items-center justify-center rounded-[24px] md:w-[48%] lg:w-[32%] w-full px-[30px] py-[20px] mt-8 h-[300px] md:h-[350px]">
          <Image src={exploreTwo} />
          <p className="text-[24px] font-semibold font-Bricolage text-[#141D2B] mt-5">
            Tours & Attractions
          </p>
          <p className="text-[16px] font-normal font-Bricolage text-[#2D3B4E] mt-5">
            Discover exciting experiences curated to make your trip
            unforgettable
          </p>
        </div>
        <div className="bg-[#F3F3F3] border border-[#DBDBDB] explore-cardBG flex flex-col items-center justify-center rounded-[24px] md:w-[48%] lg:w-[32%] w-full px-[30px] py-[20px] mt-8 h-[300px] md:h-[350px]">
          <Image src={exploreThree} />
          <p className="text-[24px] font-semibold font-Bricolage text-[#141D2B] mt-5">
            Flight Booking
          </p>
          <p className="text-[16px] font-normal font-Bricolage text-[#2D3B4E] mt-5">
            Find the perfect flights at unbeatable prices, with easy booking and
            flexible options.
          </p>
        </div>
        <div className="bg-[#F3F3F3] border border-[#DBDBDB] explore-cardBG flex flex-col items-center justify-center rounded-[24px] md:w-[48%] lg:w-[32%] w-full px-[30px] py-[20px] mt-8 h-[300px] md:h-[350px]">
          <Image src={exploreFour} />
          <p className="text-[24px] font-semibold font-Bricolage text-[#141D2B] mt-5">
            Channel Manager
          </p>
          <p className="text-[16px] font-normal font-Bricolage text-[#2D3B4E] mt-5">
            Manage bookings across platforms, keeping availability and rates
            up-to-date.
          </p>
        </div>
        <div className="bg-[#F3F3F3] border border-[#DBDBDB] explore-cardBG flex flex-col items-center justify-center rounded-[24px] md:w-[48%] lg:w-[32%] w-full px-[30px] py-[20px] mt-8 h-[300px] md:h-[350px]">
          <Image src={exploreFive} />
          <p className="text-[24px] font-semibold font-Bricolage text-[#141D2B] mt-5">
            Rides
          </p>
          <p className="text-[16px] font-normal font-Bricolage text-[#2D3B4E] mt-5">
            Choose from a wide range of rental cars which suit needs—drive in
            style wherever you go!
          </p>
        </div>
        <div className="bg-[#F3F3F3] border border-[#DBDBDB] explore-cardBG flex flex-col items-center justify-center rounded-[24px] md:w-[48%] lg:w-[32%] w-full px-[30px] py-[20px] mt-8 h-[300px] md:h-[350px]">
          <Image src={exploreSix} />
          <p className="text-[24px] font-semibold font-Bricolage text-[#141D2B] mt-5">
            Holiday Package
          </p>
          <p className="text-[16px] font-normal font-Bricolage text-[#2D3B4E] mt-5">
            Find the perfect flights at unbeatable prices, with easy booking and
            flexible options.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExploreSolutions;
