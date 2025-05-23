import { useRef, useState } from "react";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const ImageUploadForm = () => {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [message, setMessage] = useState("");

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.type)) {
      failedUpload("Only SVG, PNG, JPG, or GIF files are allowed.");
      return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      if (img.width > 800 || img.height > 400) {
        failedUpload(
          `Image is too large! Max size is 800x400px. Yours is ${img.width}x${img.height}px.`
        );
      } else {
        setFileName(file.name);
      }
    };
  };

  const failedUpload = (message) => {
    setMessage(message || "Failed to upload image.");
    setShowSnackbar(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div
      className="border-light rounded-8 border-dashed py-20 d-flex flex-column justify-center items-center"
      onClick={handleUploadClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <input
        type="file"
        accept=".png,.jpg,.jpeg,.gif,.svg"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <FileUploadIcon className="text-light-1 text-40" />
      <div className="text-14 text-light-1">or drag and drop</div>
      <div className="text-12 text-light-1">
        SVG, PNG, JPG or GIF (max. 800x400px)
      </div>
      <div className="text-12 text-black-50 lh-1">
        *Double Click on the image to select featured.
      </div>
      <div className="text-12 text-black-50 lh-1">
        **Change images order with Drag & Drop.
      </div>
      {fileName && (
        <div className="text-16 text-light-1 mt-2">
          Selected Image: {fileName}
        </div>
      )}
      <Snackbar
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
      >
        <Alert severity="warning" variant="filled" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ImageUploadForm;
