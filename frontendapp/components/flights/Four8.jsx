import React from "react";
import women from "/public/Images/Group 282.png";
import Image from "next/image";

function Four8() {
  return (
    <div className="flex justify-center lg:mt-32 mt-12 bg-[#17B8CA] w-full">
      <div className="w-[70%] md:p-10 p-5 rounded-xl flex lg:justify-between text-center lg:text-start gap-5 lg:flex-row flex-col">
        <div className="">
          <div>
            <h1 className="text-xl font-bold md:mt-10 mt-2 font-Bricolage text-white">
              Cheap Flights from Nigeria
            </h1>
          </div>
          <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 md:mt-10 mt-4">
            <div>
              <div>
                <h1 className="text-lg font-semibold mt-3 font-Bricolage text-white">
                  African Flights
                </h1>
              </div>
              <div>
                <ul className="space-y-1">
                  <li>
                    <a href="/" className="font-Bricolage text-white">
                      Flight to Bamako
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage text-white">
                      Flight to Batna
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage text-white">
                      Flight to Blantyre
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage text-white">
                      Flight to Bobo Dioula
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage text-white">
                      Flight to Biska
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <div>
                <h1 className="text-lg font-semibold mt-3 font-Bricolage text-white">
                  European Flights
                </h1>
              </div>
              <div>
                <ul className="space-y-1">
                  <li>
                    <a href="/" className="font-Bricolage text-white">
                      Flight to Bamako
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage text-white">
                      Flight to Batna
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage text-white">
                      Flight to Blantyre
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage text-white">
                      Flight to Bobo Dioula
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage text-white">
                      Flight to Biska
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <div>
                <h1 className="text-lg font-semibold mt-3 font-Bricolage text-white">
                  Asian Flights
                </h1>
              </div>
              <div>
                <ul className="space-y-1">
                  <li>
                    <a href="/" className="font-Bricolage text-white">
                      Flight to Bamako
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage text-white">
                      Flight to Batna
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage text-white">
                      Flight to Blantyre
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage text-white">
                      Flight to Bobo Dioula
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage text-white">
                      Flight to Biska
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <div>
                <h1 className="text-lg font-semibold mt-3 font-Bricolage text-white">
                  North American Flights
                </h1>
              </div>
              <div>
                <ul className="space-y-1">
                  <li>
                    <a href="/" className="font-Bricolage text-white">
                      Flight to Bamako
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage text-white">
                      Flight to Batna
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage text-white">
                      Flight to Blantyre
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage text-white">
                      Flight to Bobo Dioula
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage text-white">
                      Flight to Biska
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex items-center justify-center lg:w-fit">
          <Image src={women} alt="" className="object-cover" />
        </div>
      </div>
    </div>
  );
}

export default Four8;
