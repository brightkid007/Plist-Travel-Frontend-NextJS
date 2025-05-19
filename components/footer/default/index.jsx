import AppButton from "./AppButton";
import ContactInfo from "./ContactInfo";
import Copyright from "./Copyright";
import FooterContent from "./FooterContent";
import Image from "next/image";
import whiteLogo from "/public/Images/whiteLogo.png";
import sendIcon from "/public/Images/send-Icon.svg";

const index = () => {
  return (
    <footer className="footer -type-1" style={{ backgroundImage: `url('/Images/Footer-BG.png')` }}>
      <div className="container text-white" >
        <div className="pt-60 pb-60">
          <div className="row y-gap-40 justify-between xl:justify-start">
            <div className="col-xl-2 col-lg-4 col-sm-6">
              <Image
                src={whiteLogo}
                alt=""
                className="lg:w-[140px] md:w-[100px] lg:h-[55px] md:h-[40px] w-[70px] h-[30px]"
              />
              {/* <h5 className="text-16 fw-500 mb-30">Contact Us</h5> */}
              <div>
                <input
                  name="search"
                  placeholder="Enter Email"
                  className="rounded-16"
                />
                <Image src={sendIcon} alt="sendIcon" unoptimized />
              </div>
              
              <ContactInfo />
            </div>
            {/* End col */}

            <FooterContent />
            {/* End footer menu content */}

            <div className="col-xl-2 col-lg-4 col-sm-6">
              <h5 className="text-16 fw-500 mb-30">Mobile</h5>
              <AppButton />
            </div>
          </div>
        </div>
        {/* End footer top */}

        <div className="py-20 border-top-light">
          <Copyright />
        </div>
        {/* End footer-copyright */}
      </div>
      {/* End container */}
    </footer>
  );
};

export default index;
