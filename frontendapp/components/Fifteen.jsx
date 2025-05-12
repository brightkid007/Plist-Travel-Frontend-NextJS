import React from "react";
import img12 from "/public/Images/image-8.png";
import mobile from "/public/Images/Group 121.png";
import app from "/public/Images/app 1.png";
import google from "/public/Images/google 1.png";
import Image from "next/image";

function Fifteen() {
  return (
    <div
      style={{
        backgroundImage: `url("/Images/image-8.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "68%",
      }}
      className="mx-auto h-auto lg:h-[53vh] flex lg:flex-row flex-col p-6 lg:p-28 gap-12 lg:gap-48 mt-32"
    >
      <div className="flex justify-center lg:justify-start">
        <Image
          src={mobile}
          alt="Mobile"
          className="lg:-mt-40 mt-2 w-full max-w-xs lg:max-w-full h-auto lg:h-[60vh]"
        />
      </div>

      <div className="text-center lg:text-left">
        <h1 className="text-white text-[24px] md:text-[28px] lg:text-[38px] font-Bricolage font-bold">
          Plist Travel Mobile App
        </h1>
        <p className="text-white text-[12px] md:text-[16px] font-Bricolage lg:text-[24px] font-medium md:mt-3 mt-1">
          Download Our App From Google & App Store!
        </p>
        <div className="md:mt-7 mt-3 flex justify-center lg:justify-start gap-4">
          <Image src={app} alt="App Store" className="w-32 lg:w-48" />
          <Image src={google} alt="Google Play" className="w-32 lg:w-48" />
        </div>
      </div>
    </div>
  );
}

export default Fifteen;
