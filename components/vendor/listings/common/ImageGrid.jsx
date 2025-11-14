import ImageItem from "./ImageItem";

/**
 * Reusable image grid component for displaying a list of images
 * @param {Object} props
 * @param {Array} props.images - Array of images (File objects or image objects with url)
 * @param {Function} props.onRemove - Callback function when remove button is clicked (receives imageId/index, arrayIndex)
 * @param {number|string} props.deletingImageId - ID of the image currently being deleted
 * @param {boolean} props.showRemoveButton - Whether to show remove buttons
 * @param {string} props.title - Title for the image grid section
 * @param {Function} props.getImageUrl - Optional function to get image URL
 * @param {string} props.altPrefix - Prefix for alt text (e.g., "Existing", "Preview")
 */
const ImageGrid = ({
  images = [],
  onRemove,
  deletingImageId = null,
  showRemoveButton = true,
  title = "",
  getImageUrl,
  altPrefix = "Image",
}) => {
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="col-12">
      {title && <h2 className="text-16 lh-14 fw-500 mb-10">{title}</h2>}
      <div className="d-flex flex-wrap x-gap-15 y-gap-15">
        {images.map((image, index) => (
          <ImageItem
            key={image.id || index}
            image={image}
            index={index}
            onRemove={onRemove}
            isDeleting={deletingImageId === (image.id || index)}
            showRemoveButton={showRemoveButton}
            alt={`${altPrefix} ${index + 1}`}
            getImageUrl={getImageUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGrid;

