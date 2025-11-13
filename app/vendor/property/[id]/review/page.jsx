"use client";

import dynamic from "next/dynamic";
import VendorDashboardLayout from "@/components/vendor/common/layout";
import { useState } from "react";
import { useRouter } from "next/navigation";

const index = () => {
  const [activeStep, setActiveStep] = useState(1);
  const steps = [
    { id: 1, content: <Review key="review" setActiveStep={setActiveStep} /> },
    { id: 2, content: <Publish key="publish" /> },
  ];
  return (
    <VendorDashboardLayout>
      <div className="row y-gap-20 justify-between items-end pb-20 lg:pb-40 md:pb-32">
        {steps.map((step) => step.id === activeStep && step.content)}
      </div>
    </VendorDashboardLayout>
  );
};

const Review = ({ setActiveStep }) => {
  return (
    <>
      <div className="col-12">
        <h1 className="text-24 lh-14 fw-600">
          You are almost there - Let's review your listing before you go live
        </h1>
      </div>
      <div className="col-12 px-15">
        <div className="bg-white border-light rounded-8 px-20 py-20">
          <div className="row x-gap-20 y-gap-20">
            <h1 className="text-20 lh-1 fw-500">Listing Basic</h1>
            <div className="border-top-light">
              <div className="text-15 fw-500 lh-14">Location</div>
              <div className="text-14 text-light-1 lh-14">
                3208 Long Rope Ln, 3210, Denton, TX, 76209. US
              </div>
            </div>

            <div className="border-top-light">
              <div className="d-flex justify-between items-center">
                <div className="text-15 fw-500 lh-14">Title</div>
                <div className="btn btn-link text-14 py-0">Edit</div>
              </div>
              <div className="text-14 text-light-1 lh-14">
                Luxurious & Spacious 4 Bed Duplex Getaway with Pool Table in
                fabulous Denton TX
              </div>
            </div>

            <div className="border-top-light">
              <div className="d-flex justify-between items-center">
                <div className="text-15 fw-500 lh-14">Description</div>
                <div className="btn btn-link text-14 py-0">Edit</div>
              </div>
              <div className="text-14 text-light-1 lh-14">
                We are thrilled to have you stay with us. Get ready to relax in
                this 4-bedroom Duplex in Denton. Our spacious duplex offers the
                perfect blend of comfort and convenience, just minutes away from
                the University of North Texas (UNT) and Texas Woman's University
                (TWU). Whether you're here for a campus visit, business, or
                leisure, we hope you enjoy your stay and make the most of our
                prime location and amenities. The elegant 4 Bed duplex retreat
                offers an open-concept living area with a pool table
                downstairs-perfect for relaxing or entertaining. This pleasant
                retreat offers 1 king bed and 3 queen beds, perfect for a serene
                getaway. With amenities like Pool table, AC, heating, Wi-Fi, a
                washing machine and dryer, guests can enjoy a tremendous stay.
                Experience the magic of Denton TX at our duplex villa
              </div>
            </div>

            <div className="border-top-light">
              <div className="d-flex justify-between items-center">
                <div className="text-15 fw-500 lh-14">Essential Amenities</div>
                <div className="btn btn-link text-14 py-0">Edit</div>
              </div>
              <div className="row x-gap-10 y-gap-10 mt-5">
                <div className="col-sm-6 text-14 lh-1">Air conditioning</div>
                <div className="col-sm-6 text-14 lh-1">Basic soaps</div>
                <div className="col-sm-6 text-14 lh-1">Clothes dryer</div>
                <div className="col-sm-6 text-14 lh-1">Heating</div>
                <div className="col-sm-6 text-14 lh-1">Iron & board</div>
                <div className="col-sm-6 text-14 lh-1">Linens provided</div>
                <div className="col-sm-6 text-14 lh-1">Toilet paper</div>
                <div className="col-sm-6 text-14 lh-1">Washing machine</div>
                <div className="col-sm-6 text-14 lh-1">Wireless internet</div>
              </div>
            </div>

            <div className="border-top-light">
              <div className="d-flex justify-between items-center">
                <div className="text-15 fw-500 lh-14">Safety devices</div>
                <div className="btn btn-link text-14 py-0">Edit</div>
              </div>
              <div className="row x-gap-10 y-gap-10 mt-5">
                <div className="col-sm-6 text-14 lh-1">Smoke Detector</div>
                <div className="col-sm-6 text-14 lh-1">
                  Carbon monoxide detector
                </div>
              </div>
            </div>

            <div className="border-top-light">
              <div className="d-flex justify-between items-center">
                <div className="text-15 fw-500 lh-14">Photos</div>
                <div className="btn btn-link text-14 py-0">Edit</div>
              </div>
              <div className="text-14 text-light-1 lh-14">
                No Image Uploaded
              </div>
            </div>

            <div className="border-top-light d-flex justify-end">
              <button
                className="text-white bg-blue-1 rounded-8 px-15 py-5 text-14"
                onClick={() => setActiveStep(2)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Publish = () => {
  const router = useRouter();

  return (
    <>
      <div className="col-12">
        <h1 className="text-24 lh-14 fw-600">You are ready to go live!</h1>
        <div className="text-14 text-light-1 lh-14">
          Once your list is live, you'll be able to update your listing, adjust
          your avilaibility, and change your policies.
        </div>
      </div>
      <div className="col-auto">
        <button className="text-white bg-blue-1 rounded-8 px-15 py-5 text-14" 
        onClick={() => {
          router.push("/vendor/listings/property");
        }}>
          Go live
        </button>
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(index), {
  ssr: false,
});
