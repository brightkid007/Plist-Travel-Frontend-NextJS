import { useState } from "react";
import ImageUploadForm from "@/components/vendor/common/ImageUploadForm";
import { Close } from "@mui/icons-material";

const Image = ({ images = [], onImagesChange }) => {
  const handleImageAdd = (file) => {
    if (onImagesChange) {
      onImagesChange([...images, file]);
    }
  };

  const handleImageRemove = (index) => {
    if (onImagesChange) {
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
    }
  };

  return (
    <div className="row y-gap-20 x-gap-10">
      <h1 className="text-20 lh-14 fw-600">Photos</h1>

      <div className="col-12">
        <ImageUploadForm onFileSelect={handleImageAdd} />
      </div>

      {images.length > 0 && (
        <div className="col-12">
          <h2 className="text-16 lh-14 fw-500 mb-10">Selected Images ({images.length})</h2>
          <div className="row y-gap-10 x-gap-10">
            {images.map((file, index) => (
              <div key={index} className="col-sm-3 position-relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-150 object-cover rounded-8 border-light"
                />
                <button
                  onClick={() => handleImageRemove(index)}
                  className="position-absolute bg-red-1 text-white rounded-circle size-30 cursor-pointer"
                  style={{top: "10px", right: "10px"}}
                >
                  <Close sx={{ fontSize: "20px" }} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* <div className="col-12">
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
      </div> */}
    </div>
  );
};

export default Image;
