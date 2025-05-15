"use client";

import LoginForm from "@/components/common/LoginForm";
import dynamic from "next/dynamic";
import { useMediaQuery } from "react-responsive";

const Login = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 1023px)" });
  return (
    <div
      className="row"
      style={{
        height: "100vh",
        backgroundImage: "url('/img/backgrounds/login_bg.jpg')",
      }}
    >
      {!isMobile && (
        <div className="col-6 px-0">
          {/* <img
            src={"/img/backgrounds/login_bg.jpg"}
            alt=""
            className="w-full h-full object-cover object-left"
          /> */}
        </div>
      )}
      <div
        className={
          (isMobile ? "col-12" : "col-6") +
          " px-0 h-100 d-flex justify-content-center align-items-center"
        }
      >
        <div className="w-75 mx-auto">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Login), {
  ssr: false,
});
