import ImageGallery from "../../common/ImageGallery";

const Image = ({ images = [], existingImages = [], onImagesChange, onExistingImagesChange, listingId }) => {
  return (
    <ImageGallery
      images={images}
      existingImages={existingImages}
      onImagesChange={onImagesChange}
      onExistingImagesChange={onExistingImagesChange}
      listingId={listingId}
      title="Photos"
      showUploadForm={true}
      multiple={true}
    />
  );
};

export default Image;
