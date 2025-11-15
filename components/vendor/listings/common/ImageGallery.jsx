import { useState } from "react";
import ImageUploadForm from "@/components/vendor/common/ImageUploadForm";
import { deleteMediaAsset } from "@/helpers/backend_helper";
import { toast } from "react-toastify";
import { getImageUrl } from "@/utils/imageUtils";
import ImageGrid from "./ImageGrid";

/**
 * Reusable Image Gallery Component
 * Handles both existing images (from database) and new images (to be uploaded)
 * @param {Object} props
 * @param {Array<File>} props.images - Array of new File objects to be uploaded
 * @param {Array<Object>} props.existingImages - Array of existing image objects from database
 * @param {Function} props.onImagesChange - Callback when new images change (receives array of Files)
 * @param {Function} props.onExistingImagesChange - Callback when existing images change (receives array of image objects)
 * @param {number|string} props.listingId - Listing ID for delete operations (optional, required for deleting existing images)
 * @param {string} props.title - Title for the gallery section (default: "Photos")
 * @param {boolean} props.showUploadForm - Whether to show the upload form (default: true)
 * @param {boolean} props.multiple - Whether to allow multiple file selection (default: true)
 * @param {Function} props.onExistingImageRemove - Optional custom handler for existing image removal (receives imageId, index). If provided, overrides default delete behavior and onExistingImagesChange will be called after.
 */
const ImageGallery = ({
  images = [],
  existingImages = [],
  onImagesChange,
  onExistingImagesChange,
  listingId,
  title = "Photos",
  showUploadForm = true,
  multiple = true,
  onExistingImageRemove,
}) => {
  const [deletingImageId, setDeletingImageId] = useState(null);

  // Handle adding new images
  const handleImageAdd = (file) => {
    if (onImagesChange) {
      if (multiple) {
        onImagesChange([...images, file]);
      } else {
        onImagesChange([file]);
      }
    }
  };

  // Handle removing new images (by index)
  const handleImageRemove = (imageId, index) => {
    if (onImagesChange) {
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
    }
  };

  // Handle removing existing images (by ID, requires API call or custom handler)
  const handleExistingImageRemove = async (imageId, index) => {
    if (!imageId) return;

    // If custom handler is provided, use it instead of default delete behavior
    if (onExistingImageRemove) {
      onExistingImageRemove(imageId, index);
      // Custom handler should manage state, but we can notify parent of change
      const updatedExisting = existingImages.filter((img) => img.id !== imageId);
      if (onExistingImagesChange) {
        onExistingImagesChange(updatedExisting);
      }
      return;
    }

    // Default behavior: delete immediately via API
    if (!listingId) return;

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


  return (
    <div className="row y-gap-20 x-gap-10">
      <h1 className="text-20 lh-14 fw-600">{title}</h1>

      {/* Image Upload Form */}
      {showUploadForm && (
        <div className="col-12">
          <ImageUploadForm onFileSelect={handleImageAdd} multiple={multiple} />
        </div>
      )}

      {/* Existing Images (from database) */}
      <ImageGrid
        images={existingImages}
        onRemove={handleExistingImageRemove}
        deletingImageId={deletingImageId}
        showRemoveButton={!!listingId}
        title={existingImages.length > 0 ? `Existing Images (${existingImages.length})` : ""}
        getImageUrl={getImageUrl}
        altPrefix="Existing"
      />

      {/* New Images (to be uploaded) */}
      <ImageGrid
        images={images}
        onRemove={handleImageRemove}
        deletingImageId={null}
        showRemoveButton={true}
        title={images.length > 0 ? `New Images to Upload (${images.length})` : ""}
        getImageUrl={getImageUrl}
        altPrefix="Preview"
      />
    </div>
  );
};

export default ImageGallery;

