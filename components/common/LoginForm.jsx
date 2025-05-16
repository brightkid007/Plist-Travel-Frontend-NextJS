import Link from "next/link";
import Image from "next/image";
import logo from "/public/img/general/plist logo 1.png";

const LoginForm = () => {
  return (
    <div className="d-flex flex-column items-center">
      <Image src={logo} width={150} height={40} alt="" />
      <h1 className="fw-600 mt-20">Welcome Back</h1>
      <div className="text-light-1 fw-400 mb-30">Sign in to your account</div>
      <form className="row y-gap-20 rounded-22 border-light-1 bg-white shadow-1 px-30 py-30">
        <div className="col-12">
          <h1 className="fw-600">Sign in</h1>
          <div className="text-light-1 fw-400">
            Enter your credentials to access your account
          </div>
        </div>

        <div className="col-12">
          <h1 className="text-15 lh-14 fw-500">Email</h1>
          <input
            className="border-light rounded-8 py-5 px-15 w-full mt-10"
            type="text"
            placeholder="admin@travel.com"
          />
        </div>

        <div className="col-12">
          <h1 className="text-15 lh-14 fw-500">Password</h1>
          <input
            className="border-light rounded-8 py-5 px-15 w-full mt-10"
            type="password"
            placeholder="Enter password"
          />
        </div>

        <div className="col-12">
          <a href="#" className="text-14 fw-500 text-light-1">
            Forgot your password?
          </a>
        </div>

        <div className="col-12 d-flex flex-column items-center">
          <Link
            type="submit"
            href="/customer"
            className="button py-20 -dark-1 bg-dark-4 text-white w-100"
          >
            Login
          </Link>
          <div className="mt-10 text-light-1">
            Don&apos;t have an account yet?{" "}
            <Link href="/signup" className="text-light-1">
              Sign up
            </Link>
          </div>
        </div>
        {/* End .col */}
      </form>
    </div>
  );
};

export default LoginForm;
