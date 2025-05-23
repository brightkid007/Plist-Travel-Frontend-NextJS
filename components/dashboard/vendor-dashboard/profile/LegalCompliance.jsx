import { useState } from "react";
import FileUploadForm from "./components/FileUploadForm";

const LegalCompliance = () => {
  const [licenses, setLicenses] = useState(1);
  const [certificates, setCertificates] = useState(1);
  return (
    <div className="row y-gap-15 bg-white px-10 py-20 rounded-8">
      <div className="text-20 fw-600 lh-1">
        Legal and Compliance Documentation
      </div>
      <div className="text-12 text-light-1 lh-1">
        Upload all required legal documents and certifications for your
        business.
      </div>
      <div className="col-12">
        <div className="row justify-between items-center">
          <div className="text-18 fw-500 mt-10 col-auto">Business Licenses</div>
          <div className="d-flex col-sm-auto">
            <button
              className="button border-light rounded-4 text-13 fw-500 px-10 py-5"
              onClick={() => setLicenses(licenses + 1)}
            >
              <span className="material-symbols-outlined mr-10 text-15 fw-500">
                add_circle
              </span>
              Add License
            </button>
          </div>
        </div>
        {Array.from({ length: licenses }).map((_, index) => (
          <div
            className="col-12 border-light rounded-8 px-15 py-15 mt-10"
            key={index}
          >
            <div className="row justify-between items-center y-gap-10">
              <div className="col-md-4 col-sm-12">
                <h1 className="text-13 lh-14 fw-500">License Name</h1>
                <input
                  className="border-light rounded-8 py-5 px-15 w-full mt-5"
                  type="text"
                  placeholder="Enter License Name"
                />
              </div>
              <div className="col-md-8 col-sm-12">
                <h1 className="text-13 lh-14 fw-500">Description</h1>
                <input
                  className="border-light rounded-8 py-5 px-15 w-full mt-5"
                  type="text"
                  placeholder="Enter Description"
                />
              </div>
              <FileUploadForm
                placeholder={"Upload License"}
                count={licenses}
                setCount={setLicenses}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="col-12">
        <div className="row justify-between items-center">
          <div className="text-18 fw-500 mt-10 col-auto">
            Insurance Certificates
          </div>
          <div className="d-flex col-sm-auto">
            <button
              className="button border-light rounded-4 text-13 fw-500 px-10 py-5"
              onClick={() => setCertificates(licenses + 1)}
            >
              <span className="material-symbols-outlined mr-10 text-15 fw-500">
                add_circle
              </span>
              Add Certificate
            </button>
          </div>
        </div>
        {Array.from({ length: certificates }).map((_, index) => (
          <div
            className="col-12 border-light rounded-8 px-15 py-15 mt-10"
            key={index}
          >
            <div className="row justify-between items-center y-gap-10">
              <div className="col-md-4 col-sm-12">
                <h1 className="text-13 lh-14 fw-500">Certificate Name</h1>
                <input
                  className="border-light rounded-8 py-5 px-15 w-full mt-5"
                  type="text"
                  placeholder="Enter Certificate Name"
                />
              </div>
              <div className="col-md-8 col-sm-12">
                <h1 className="text-13 lh-14 fw-500">Description</h1>
                <input
                  className="border-light rounded-8 py-5 px-15 w-full mt-5"
                  type="text"
                  placeholder="Enter Description"
                />
              </div>
              <FileUploadForm
                placeholder={"Upload Certificate"}
                count={certificates}
                setCount={setCertificates}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="col-md-6 col-sm-12">
        <h1 className="text-13 lh-14 fw-500">Tax Identification Number</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-5"
          type="text"
          placeholder="Enter Tax Identification Number"
        />
      </div>

      <div className="col-md-6 col-sm-12">
        <h1 className="text-13 lh-14 fw-500">Compliance Certifications</h1>
        <FileUploadForm placeholder={"Compliance certification details"} />
      </div>

      <div className="d-flex justify-end mt-20 border-top-light pt-15">
        <button className="button border-light rounded-8 text-12 py-10 px-15 mr-10">
          Cancel
        </button>
        <button className="button bg-blue-1 text-white rounded-8 text-12 py-10 px-15">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default LegalCompliance;
