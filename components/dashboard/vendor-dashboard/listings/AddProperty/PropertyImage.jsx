import ImageUploadForm from "@/components/dashboard/vendor-dashboard/common/ImageUploadForm";

const PropertyImage = () => {
  return (
    <div className="row y-gap-20 x-gap-10">
      <h1 className="text-20 lh-14 fw-600">Image</h1>

      <div className="col-12">
        <ImageUploadForm />
      </div>

      <div className="col-12">
        <h1 className="text-14 lh-12 fw-500">Video from</h1>
        <select className="form-select rounded-8 border-light px-15 py-10 justify-between text-14 w-full mt-10">
          <option value="youtube">Youtube</option>
          <option value="vimeo">Vimeo</option>
        </select>
      </div>

      <div className="col-sm-6">
        <h1 className="text-14 lh-12 fw-500">Video id:</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Enter Video ID"
        />
      </div>

      <div className="col-sm-6">
        <h1 className="text-14 lh-12 fw-500">Video id:</h1>
        <input
          className="border-light rounded-8 py-5 px-15 w-full mt-10"
          type="text"
          placeholder="Enter Video ID"
        />
      </div>
    </div>
  );
};

export default PropertyImage;
