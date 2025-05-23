import React, { useState } from "react";
import bannerImage from "/public/Images/Group-258.png";
import { faGlobe, faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import whiteLogo from "/public/Images/whiteLogo.png";
import peoples from "/public/Images/Group 81.svg";
import Link from "next/link";
import Image from "next/image";
import svgIcon from "./data/svgIcon";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <div className="bg-gradient-to-r from-[#245BAA] to-[#0CA4C4] md:h-[83px] h-[60px] text-white xl:px-44 lg:px-16 lg:text-lg text-xs">
        <div className="flex justify-between items-center sm:px-4 px-2 h-full">
          <div className="flex items-center sm:gap-4 gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 16 16"
              width="24"
              height="24"
            >
              <g clip-path="url(#a)">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M10.27 14.1a6.5 6.5 0 0 0 3.67-3.45q-1.24.21-2.7.34-.31 1.83-.97 3.1M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.48-1.52a7 7 0 0 1-.96 0H7.5a4 4 0 0 1-.84-1.32q-.38-.89-.63-2.08a40 40 0 0 0 3.92 0q-.25 1.2-.63 2.08a4 4 0 0 1-.84 1.31zm2.94-4.76q1.66-.15 2.95-.43a7 7 0 0 0 0-2.58q-1.3-.27-2.95-.43a18 18 0 0 1 0 3.44m-1.27-3.54a17 17 0 0 1 0 3.64 39 39 0 0 1-4.3 0 17 17 0 0 1 0-3.64 39 39 0 0 1 4.3 0m1.1-1.17q1.45.13 2.69.34a6.5 6.5 0 0 0-3.67-3.44q.65 1.26.98 3.1M8.48 1.5l.01.02q.41.37.84 1.31.38.89.63 2.08a40 40 0 0 0-3.92 0q.25-1.2.63-2.08a4 4 0 0 1 .85-1.32 7 7 0 0 1 .96 0m-2.75.4a6.5 6.5 0 0 0-3.67 3.44 29 29 0 0 1 2.7-.34q.31-1.83.97-3.1M4.58 6.28q-1.66.16-2.95.43a7 7 0 0 0 0 2.58q1.3.27 2.95.43a18 18 0 0 1 0-3.44m.17 4.71q-1.45-.12-2.69-.34a6.5 6.5 0 0 0 3.67 3.44q-.65-1.27-.98-3.1"
                  fill="#fff"
                />
              </g>
              <defs>
                <clipPath id="a">
                  <path fill="#fff" d="M0 0h16v16H0z" />
                </clipPath>
              </defs>
            </svg>
            <p className="sm:text-[18px] text-[12px] font-medium font-Bricolage text-white">
              Select Language
            </p>
          </div>
          <div className="flex items-center sm:gap-6 gap-2">
            <div
              className="flex sm:items-start gap-3"
              style={{ alignItems: "anchor-center" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M22 12C22 6.49 17.51 2 12 2C6.49 2 2 6.49 2 12C2 14.9 3.25 17.51 5.23 19.34C5.23 19.35 5.23 19.35 5.22 19.36C5.32 19.46 5.44 19.54 5.54 19.63C5.6 19.68 5.65 19.73 5.71 19.77C5.89 19.92 6.09 20.06 6.28 20.2C6.35 20.25 6.41 20.29 6.48 20.34C6.67 20.47 6.87 20.59 7.08 20.7C7.15 20.74 7.23 20.79 7.3 20.83C7.5 20.94 7.71 21.04 7.93 21.13C8.01 21.17 8.09 21.21 8.17 21.24C8.39 21.33 8.61 21.41 8.83 21.48C8.91 21.51 8.99 21.54 9.07 21.56C9.31 21.63 9.55 21.69 9.79 21.75C9.86 21.77 9.93 21.79 10.01 21.8C10.29 21.86 10.57 21.9 10.86 21.93C10.9 21.93 10.94 21.94 10.98 21.95C11.32 21.98 11.66 22 12 22C12.34 22 12.68 21.98 13.01 21.95C13.05 21.95 13.09 21.94 13.13 21.93C13.42 21.9 13.7 21.86 13.98 21.8C14.05 21.79 14.12 21.76 14.2 21.75C14.44 21.69 14.69 21.64 14.92 21.56C15 21.53 15.08 21.5 15.16 21.48C15.38 21.4 15.61 21.33 15.82 21.24C15.9 21.21 15.98 21.17 16.06 21.13C16.27 21.04 16.48 20.94 16.69 20.83C16.77 20.79 16.84 20.74 16.91 20.7C17.11 20.58 17.31 20.47 17.51 20.34C17.58 20.3 17.64 20.25 17.71 20.2C17.91 20.06 18.1 19.92 18.28 19.77C18.34 19.72 18.39 19.67 18.45 19.63C18.56 19.54 18.67 19.45 18.77 19.36C18.77 19.35 18.77 19.35 18.76 19.34C20.75 17.51 22 14.9 22 12ZM16.94 16.97C14.23 15.15 9.79 15.15 7.06 16.97C6.62 17.26 6.26 17.6 5.96 17.97C4.44 16.43 3.5 14.32 3.5 12C3.5 7.31 7.31 3.5 12 3.5C16.69 3.5 20.5 7.31 20.5 12C20.5 14.32 19.56 16.43 18.04 17.97C17.75 17.6 17.38 17.26 16.94 16.97Z"
                  fill="white"
                />
                <path
                  d="M12 6.93C9.93 6.93 8.25 8.61 8.25 10.68C8.25 12.71 9.84 14.36 11.95 14.42C11.98 14.42 12.02 14.42 12.04 14.42C12.06 14.42 12.09 14.42 12.11 14.42C12.12 14.42 12.13 14.42 12.13 14.42C14.15 14.35 15.74 12.71 15.75 10.68C15.75 8.61 14.07 6.93 12 6.93Z"
                  fill="white"
                />
              </svg>
              <p className="sm:text-[18px] text-[12px] font-medium font-Bricolage">
                Sign In / Register
              </p>
            </div>
            <div className="w-[1px] sm:h-[42px] h-[24px] bg-[#D9D9D980]"></div>
            <select>
              <option className="sm:text-[18px] text-[12px] font-medium font-Bricolage">
                USD
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Hero Section with Background */}
      <div
        style={{
          backgroundImage: `url("/Images/Group-258.png")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="relative lg:pb-0 pb-16 lg:h-[933px]"
      >
        {/* Navbar */}
        <div className="lg:pt-6 pt-3 xl:px-44 lg:px-16 px-4">
          <div className="flex justify-center lg:justify-between items-center mt-3">
            <Image
              src={whiteLogo}
              alt="Logo"
              className="lg:w-[200px] md:w-[160px] lg:h-[77px] md:h-[60px] w-[120px] h-[45px]"
              unoptimized
            />

            <div className="hidden lg:flex">
              <ul className="text-white gap-6 flex text-center mt-2">
                <li>
                  <Link
                    href="/"
                    className="text-[14px] font-medium font-Bricolage"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/hotel"
                    className="text-[14px] font-medium font-Bricolage"
                  >
                    Hotel
                  </Link>
                </li>
                <li>
                  <Link
                    href="/carrental"
                    className="text-[14px] font-medium font-Bricolage"
                  >
                    List Property
                  </Link>
                </li>
                <li>
                  <Link
                    href="/activity"
                    className="text-[14px] font-medium font-Bricolage"
                  >
                    Tours & Attractions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/flights"
                    className="text-[14px] font-medium font-Bricolage"
                  >
                    Flights
                  </Link>
                </li>
                <li>
                  <Link
                    href="/holiday"
                    className="text-[14px] font-medium font-Bricolage"
                  >
                    Holiday
                  </Link>
                </li>
              </ul>
            </div>

            <button className="border border-blue-600 text-white rounded-[11px] mt-4 lg:flex hidden text-[18px] font-medium font-Bricolage py-[10px] px-[22px]">
              Become a Partner
            </button>

            <div className="absolute right-5 lg:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-white text-2xl"
              >
                ☰
              </button>
            </div>
          </div>

          {menuOpen && (
            <div className="lg:hidden mt-4 bg-white shadow-lg rounded-xl p-6">
              <ul className="flex flex-col space-y-4 text-gray-800 font-semibold">
                <li>
                  <Link
                    href="/"
                    className="hover:text-blue-600 transition-colors duration-300"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/hotel"
                    className="hover:text-blue-600 transition-colors duration-300"
                  >
                    Hotel
                  </Link>
                </li>
                <li>
                  <Link
                    href="/carrental"
                    className="hover:text-blue-600 transition-colors duration-300"
                  >
                    List Property
                  </Link>
                </li>
                <li>
                  <Link
                    href="/activity"
                    className="hover:text-blue-600 transition-colors duration-300"
                  >
                    Tours & Attractions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/flights"
                    className="hover:text-blue-600 transition-colors duration-300"
                  >
                    Flights
                  </Link>
                </li>
                <li>
                  <Link
                    href="/holiday"
                    className="hover:text-blue-600 transition-colors duration-300"
                  >
                    Holiday
                  </Link>
                </li>
              </ul>

              <button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-bold py-2 rounded-lg shadow-md hover:from-blue-700 hover:to-cyan-500 transition-all duration-300">
                Become a Partner
              </button>
            </div>
          )}
        </div>

        {/* Hero Text */}
        <div className="text-center lg:mt-28 mt-14">
          <h1 className="text-white sm:text-[57px] text-[36px] font-bold font-Bricolage">
            Effortless Booking, Unforgettable Journeys
          </h1>
        </div>

        <div className="text-center lg:mt-10 mt-8">
          <p className="text-white lg:text-[79px] text-2xl font-satisfy">
            Plist Travels
          </p>
        </div>

        <div className=" flex justify-center  flex-col lg:gap-7 gap-0 lg:mt-10 mt-8 items-center">
          <div>
            <Image src={peoples} alt="" className="w-[327px] h-[64px]" unoptimized />
          </div>

          <div className="lg:w-[20%] w-[80%] text-center">
            <p
              className="text-white lg:text-[16px] font-medium lg:text-start
             text-center font-Bricolage text-sm lg:mt-0 mt-3"
            >
              2,500 people booked Tommorowland Event in last 24 hours
            </p>
          </div>
        </div>

        <div className="lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 xl:w-[1019px] lg:w-[950px] h-auto lg:h-[83px] mt-10 lg:mt-12 bg-white lg:rounded-full rounded-[16px] flex lg:flex-row flex-col flex-wrap lg:flex-nowrap justify-between items-center shadow-lg gap-4 xl:pl-8 lg:pl-3 pl-6 lg:pr-5 pr-6 lg:py-0 py-5 sm:w-[80%] w-[90%] md:w-[50%] lg:mx-0 mx-auto">
          <div className="flex flex-col lg:w-auto text-center lg:text-left lg:p-4 px-2">
            <div className="px-4 text-[16px] font-semibold font-Bricolage text-[#2B2B2B]">
              Location
            </div>
            <input
              type="text"
              placeholder="Where are you going"
              className="w-full lg:w-auto px-4 py-2 rounded-full border focus:outline-none border-none text-[16px] font-Bricolage font-normal text-[#505050] text-center lg:text-left"
            />
          </div>

          <div className="h-full w-[1px] bg-[#F3EDED] lg:block hidden"></div>

          <div className="flex flex-col lg:w-auto text-center lg:text-left lg:p-4 px-2">
            <div className="px-4 text-[16px] font-semibold font-Bricolage text-[#2B2B2B]">
              Check in - Check out
            </div>
            <input
              type="text"
              placeholder="April 04 - August 04"
              className="w-full lg:w-auto px-4 py-2 rounded-full border focus:outline-none border-none text-[16px] font-Bricolage font-normal text-[#505050] text-center lg:text-left"
            />
          </div>

          <div className="h-full w-[1px] bg-[#F3EDED] lg:block hidden"></div>

          <div className="flex flex-col lg:w-auto text-center lg:text-left lg:p-4 px-2">
            <div className="px-4 text-[16px] font-semibold font-Bricolage text-[#2B2B2B]">
              Guest
            </div>
            <input
              type="text"
              placeholder="2 adults - 1 children - 1 Room"
              className="w-full lg:w-auto px-4 py-2 rounded-full border focus:outline-none border-none text-[16px] font-Bricolage font-normal text-[#505050] text-center lg:text-left"
            />
          </div>

          <button className="bg-gradient-to-r from-[#245BAA] to-[#0CA4C4] text-white h-[60px] lg:w-[152px] w-[180px] text-[16px] font-medium font-Bricolage rounded-full flex items-center gap-4 justify-center p-4 lg:mx-0 mx-auto">
            {svgIcon.search}
            Search
          </button>
        </div>
      </div>
    </>
  );
}

export default Header;
