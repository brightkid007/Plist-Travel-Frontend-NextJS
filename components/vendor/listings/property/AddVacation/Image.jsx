import { useState } from "react";
import ImageUploadForm from "@/components/vendor/common/ImageUploadForm";
import { Close } from "@mui/icons-material";
import { deleteMediaAsset } from "@/helpers/backend_helper";
import { toast } from "react-toastify";

const Image = ({ images = [], existingImages = [], onImagesChange, onExistingImagesChange, listingId }) => {
  const [deletingImageId, setDeletingImageId] = useState(null);

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

  const handleExistingImageRemove = async (imageId, index) => {
    if (!imageId || !listingId) return;

    try {
      setDeletingImageId(imageId);
      await deleteMediaAsset(imageId);
      // Remove from existing images list and notify parent
      const updatedExisting = existingImages.filter((img) => img.id !== imageId);
      if (onExistingImagesChange) {
        onExistingImagesChange(updatedExisting);
      }
      toast.success("Image deleted successfully");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error(error?.message || "Failed to delete image");
    } finally {
      setDeletingImageId(null);
    }
  };

  const getImageUrl = (image) => {
    // If it's a file object, create object URL
    if (image instanceof File) {
      return URL.createObjectURL(image);
    }
    // If it's an existing image with URL, use the full URL
    if (image.url) {
      // Check if URL is already complete or needs base URL
      if (image.url.startsWith("http")) {
        return image.url;
      }
      // Assuming backend URL pattern
      return `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081"}${image.url}`;
    }
    return null;
  };

  return (
    <div className="row y-gap-20 x-gap-10">
      <h1 className="text-20 lh-14 fw-600">Photos</h1>

      <div className="col-12">
        <ImageUploadForm onFileSelect={handleImageAdd} />
      </div>

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div className="col-12">
          <h2 className="text-16 lh-14 fw-500 mb-10">Existing Images ({existingImages.length})</h2>
          <div className="row y-gap-10 x-gap-10">
            {existingImages.map((image, index) => (
              <div key={image.id || index} className="col-sm-3 position-relative">
                <img
                  src={getImageUrl(image)}
                  alt={`Existing ${index + 1}`}
                  className="w-full h-150 object-cover rounded-8 border-light"
                  onError={(e) => {
                    e.target.src = "/placeholder-image.png"; // Fallback image
                  }}
                />
                {listingId && image.id && (
                  <button
                    onClick={() => handleExistingImageRemove(image.id, index)}
                    className="position-absolute bg-red-1 text-white rounded-circle size-30 cursor-pointer"
                    style={{ top: "10px", right: "10px" }}
                    disabled={deletingImageId === image.id}
                  >
                    {deletingImageId === image.id ? (
                      <div className="size-20 border-2 border-white border-t-transparent rounded-circle animate-spin" />
                    ) : (
                      <Close sx={{ fontSize: "20px" }} />
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Images to Upload */}
      {images.length > 0 && (
        <div className="col-12">
          <h2 className="text-16 lh-14 fw-500 mb-10">New Images to Upload ({images.length})</h2>
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
                  style={{ top: "10px", right: "10px" }}
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
