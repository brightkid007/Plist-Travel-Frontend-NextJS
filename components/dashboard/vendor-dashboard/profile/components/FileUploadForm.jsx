const { useState, useRef } = require("react");

const FileUploadForm = ({ placeholder, count, setCount }) => {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <div className="d-flex justify-between items-center mt-5 col-12">
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <input
        className="border-light rounded-8 py-5 px-15 w-full bg-light-2"
        readOnly
        type="text"
        value={fileName}
        placeholder={placeholder}
      />
      <button
        className="py-10 px-10 d-flex items-center border-light rounded-8 fw-500 ml-10"
        onClick={handleUploadClick}
      >
        <span className="material-symbols-outlined text-16 lh-13 fw-500">
          upload
        </span>
        {count >= 1 && <div className="text-13 fw-500 ml-5 lh-15">Upload</div>}
      </button>
      {count >= 1 && (
        <button
          disabled={count === 1}
          className="ml-10 pt-5 px-5"
          onClick={() => setCount(count - 1)}
        >
          <span className="material-symbols-outlined text-red-2 text-15 fw-500">
            close
          </span>
        </button>
      )}
    </div>
  );
};

export default FileUploadForm;
