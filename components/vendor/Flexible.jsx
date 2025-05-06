import Image from "next/image";
import videoButton from "/public/Images/become-vendor/videoButton.svg";

const Flexible = () => {
  return (
    <div
      className="lg:h-[711px] md:h-[600px] sm:h-[500px] h-[380px] md:mt-24 sm:mt-20 mt-16 flex flex-col text-center justify-center items-center"
      style={{
        backgroundImage: `url('/Images/become-vendor/flexible.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <p className="sm:text-[69.45px] text-[36px] font-bold font-Bricolage text-white">
        Keep things flexible
      </p>
      <p className="text-[14.53px] font-normal font-Inter text-white sm:w-[400px] w-[80%] leading-[28px] sm:mt-4 mt-2">
        Use Reserve Now & Pay Later to secure the Attractions you don't want to
        miss without being locked in.
      </p>
      <Image
        src={videoButton}
        alt="videoButton"
        className="sm:mt-7 mt-6 cursor-pointer"
      />
    </div>
  );
};

export default Flexible;
