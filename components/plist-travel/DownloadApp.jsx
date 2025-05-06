import React from "react";
import img12 from "/public/Images/image-8.png";
import mobile from "/public/Images/plist-travel/Group 121.svg";
import app from "/public/Images/app 1.png";
import google from "/public/Images/google 1.png";
import Image from "next/image";

function DownloadApp() {
  return (
    <div
      style={{
        backgroundImage: `url("/Images/image-8.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="mx-auto h-auto lg:h-[53vh] xl:mx-32 lg:mx-9 mx-6 flex lg:flex-row flex-col p-6 lg:p-28 gap-12 lg:gap-48 lg:mt-32 md:mt-20 mt-16"
    >
      <div className="flex justify-center lg:justify-start">
        <Image
          src={mobile}
          alt="Mobile"
          className="lg:-mt-40 mt-2 w-4/5 max-w-xs lg:max-w-full h-auto lg:h-[60vh]"
        />
      </div>

      <div className="text-center lg:text-left">
        <h1 className="text-white text-[24px] md:text-[32px] lg:text-[42px] font-Bricolage font-bold">
          Plist Travel Mobile App
        </h1>
        <p className="text-white text-[12px] md:text-[16px] font-Bricolage lg:text-[31px] font-medium md:mt-3 mt-1">
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

export default DownloadApp;
