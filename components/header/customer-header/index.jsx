
'use client'

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import MainMenu from "../MainMenu";
import CurrenctyMegaMenu from "../CurrenctyMegaMenu";
import LanguageMegaMenu from "../LanguageMegaMenu";
import MobileMenu from "../MobileMenu";

const Header1 = () => {
  const [navbar, setNavbar] = useState(false);

  const changeBackground = () => {
    if (window.scrollY >= 10) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
    return () => {
      window.removeEventListener("scroll", changeBackground);
    };
  }, []);

  return (
    <>
      <header className={`header bg-dark-1 ${navbar ? "is-sticky" : ""}`}>
        <div className="header__container px-30 sm:px-20">
          <div className="row justify-between items-center">
            <div className="col-auto">
              <div className="d-flex items-center">
                <a href="/" className="header-logo mr-20">
                  <img src="/img/general/plist logo 1.png" alt="logo icon" />
                  {/* <img src="/img/general/logo-light.svg" alt="logo icon" />
                  <img src="/img/general/logo-dark.svg" alt="logo icon" /> */}
                </a>
                {/* End logo */}

                <div className="header-menu">
                  <div className="header-menu__content">
                    <MainMenu style="text-white" />
                  </div>
                </div>
                {/* End header-menu */}
              </div>
              {/* End d-flex */}
            </div>
            {/* End col */}

            <div className="col-auto">
              <div className="d-flex items-center">
                <div className="row x-gap-20 items-center xxl:d-none">
                  <CurrenctyMegaMenu textClass="text-white" />

                  <div className="col-auto">
                    <div className="w-1 h-20 bg-white-20" />
                  </div>

                  <LanguageMegaMenu textClass="text-white" />
                </div>


                <div className="row items-center x-gap-5 y-gap-20 pl-20 lg:d-none">
                  <div className="col-auto">
                    <button className="button -blue-1-05 text-white size-50 rounded-22 flex-center">
                      <i className="icon-email-2 text-20"></i>
                    </button>
                  </div>

                  <div className="col-auto">
                    <button className="button -blue-1-05 size-50 text-white rounded-22 flex-center">
                      <i className="icon-notification text-20"></i>
                    </button>
                  </div>
                </div>

                <div className="pl-15">
                  <Image
                    width={50}
                    height={50}
                    src="/img/avatars/3.webp"
                    alt="image"
                    className="size-50 rounded-22 object-cover"
                  />
                </div>

                {/* Start mobile menu icon */}
                <div className="d-none xl:d-flex x-gap-20 items-center pl-30 text-white">
                  <div>
                    <Link
                      href="/login"
                      className="d-flex items-center icon-user text-inherit text-22"
                    />
                  </div>
                  <div>
                    <button
                      className="d-flex items-center icon-menu text-inherit text-20"
                      data-bs-toggle="offcanvas"
                      aria-controls="mobile-sidebar_menu"
                      data-bs-target="#mobile-sidebar_menu"
                    />

                    <div
                      className="offcanvas offcanvas-start  mobile_menu-contnet "
                      tabIndex="-1"
                      id="mobile-sidebar_menu"
                      aria-labelledby="offcanvasMenuLabel"
                      data-bs-scroll="true"
                    >
                      <MobileMenu />
                      {/* End MobileMenu */}
                    </div>
                  </div>
                </div>
                {/* End mobile menu icon */}
              </div>
            </div>
            {/* End col-auto */}
          </div>
          {/* End .row */}
        </div>
        {/* End header_container */}
      </header>
    </>
  );
};

export default Header1;
