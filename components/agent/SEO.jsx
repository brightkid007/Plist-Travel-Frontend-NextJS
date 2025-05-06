const BecomeAgent = () => {
  return (
    <div className="bg-[#5627E2] md:h-[432px] sm:h-[380px] h-[320px] flex justify-center items-center text-center mt-6">
      <div className="flex flex-col items-center">
        <p className="xl:text-[72px] lg:text-[60px] sm:text-[52px] text-[40px] font-bold font-Bricolage text-white">
          Become a Agent
        </p>
        <p className="sm:text-[16px] text-[15px] font-normal font-Bricolage text-white mt-2.5 sm:w-[500px] text-center w-[90%]">
          Our solutions serve a range of businesses across a variety of
          industries. Find your industry to see how we can help you.
        </p>
        <button className="px-[32px] py-[14px] bg-white rounded-full text-[18px] font-medium font-Bricolage text-[#5627E2] sm:mt-16 mt-10">
          JOIN US
        </button>
      </div>
    </div>
  );
};

export default BecomeAgent;
