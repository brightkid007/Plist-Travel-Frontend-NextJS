import React from "react";
import women from "/public/Images/Group (3).png";
import Image from "next/image";

function Other6() {
  return (
    <div className="flex justify-center mt-14 lg:w-[70%] lg:mx-auto">
      <div className="bg-[#DAECF0] w-[100%] md:p-10 p-5 rounded-xl flex lg:justify-between gap-5 lg:flex-row flex-col text-center lg:text-start">
        <div>
          <div>
            <h1 className="text-xl font-bold md:mt-10 mt-2 font-Bricolage">
              Cheap Hotels from Nigeria
            </h1>
          </div>
          <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 mt-10">
            <div>
              <div>
                <h1 className="text-lg font-semibold mt-3 font-Bricolage font-Bricolage">
                  African Hotels
                </h1>
              </div>
              <div>
                <ul className="space-y-1">
                  <li>
                    <a href="/" className="font-Bricolage">
                      Hotels in Bamako
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage">
                      Hotels in Batna
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage">
                      Hotels in Blantyre
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage">
                      Hotels in Bobo Dioula
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage">
                      Hotels in Biska
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <div>
                <h1 className="text-lg font-semibold mt-3 font-Bricolage">
                  European Hotels
                </h1>
              </div>
              <div>
                <ul className="space-y-1">
                  <li>
                    <a href="/" className="font-Bricolage">
                      Hotels in Bamako
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage">
                      Hotels in Batna
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage">
                      Hotels in Blantyre
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage">
                      Hotels in Bobo Dioula
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage">
                      Hotels in Biska
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <div>
                <h1 className="text-lg font-semibold mt-3 font-Bricolage">
                  Asian Hotels
                </h1>
              </div>
              <div>
                <ul className="space-y-1">
                  <li>
                    <a href="/" className="font-Bricolage">
                      Hotels in Bamako
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage">
                      Hotels in Batna
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage">
                      Hotels in Blantyre
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage">
                      Hotels in Bobo Dioula
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage">
                      Hotels in Biska
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <div>
                <h1 className="text-lg font-semibold mt-3 font-Bricolage">
                  North American Hotels
                </h1>
              </div>
              <div>
                <ul className="space-y-1">
                  <li>
                    <a href="/" className="font-Bricolage">
                      Hotels in Bamako
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage">
                      Hotels in Batna
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage">
                      Hotels in Blantyre
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage">
                      Hotels in Bobo Dioula
                    </a>
                  </li>
                  <li>
                    <a href="/" className="font-Bricolage">
                      Hotels in Biska
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex items-center justify-center lg:w-fit">
          <Image src={women} alt="" />
        </div>
      </div>
    </div>
  );
}

export default Other6;
