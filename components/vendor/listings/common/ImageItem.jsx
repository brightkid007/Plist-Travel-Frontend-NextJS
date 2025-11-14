import { Close } from "@mui/icons-material";

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
  // Default image URL handler
  const getDefaultImageUrl = (img) => {
    // If it's a file object, create object URL
    if (img instanceof File) {
      return URL.createObjectURL(img);
    }
    // If it's an existing image with URL, use the full URL
    if (img.url) {
      // Check if URL is already complete or needs base URL
      if (img.url.startsWith("http://") || img.url.startsWith("https://")) {
        return img.url;
      }
      // Construct full URL from relative path
      return `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081"}${img.url}`;
    }
    return null;
  };

  const imageUrl = getImageUrl ? getImageUrl(image) : getDefaultImageUrl(image);
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
    <div className="position-relative">
      <img
        src={imageUrl}
        alt={alt}
        className="w-full h-150 object-cover rounded-8 border-light"
        onError={(e) => {
          e.target.src = "/placeholder-image.png"; 
        }}
      />
      {showRemoveButton && (
        <button
          onClick={handleRemove}
          className="position-absolute bg-red-1 text-white rounded-circle size-30 cursor-pointer"
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

