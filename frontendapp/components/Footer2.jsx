import React from "react";
import icons from "/public/Images/Screenshot_4 1.png";
import stores from "/public/Images/Group 117.png";
import sendIcon from "/public/Images/send-Icon.svg";
import whiteLogo from "/public/Images/whiteLogo.png";
import Image from "next/image";

function Footer2() {
  return (
    <div
      className="flex flex-col items-center justify-center text-white mt-10 bg-no-repeat bg-cover"
      style={{ backgroundImage: `url('/Images/Footer-BG.png')` }}
    >
      <div className="lg:w-[80%] w-[100%] lg:text-start text-center flex gap-10 sm:mt-20 mt-10 lg:flex-row flex-col">
        <div className="lg:text-start text-center lg:ms-0 sm:ms-16 ms-6">
          <div className="flex items-center justify-center lg:justify-start">
            <Image
              src={whiteLogo}
              alt=""
              className="lg:w-[140px] md:w-[100px] lg:h-[55px] md:h-[40px] w-[70px] h-[30px]"
            />
          </div>
          <div className="lg:w-[90%] text-start">
            <p className="text-[15px] font-medium mt-6 font-Bricolage">
              Pharetra maecenas felisey vestibulum convallis mollis nullam
              congue sittle rivers.
            </p>
          </div>
          <div className="border border-gray-400 w-[329px] bg-[#D9D9D9] justify-between pr-[1.2rem] pl-7 rounded-full mt-8 outline-none flex items-center">
            <input
              name="search"
              placeholder="Enter Email"
              className="mr-6 text-[#2D3B4E] placeholder:text-[#2D3B4E] focus:outline-none font-Bricolage"
            />
            <Image src={sendIcon} alt="sendIcon" className="-mr-4" />
          </div>

          <div className="-ms-8 mt-3 cursor-pointer">
            <Image src={icons} alt="" />
          </div>
        </div>

        <div className="lg:hidden grid sm:grid-cols-3 grid-cols-2">
          {/* Quick Links */}
          <div>
            <h3 className="text-[24px] font-Bricolage font-bold mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:underline font-Bricolage">
                  Home
                </a>
              </li>
              <li>
                <a href="/" className="hover:underline font-Bricolage">
                  About Us
                </a>
              </li>
              <li>
                <a href="/" className="hover:underline font-Bricolage">
                  Services
                </a>
              </li>
              <li>
                <a href="/" className="hover:underline font-Bricolage">
                  Tour Packages
                </a>
              </li>
              <li>
                <a href="/" className="hover:underline font-Bricolage">
                  Career
                </a>
              </li>
              <li>
                <a href="/" className="hover:underline font-Bricolage">
                  Pricing
                </a>
              </li>
              <li>
                <a href="/" className="hover:underline font-Bricolage">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-[24px] font-Bricolage font-bold mb-3">
              Service
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:underline font-Bricolage">
                  Flight
                </a>
              </li>
              <li>
                <a href="/" className="hover:underline font-Bricolage">
                  Hotel
                </a>
              </li>
              <li>
                <a href="/" className="hover:underline font-Bricolage">
                  Tours
                </a>
              </li>
              <li>
                <a href="/" className="hover:underline font-Bricolage">
                  Transfers
                </a>
              </li>
              <li>
                <a href="/" className="hover:underline font-Bricolage">
                  Package Services
                </a>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div className="sm:mt-0 mt-10">
            <h3 className="text-[24px] font-Bricolage font-bold mb-3">Help</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:underline font-Bricolage">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/" className="hover:underline font-Bricolage">
                  Contact Support
                </a>
              </li>
              <li>
                <a href="/" className="hover:underline font-Bricolage">
                  Tour Packages
                </a>
              </li>
            </ul>
          </div>
          <div className="sm:ms-5 mt-10 flex flex-col items-center justify-center w-full sm:hidden lg:hidden">
            <div>
              <h3>Download Our App</h3>
            </div>
            <div className="mt-5">
              <Image src={stores} alt="" />
            </div>
          </div>
        </div>
        <div className="sm:ms-5 mt-10 hidden flex-col items-center justify-center w-full sm:flex lg:hidden">
          <div>
            <h3>Download Our App</h3>
          </div>
          <div className="mt-5">
            <Image src={stores} alt="" />
          </div>
        </div>

        {/* Quick Links */}
        <div className="lg:w-[20%] w-[100%] lg:block hidden">
          <h3 className="text-[24px] font-Bricolage font-bold mb-3">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:underline font-Bricolage">
                Home
              </a>
            </li>
            <li>
              <a href="/" className="hover:underline font-Bricolage">
                About Us
              </a>
            </li>
            <li>
              <a href="/" className="hover:underline font-Bricolage">
                Services
              </a>
            </li>
            <li>
              <a href="/" className="hover:underline font-Bricolage">
                Tour Packages
              </a>
            </li>
            <li>
              <a href="/" className="hover:underline font-Bricolage">
                Career
              </a>
            </li>
            <li>
              <a href="/" className="hover:underline font-Bricolage">
                Pricing
              </a>
            </li>
            <li>
              <a href="/" className="hover:underline font-Bricolage">
                Blog
              </a>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div className="lg:w-[20%] w-[100%] lg:block hidden">
          <h3 className="text-[24px] font-Bricolage font-bold mb-3">Service</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:underline font-Bricolage">
                Flight
              </a>
            </li>
            <li>
              <a href="/" className="hover:underline font-Bricolage">
                Hotel
              </a>
            </li>
            <li>
              <a href="/" className="hover:underline font-Bricolage">
                Tours
              </a>
            </li>
            <li>
              <a href="/" className="hover:underline font-Bricolage">
                Transfers
              </a>
            </li>
            <li>
              <a href="/" className="hover:underline font-Bricolage">
                Package Services
              </a>
            </li>
          </ul>
        </div>

        {/* Help */}
        <div className="lg:w-[20%] w-[100%] lg:block hidden">
          <h3 className="text-[24px] font-Bricolage font-bold mb-3">Help</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:underline font-Bricolage">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/" className="hover:underline font-Bricolage">
                Contact Support
              </a>
            </li>
            <li>
              <a href="/" className="hover:underline font-Bricolage">
                Tour Packages
              </a>
            </li>
          </ul>
        </div>

        <div className="lg:block hidden">
          <div className="w-full">
            <h3 className="text-[16px] font-bold font-Bricolage">
              Download Our App
            </h3>
          </div>
          <div className="lg:-ms-2 ms-5 mt-5">
            <Image src={stores} alt="" />
          </div>
        </div>
      </div>
      <div className="py-14 border-t border-white w-full text-center mt-10">
        <p className="text-[17px] font-medium text-white">
          Copyright @ Plisttravels 2025. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}

export default Footer2;
