"use client";

import GoogleMapReact from "google-map-react";

const AnyReactComponent = ({ text }) => <div>{text}</div>;

export default function MapFinder() {
  const defaultProps = {
    center: {
      lat: 40.7128,
      lng: -74.006,
    },
    zoom: 11,
  };

  return (
    // Important! Alwys set the container height explicitlya

    <GoogleMapReact
      bootstrapURLKeys={{ key: "" }}
      defaultCenter={defaultProps.center}
      defaultZoom={defaultProps.zoom}
    >
      <AnyReactComponent lat={40.7128} lng={-74.006} text="" />
    </GoogleMapReact>
  );
}
