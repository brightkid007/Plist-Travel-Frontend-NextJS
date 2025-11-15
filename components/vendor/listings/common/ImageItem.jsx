import { Close } from "@mui/icons-material";
import { getImageUrl as getImageUrlUtil } from "@/utils/imageUtils";

/**
 * Reusable image item component for displaying images with remove functionality
 * @param {Object} props
 * @param {File|Object} props.image - The image file or image object with url
 * @param {number} props.index - Index of the image in the array
 * @param {Function} props.onRemove - Callback function when remove button is clicked (receives imageId/index, arrayIndex)
 * @param {boolean} props.isDeleting - Whether the image is currently being deleted
 * @param {boolean} props.showRemoveButton - Whether to show the remove button
 * @param {string} props.alt - Alt text for the image
 * @param {Function} props.getImageUrl - Optional function to get image URL, if not provided uses default logic
 */
const ImageItem = ({
  image,
  index,
  onRemove,
  isDeleting = false,
  showRemoveButton = true,
  alt = "Image",
  getImageUrl,
}) => {
  // Use provided getImageUrl function or fall back to utility function
  const imageUrl = getImageUrl ? getImageUrl(image) : getImageUrlUtil(image);
  const imageId = image.id || index;

  const handleRemove = () => {
    if (onRemove) {
      onRemove(imageId, index);
    }
  };

  // Don't render if no image URL
  if (!imageUrl) {
    return null;
  }

  return (
    console.log("imageUrl", imageUrl),
    <div className="position-relative">
      <img
        src={imageUrl}
        alt={alt}
        className="w-full h-120 object-cover rounded-8 border-light"
        onError={(e) => {
          e.target.src = "/img/testimonials/1/4.png"; // Fallback image
        }}
      />
      {showRemoveButton && (
        <button
          onClick={handleRemove}
          className="position-absolute bg-red-1 text-white rounded-circle size-25 flex-center cursor-pointer border-none"
          style={{ top: "15px", right: "15px" }}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <div className="size-20 border-2 border-white border-t-transparent rounded-circle animate-spin" />
          ) : (
            <Close sx={{ fontSize: "20px" }} />
          )}
        </button>
      )}
    </div>
  );
};

export default ImageItem;

