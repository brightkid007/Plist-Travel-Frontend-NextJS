import { useState } from "react";
import svgIcon from "../data/svgIcon";

const PlacesNearBy = () => {
  const [needMore, setNeedMore] = useState(true);
  return (
    <div className="row x-gap-30">
      <div className="col-lg-4 col-md-12 px-20 py-10">
        <div className="d-flex flex-column h-100">
          <div className="d-flex items-center mb-10">
            {svgIcon.walk_man}
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
            {svgIcon.restaurant}
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
            {svgIcon.mountain}
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
            {svgIcon.tram_front}
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
            {svgIcon.airport_plane}
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
