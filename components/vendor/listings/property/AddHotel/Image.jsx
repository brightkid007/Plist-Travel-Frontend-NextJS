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
      if (image.url.startsWith("http://") || image.url.startsWith("https://")) {
        return image.url;
      }
      // Assume it's a relative path, prepend API base URL if needed
      // For now, return as-is - backend should provide full URL
      return image.url;
    }
    return "";
  };

  return (
    <div className="row y-gap-20 x-gap-10">
      <h1 className="text-20 lh-14 fw-600">Photos</h1>

      {/* Image Upload Form */}
      <div className="col-12">
        <ImageUploadForm
          onFileSelect={handleImageAdd}
          multiple={true}
        />
      </div>

      {/* Display uploaded images (preview before save) */}
      {images.length > 0 && (
        <div className="col-12">
          <h1 className="text-14 lh-12 fw-500 mb-10">New Images (to be uploaded)</h1>
          <div className="row y-gap-10 x-gap-10">
            {images.map((image, index) => (
              <div key={index} className="col-sm-3 position-relative">
                <div className="border-light rounded-8 overflow-hidden" style={{ aspectRatio: "16/9" }}>
                  <img
                    src={getImageUrl(image)}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  className="position-absolute top-5 right-5 bg-red-1 text-white rounded-full p-5 cursor-pointer border-none"
                  onClick={() => handleImageRemove(index)}
                  style={{
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Close style={{ fontSize: "16px" }} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Display existing images (from database) */}
      {existingImages.length > 0 && (
        <div className="col-12">
          <h1 className="text-14 lh-12 fw-500 mb-10">Existing Images</h1>
          <div className="row y-gap-10 x-gap-10">
            {existingImages.map((image, index) => (
              <div key={image.id || index} className="col-sm-3 position-relative">
                <div className="border-light rounded-8 overflow-hidden" style={{ aspectRatio: "16/9" }}>
                  <img
                    src={getImageUrl(image)}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                {listingId && (
                  <button
                    className="position-absolute top-5 right-5 bg-red-1 text-white rounded-full p-5 cursor-pointer border-none"
                    onClick={() => handleExistingImageRemove(image.id, index)}
                    disabled={deletingImageId === image.id}
                    style={{
                      width: "24px",
                      height: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {deletingImageId === image.id ? (
                      <div className="spinner-border spinner-border-sm text-white" role="status">
                        <span className="visually-hidden">Deleting...</span>
                      </div>
                    ) : (
                      <Close style={{ fontSize: "16px" }} />
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video section - optional for hotels */}
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

export default Image;
