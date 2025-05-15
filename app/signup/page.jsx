"use client";

import SignUpForm from "@/components/common/SignUpForm";
import dynamic from "next/dynamic";
import { useMediaQuery } from "react-responsive";

// export const metadata = {
//   title: "Sign Up || Plist Travel",
//   description: "New to Plist? Sing Up Here",
// };

const SignUp = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 1023px)" });
  return (
    <div
      className="row"
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/img/backgrounds/login_bg.jpg')",
      }}
    >
      {!isMobile && (
        <div className="col-6 h-100 px-0">
          {/* <img
            src={"/img/backgrounds/login_bg.jpg"}
            alt=""
            className="w-full h-full object-cover"
            style={{objectPosition: "left"}}
          /> */}
        </div>
      )}
      <div
        style={{ minHeight: "100vh" }}
        className={
          (isMobile ? "col-12" : "col-6") +
          " px-0 d-flex justify-content-center align-items-center"
        }
      >
        <div className="w-75 my-4 mx-auto">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(SignUp), {
  ssr: false,
});
