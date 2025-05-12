import Image from "next/image";
import aboutImage from "/public/Images/become-vendor/aboutus.png";
import aboutVector from "/public/Images/become-vendor/vector.png";

const AboutUs = () => {
  return (
    <div className="xl:px-44 lg:px-16 px-6 lg:mt-36 lg:mb-32 md:mt-24 sm:mt-14 mt-10 mb-10 flex lg:flex-row flex-col gap-3 sm:gap-4 md:gap-6 lg:gap-12">
      <div>
        <Image
          src={aboutImage}
          alt=""
          className="md:h-[636px] sm:h-[460px] h-[300px] object-cover lg:w-auto w-full rounded-[40px] sm:rounded-[56px]"
        />
      </div>
      <div className="md:w-[76%] w-full">
        <p className="text-[40px] sm:text-[52px] font-normal font-Bricolage text-transparent bg-clip-text bg-gradient-to-r from-[#245BAA] to-[#633ED5] text-center md:text-left">
          About Us
        </p>
        <p className="text-center md:text-left md:text-[72px] sm:text-[48px] text-[30px] font-semibold font-Bricolage text-black md:leading-[88px] sm:leading-[60px] leading-[38px] md:w-[720px] w-[90%] flex flex-col">
          We are Professional Planners For your
        </p>
        <p className="pl-3 md:pl-0 md:text-[16px] text-[12px] font-normal font-Bricolage text-[#29384D] sm:mt-2 mt-1.5 md:leading-[28px] leading-[20px] flex flex-col md:w-[620px] w-[94%]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. sed do
          eiusmod tem por incididunt ut labore et dolore magna aliqua. Ut enim
          ad minim veniam Lorem ipsum dolor sit amet, consectetur adipiscing
          elit. sed do
        </p>
        <div className="pl-3 md:pl-0 flex flex-col gap-3 sm:gap-3.5 md:mt-8 sm:mt-5 mt-4 mb-3">
          <div className="flex items-center gap-3">
            <Image src={aboutVector} alt="aboutVector" />
            <p className="text-[12px] sm:text-[16px] font-normal text-black font-Bricolage">
              All placges and activiates are carefully picked by us.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Image src={aboutVector} alt="aboutVector" />
            <p className="text-[12px] sm:text-[16px] font-normal text-black font-Bricolage">
              98% Course Completitation Rates
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Image src={aboutVector} alt="aboutVector" />
            <p className="text-[12px] sm:text-[16px] font-normal text-black font-Bricolage">
              We are an award winning agency
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Image src={aboutVector} alt="aboutVector" />
            <p className="text-[12px] sm:text-[16px] font-normal text-black font-Bricolage">
              Trusted by more than 80,000 customer
            </p>
          </div>
        </div>
        <div className="flex justify-center md:justify-start">
          <button className="bg-gradient-to-r from-[#245BAA] to-[#633ED5] w-fit text-[18px] font-medium text-white font-Bricolage py-[10px] px-[20px] rounded-[11px] md:mt-6 cursor-pointer sm:mt-5 mt-3">
            Read More
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
