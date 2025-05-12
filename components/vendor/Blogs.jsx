import img9 from "/public/Images/Link (3).png";
import img10 from "/public/Images/Link (5).png";
import img11 from "/public/Images/Link (4).png";
import Image from "next/image";

const Blogs = () => {
  return (
    <div className="px-4 sm:px-6 lg:pl-24 xl:pl-44 md:mt-20 lg:mt-28 sm:mt-16 mt-10 lg:w-[85%] lg:mx-auto">
      <div>
        <p className="border border-blue-700 text-[#054CA3] rounded-full w-fit px-4 font-bold flex justify-center font-Bricolage py-2 text-sm sm:text-[18px]">
          Have a question?
        </p>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-Bricolage font-bold w-full lg:w-[50%] md:mt-5 mt-3">
          Hotels Blogs
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:mt-10 mt-6">
        <div>
          <Image src={img9} alt="Blog 1" className="w-full rounded-md" />
          <p className="text-[13.45px] font-normal font-Bricolage text-[#2D3B4E] mt-5">
            April 06 2023 | By Ali Tufan
          </p>
          <h3 className="text-[17.3px] text-[#141D2B] font-Bricolage font-semibold mt-2">
            Kenya vs Tanzania Safari: The Better African Safari Experience
          </h3>
        </div>

        <div>
          <Image src={img10} alt="Blog 2" className="w-full rounded-md" />
          <p className="text-[13.45px] font-normal font-Bricolage text-[#2D3B4E] mt-5">
            April 07 2023 | By Emily Johnson
          </p>
          <h3 className="text-[17.3px] text-[#141D2B] font-Bricolage font-semibold mt-2">
            Exploring the Serengeti: A Wildlife Adventure
          </h3>
        </div>

        <div>
          <Image src={img11} alt="Blog 3" className="w-full rounded-md" />
          <p className="text-[13.45px] font-normal font-Bricolage text-[#2D3B4E] mt-5">
            April 08 2023 | By Maxwell Rhodes
          </p>
          <h3 className="text-[17.3px] text-[#141D2B] font-Bricolage font-semibold mt-2">
            Into the Wild: An Unforgettable Safari Journey
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Blogs;
