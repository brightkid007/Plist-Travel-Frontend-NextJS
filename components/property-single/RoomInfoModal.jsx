import GalleryRoomSlider from "./GalleryRoomSlider";

const RoomInfoModal = ({ isOpen, onClose, roomData }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div 
        className="modal-backdrop d-flex align-items-center justify-content-center p-4"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1050
        }}
        onClick={onClose}
      >
        {/* Modal Content */}
        <div 
          className="bg-white rounded-4 w-90 mx-auto"
          style={{
            maxWidth: '1200px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
            <h3 className="h4 mb-0">{roomData?.title || "Room Information"}</h3>
            <button 
              onClick={onClose}
              className="btn text-dark p-0"
            >
              <i className="icon-close fs-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-4">
            <div className="row g-4">
              {/* Left Side - Image Gallery */}
              <div className="col-lg-6">
                <GalleryRoomSlider />
              </div>

              {/* Right Side - Room Details */}
              <div className="col-lg-6">
                <div className="room-details">
                  <h4 className="h5 mb-4">Room Features</h4>
                  
                  <div className="mb-4">
                    <div className="d-flex align-items-center mb-2">
                      <i className="icon-no-smoke fs-5 me-3" />
                      <div>Non-smoking rooms</div>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <i className="icon-wifi fs-5 me-3" />
                      <div>Free WiFi</div>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <i className="icon-parking fs-5 me-3" />
                      <div>Parking</div>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <i className="icon-kitchen fs-5 me-3" />
                      <div>Kitchen</div>
                    </div>
                  </div>

                  <h4 className="h5 mb-4">Room Description</h4>
                  <p className="mb-4">
                    This spacious room features a comfortable king-size bed, modern amenities, and a private bathroom. 
                    Enjoy stunning views of the city skyline and access to all hotel facilities.
                  </p>

                  <h4 className="h5 mb-4">Room Amenities</h4>
                  <div className="row g-3">
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <i className="icon-check text-success me-2" />
                        <div>Air conditioning</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <i className="icon-check text-success me-2" />
                        <div>Flat-screen TV</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <i className="icon-check text-success me-2" />
                        <div>Mini bar</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <i className="icon-check text-success me-2" />
                        <div>Safe</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomInfoModal; 