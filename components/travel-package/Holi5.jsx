import React from "react";
import women from "/public/Images/Frame (5).png";
import Image from "next/image";

function Holi5() {
  return (
    <div className="flex justify-center lg:mt-44 mt-16">
      <div className="bg-[#054CA3] lg:w-full w-[96%] text-center lg:text-start lg:h-[437px] h-auto md:p-10 p-5 rounded-xl flex lg:justify-center gap-5 lg:flex-row flex-col lg:items-start items-center">
        <div className="lg:w-auto w-full">
          <div>
            <h1 className="text-xl lg:text-[38px] font-bold md:mt-10 mt-2 font-Bricolage text-white">
              Cheap Travel Packages in popular destinations
            </h1>
          </div>
          <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-5 md:mt-10 mt-4">
            <div>
              <div>
                <h1 className="text-lg lg:text-[20px] font-semibold mt-3 font-Bricolage text-white">
                  African Tours
                </h1>
              </div>
              <div className="lg:mt-2 mt-1">
                <ul className="space-y-1">
                  <li>
                    <a href="/" className="font-Bricolage text-white text-base">
                      Tours in Bamako
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage text-white text-base">
                      Tours in Batna
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage text-white text-base">
                      Tours in Blantyre
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage text-white text-base">
                      Tours in Bobo Dioula
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage text-white text-base">
                      Tours in Biska
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <div>
                <h1 className="text-lg lg:text-[20px] font-semibold mt-3 font-Bricolage text-white">
                  European Tours
                </h1>
              </div>
              <div className="lg:mt-2 mt-1">
                <ul className="space-y-1">
                  <li>
                    <a href="/" className="font-Bricolage text-white text-base">
                      Tours in Bamako
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage text-white text-base">
                      Tours in Batna
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage text-white text-base">
                      Tours in Blantyre
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage text-white text-base">
                      Tours in Bobo Dioula
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage text-white text-base">
                      Tours in Biska
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <div>
                <h1 className="text-lg lg:text-[20px] font-semibold mt-3 font-Bricolage text-white">
                  Asian Tours
                </h1>
              </div>
              <div className="lg:mt-2 mt-1">
                <ul className="space-y-1">
                  <li>
                    <a href="/" className="font-Bricolage text-white text-base">
                      Tours in Bamako
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage text-white text-base">
                      Tours in Batna
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage text-white text-base">
                      Tours in Blantyre
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage text-white text-base">
                      Tours in Bobo Dioula
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage text-white text-base">
                      Tours in Biska
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <div>
                <h1 className="text-lg lg:text-[20px] font-semibold mt-3 font-Bricolage text-white">
                  North American Tours
                </h1>
              </div>
              <div className="lg:mt-2 mt-1">
                <ul className="space-y-1">
                  <li>
                    <a href="/" className="font-Bricolage text-white text-base">
                      Tours in Bamako
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage text-white text-base">
                      Tours in Batna
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage text-white text-base">
                      Tours in Blantyre
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage text-white text-base">
                      Tours in Bobo Dioula
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage text-white text-base">
                      Tours in Biska
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:-mt-28 mt-10 w-full flex items-center justify-center lg:w-fit">
          <Image src={women} alt="" className="object-cover" />
        </div>
      </div>
    </div>
  );
}

export default Holi5;
