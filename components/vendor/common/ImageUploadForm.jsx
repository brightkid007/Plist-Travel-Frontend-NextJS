import { useRef, useState } from "react";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const ImageUploadForm = ({ onFileSelect, multiple = true }) => {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [message, setMessage] = useState("");

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif",
      "image/svg+xml",
    ];

    // Process each file
    Array.from(files).forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        failedUpload("Only SVG, PNG, JPG, or GIF files are allowed.");
        return;
      }

      // Check file size (2MB max based on backend)
      if (file.size > 2 * 1024 * 1024) {
        failedUpload("File size must be less than 2MB.");
        return;
      }

      // Validate image file
      const imageElement = new window.Image();
      imageElement.src = URL.createObjectURL(file);
      imageElement.onload = () => {
        setFileName(file.name);
        if (onFileSelect) {
          onFileSelect(file);
        }
      };
      imageElement.onerror = () => {
        failedUpload("Invalid image file.");
      };
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/gif",
        "image/svg+xml",
      ];

      // Process dropped files
      Array.from(files).forEach((file) => {
        if (!allowedTypes.includes(file.type)) {
          failedUpload("Only SVG, PNG, JPG, or GIF files are allowed.");
          return;
        }

        // Check file size (2MB max based on backend)
        if (file.size > 2 * 1024 * 1024) {
          failedUpload("File size must be less than 2MB.");
          return;
        }

        // Validate image
        const imageElement = new window.Image();
        imageElement.src = URL.createObjectURL(file);
        imageElement.onload = () => {
          setFileName(file.name);
          if (onFileSelect) {
            onFileSelect(file);
          }
        };
        imageElement.onerror = () => {
          failedUpload("Invalid image file.");
        };
      });
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
        multiple={multiple}
      />
      <FileUploadIcon className="text-light-1 text-40" />
      <div className="text-14 text-light-1">or drag and drop</div>
      <div className="text-12 text-light-1">
        SVG, PNG, JPG or GIF (max. 2MB)
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
