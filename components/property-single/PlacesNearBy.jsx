import { useState } from "react";

const PlacesNearBy = () => {
  const [needMore, setNeedMore] = useState(true);
  return (
    <div className="row x-gap-30">
      <div className="col-lg-4 col-md-12 px-20 py-10">
        <div className="d-flex flex-column h-100">
          <div className="d-flex items-center mb-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20px"
            >
              <path d="M12.974 3.554a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0m1.5 0a3.375 3.375 0 1 0-6.75 0 3.375 3.375 0 0 0 6.75 0m3.675 7.496a1.49 1.49 0 0 1-1.168-.56 8.45 8.45 0 0 0-6.634-3.19A6.756 6.756 0 0 0 3.6 14.05a2.25 2.25 0 1 0 4.5 0 2.255 2.255 0 0 1 1.689-2.174L9.6 11.15h-.75v.5a15.57 15.57 0 0 1-2.622 8.66 2.252 2.252 0 1 0 3.748 2.496 20.2 20.2 0 0 0 2.336-4.768l-1.111.396a7.3 7.3 0 0 1 3.018 3.838c.343 1.165 1.595 1.846 2.787 1.494a2.25 2.25 0 0 0 1.47-2.944 11.77 11.77 0 0 0-5.785-6.712l.398.788c.175-1.074.263-2.16.263-3.248v-.03h-.75l-.356.66a4 4 0 0 1 1.223 1.022 5.97 5.97 0 0 0 4.688 2.252 2.25 2.25 0 0 0-.002-4.5v.75l.6-.45-.003-.004a.75.75 0 0 0-.602-.3zm.004 1.5-.002-.75-.6.45.003.004a.75.75 0 0 0 .6.3.75.75 0 0 1 0 1.5 4.47 4.47 0 0 1-3.513-1.687 5.5 5.5 0 0 0-1.684-1.407.75.75 0 0 0-1.106.66v.03c0 1.007-.081 2.012-.243 3.006a.75.75 0 0 0 .398.788 10.3 10.3 0 0 1 5.081 5.952.75.75 0 0 1-1.439.425A8.8 8.8 0 0 0 12 17.166a.75.75 0 0 0-1.111.396 18.7 18.7 0 0 1-2.162 4.412.752.752 0 0 1-1.252-.832 17.07 17.07 0 0 0 2.874-9.493v-.499a.75.75 0 0 0-.939-.726 3.756 3.756 0 0 0-2.81 3.624.75.75 0 1 1-1.5.002 5.256 5.256 0 0 1 5.25-5.25 6.95 6.95 0 0 1 5.459 2.624 2.99 2.99 0 0 0 2.345 1.126z"></path>
            </svg>
            <div className="text-18 fw-600 ml-10">What's nearby</div>
          </div>
          <div className="d-flex justify-between items-center mb-5">
            <span className="text-14">PEB Field</span>
            <span className="text-14 text-light-1">1.5 km</span>
          </div>
          <div className="d-flex justify-between items-center mb-5">
            <span className="text-14">Intramural Fields</span>
            <span className="text-14 text-light-1">2.1 km</span>
          </div>
          <div className="d-flex justify-between items-center mb-5">
            <span className="text-14">North Texas State Fair and Rodeo</span>
            <span className="text-14 text-light-1">4.3 km</span>
          </div>
        </div>
      </div>
      <div className="col-lg-4 col-md-12 px-20 py-10">
        <div className="d-flex flex-column h-100">
          <div className="d-flex items-center mb-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20px"
            >
              <path d="M5.999.75v22.5a.75.75 0 0 0 1.5 0V.75a.75.75 0 0 0-1.5 0m3 0V7.5a2.26 2.26 0 0 1-2.252 2.25 2.26 2.26 0 0 1-2.248-2.252V.75a.75.75 0 0 0-1.5 0V7.5a3.76 3.76 0 0 0 3.748 3.75 3.76 3.76 0 0 0 3.752-3.748V.75a.75.75 0 0 0-1.5 0m6.75 15.75h3c1.183.046 2.203-.9 2.25-2.111a2 2 0 0 0 0-.168c-.25-6.672-.828-9.78-3.231-13.533a1.508 1.508 0 0 0-2.77.81V23.25a.75.75 0 0 0 1.5 0V1.503c0 .003.001 0 .003 0l.008.002c2.21 3.45 2.75 6.354 2.99 12.773v.053a.696.696 0 0 1-.721.67L15.749 15a.75.75 0 0 0 0 1.5"></path>
            </svg>
            <div className="text-18 fw-600 ml-10">Restaurants & cafes</div>
          </div>
          <div className="d-flex justify-between items-center mb-5">
            <span className="text-14">
              <span className="text-light-1">Restaurant &middot; </span>Layalina
              Mediterranean Restaurant and Lounge
            </span>
            <span className="text-14 text-light-1 flex-shrink-0 ml-10">
              100 m
            </span>
          </div>
          <div className="d-flex justify-between items-center mb-5">
            <span className="text-14">
              <span className="text-light-1">Restaurant &middot; </span>
              Whataburger
            </span>
            <span className="text-14 text-light-1 flex-shrink-0 ml-10">
              100 m
            </span>
          </div>
          <div className="d-flex justify-between items-center mb-5">
            <span className="text-14">
              <span className="text-light-1">Restaurant &middot; </span> Taco
              Bell
            </span>
            <span className="text-14 text-light-1 flex-shrink-0 ml-10">
              100 m
            </span>
          </div>
          <div className="d-flex items-center mb-10 mt-40">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 128 128"
              width="20px"
            >
              <path d="m127.5 104.38-45.33-82a4 4 0 0 0-.33-.5 11 11 0 0 0-2-2c-4.7-3.567-11.398-2.674-15 2a3.6 3.6 0 0 0-.33.5l-25.44 46-7.87-10.47a4 4 0 0 0-6.75.55l-24 46A4 4 0 0 0 4 110.31h120a4 4 0 0 0 3.5-5.93M71.32 26.57a2.73 2.73 0 0 1 3.68-.32q.193.14.35.32L89 51.35l-7.33 6.87-2.54-2.84a7.85 7.85 0 0 0-5.83-2.68 7.88 7.88 0 0 0-5.87 2.68l-2.54 2.83-7.24-6.91zM28.61 67.79l6.21 8.28-14.51 26.24H10.6zm.84 34.52L42.83 78.1q.295-.4.48-.86l10.34-18.7 5.86 5.6a7.78 7.78 0 0 0 5.71 2.17 7.9 7.9 0 0 0 5.56-2.67l2.52-2.83 2.53 2.83a7.85 7.85 0 0 0 5.55 2.67h.32a7.75 7.75 0 0 0 5.37-2.17l6-5.58 24.19 43.74z"></path>
            </svg>
            <div className="text-18 fw-600 ml-10">Natural beauty</div>
          </div>
          <div className="d-flex justify-between items-center mb-5">
            <span className="text-14">
              <span className="text-light-1">Lake &middot; </span>Unicorn Lake
            </span>
            <span className="text-14 text-light-1 flex-shrink-0 ml-10">
              5 km
            </span>
          </div>
          <div className="d-flex justify-between items-center mb-5">
            <span className="text-14">
              <span className="text-light-1">Peak &middot; </span>
              Bald Knob (207m)
            </span>
            <span className="text-14 text-light-1 flex-shrink-0 ml-10">
              8 km
            </span>
          </div>
        </div>
      </div>
      <div className="col-lg-4 col-md-12 px-20 py-10">
        <div className="d-flex flex-column h-100">
          <div className="d-flex items-center mb-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20px"
            >
              <path d="M5.75 1.513h12.5c.69 0 1.25.56 1.25 1.25v13.5a.25.25 0 0 1-.25.25H4.75a.25.25 0 0 1-.25-.25v-13.5c0-.69.56-1.25 1.25-1.25m0-1.5A2.75 2.75 0 0 0 3 2.763v13.5c0 .966.784 1.75 1.75 1.75h14.5a1.75 1.75 0 0 0 1.75-1.75v-13.5a2.75 2.75 0 0 0-2.75-2.75zm-3.65 23.7 2.25-3a.75.75 0 1 0-1.2-.9l-2.25 3a.75.75 0 1 0 1.2.9m21-.9-2.25-3a.75.75 0 1 0-1.2.9l2.25 3a.75.75 0 1 0 1.2-.9m-19.35-12.3h16.5a.75.75 0 0 0 0-1.5H3.75a.75.75 0 0 0 0 1.5m7.5-9.75v9a.75.75 0 0 0 1.5 0v-9a.75.75 0 0 0-1.5 0m-7.5 12.75H7.5a.75.75 0 0 0 0-1.5H3.75a.75.75 0 0 0 0 1.5m16.5-1.5H16.5a.75.75 0 0 0 0 1.5h3.75a.75.75 0 0 0 0-1.5M8.92 17.598l1.5-3-.67.415h4.5l-.67-.415 1.5 3a.75.75 0 1 0 1.34-.67l-1.5-3a.75.75 0 0 0-.67-.415h-4.5a.75.75 0 0 0-.67.415l-1.5 3a.75.75 0 1 0 1.34.67"></path>
            </svg>
            <div className="text-18 fw-600 ml-10">Public transports</div>
          </div>
          <div className="d-flex justify-between items-center mb-5">
            <span className="text-14">
              <span className="text-light-1">Train &middot; </span>Downtown
              Denton
            </span>
            <span className="text-14 text-light-1 flex-shrink-0 ml-10">
              2.5 km
            </span>
          </div>
          <div className="d-flex justify-between items-center mb-5">
            <span className="text-14">
              <span className="text-light-1">Train &middot; </span>Downtown
              Denton
            </span>
            <span className="text-14 text-light-1 flex-shrink-0 ml-10">
              2.5 km
            </span>
          </div>
          <div className="d-flex items-center mb-10 mt-40">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20px"
            >
              <path d="M18.33 3.57 5.7 9.955l.79.07-1.96-1.478a.75.75 0 0 0-.753-.087l-2.1.925C.73 9.856.359 10.967.817 11.88c.11.22.263.417.45.577l3.997 3.402a2.94 2.94 0 0 0 3.22.4l3.62-1.8-1.084-.671v5.587a1.833 1.833 0 0 0 2.654 1.657l1.88-.932a1.85 1.85 0 0 0 .975-1.226l1.87-7.839-.396.498 3.441-1.707a3.494 3.494 0 1 0-3.11-6.259zm.672 1.342a1.994 1.994 0 0 1 1.775 3.571l-3.44 1.707a.75.75 0 0 0-.396.498l-1.87 7.838a.35.35 0 0 1-.185.232l-1.88.932a.335.335 0 0 1-.486-.304V13.79a.75.75 0 0 0-1.084-.672l-3.62 1.8a1.44 1.44 0 0 1-1.578-.197l-3.997-3.402a.35.35 0 0 1 .073-.577l2.067-.91-.754-.087 1.96 1.478a.75.75 0 0 0 .79.07l12.63-6.383zm-3.272.319-4.46-2.26a1.85 1.85 0 0 0-1.656-.001l-1.846.912a1.85 1.85 0 0 0-.295 3.128l2.573 1.955a.75.75 0 1 0 .908-1.194L8.38 5.816a.35.35 0 0 1 .055-.591l1.845-.912a.35.35 0 0 1 .315 0l4.456 2.256a.75.75 0 0 0 .678-1.338z"></path>
            </svg>
            <div className="text-18 fw-600 ml-10">Closest airports</div>
          </div>
          <div className="d-flex justify-between items-center mb-5">
            <span className="text-14">Fort Worth Alliance Airport</span>
            <span className="text-14 text-light-1 flex-shrink-0 ml-10">
              31 km
            </span>
          </div>
          <div className="d-flex justify-between items-center mb-5">
            <span className="text-14">
              Dallas-Fort Worth International Airport
            </span>
            <span className="text-14 text-light-1 flex-shrink-0 ml-10">
              40 km
            </span>
          </div>
          <div className="d-flex justify-between items-center mb-5">
            <span className="text-14">Addison Airport</span>
            <span className="text-14 text-light-1 flex-shrink-0 ml-10">
              41 km
            </span>
          </div>
        </div>
      </div>
      <div className="col-12 text-12">
        Shortest estimated walking or driving distances displayed, actual
        distances may vary.
      </div>
      {needMore ? (
        <div className="col-12 text-14 text-end">
          Missing some information?
          <button className="btn btn-link text-blue-1 fw-600 pr-0">Yes</button>/
          <button
            className="btn btn-link text-blue-1 fw-600 px-0"
            onClick={() => setNeedMore(false)}
          >
            No
          </button>
        </div>
      ) : (
        <div className="col-12 text-14 text-end">
          Great! Thanks for your response.
        </div>
      )}
    </div>
  );
};

export default PlacesNearBy;
