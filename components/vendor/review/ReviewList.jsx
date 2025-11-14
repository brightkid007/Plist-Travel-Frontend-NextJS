import { OpenInFull } from "@mui/icons-material";
import { Dialog, Radio, CircularProgress } from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import { getReviews, getListingById } from "@/helpers/backend_helper";
import { toast } from "react-toastify";

const ReviewList = ({ detail = false, filters = {} }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listingTitles, setListingTitles] = useState({}); // Map of listing_id to title
  const [replyText, setReplyText] = useState("");
  const [rate, setRate] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const loadReviews = async (filterParams = {}) => {
    try {
      setLoading(true);
      // Build query parameters from filters
      const params = {};
      
      if (filterParams.status && filterParams.status !== "all") {
        params.status = filterParams.status;
      }
      
      if (filterParams.rating && filterParams.rating !== "all") {
        params.rating = filterParams.rating;
      }
      
      if (filterParams.listing_id && filterParams.listing_id !== "all") {
        params.listing_id = filterParams.listing_id;
      }
      
      if (filterParams.search) {
        params.search = filterParams.search;
      }

      const response = await getReviews(params);
      const reviewsData = response?.data?.reviews || response?.reviews || response?.data || response || [];
      const reviewsArray = Array.isArray(reviewsData) ? reviewsData : [];
      setReviews(reviewsArray);

      // Fetch listing titles for reviews that don't have listing data
      const listingIdsToFetch = new Set();
      reviewsArray.forEach((review) => {
        // Only fetch if listing is not included or doesn't have title
        if (review.listing_id && (!review.listing || !review.listing.title)) {
          listingIdsToFetch.add(review.listing_id);
        }
      });

      // Fetch listing titles in parallel
      if (listingIdsToFetch.size > 0) {
        const listingPromises = Array.from(listingIdsToFetch).map(async (listingId) => {
          try {
            const listingResponse = await getListingById(listingId);
            const listingData = listingResponse?.data || listingResponse;
            return { id: listingId, title: listingData?.title || null };
          } catch (error) {
            console.error(`Error fetching listing ${listingId}:`, error);
            return { id: listingId, title: null };
          }
        });

        const listingResults = await Promise.all(listingPromises);
        const titlesMap = {};
        listingResults.forEach((result) => {
          if (result.title) {
            titlesMap[result.id] = result.title;
          }
        });
        setListingTitles((prev) => ({ ...prev, ...titlesMap }));
      }
    } catch (error) {
      console.error("Error loading reviews:", error);
      if (error?.response?.status === 404 || error?.status === 404) {
        setReviews([]);
      } else {
        toast.error(error?.message || "Failed to load reviews");
        setReviews([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Create a stable filter key for dependency tracking
  const filterKey = useMemo(() => {
    return `${filters.status || ''}_${filters.rating || ''}_${filters.listing_id || ''}_${filters.search || ''}`;
  }, [filters.status, filters.rating, filters.listing_id, filters.search]);

  useEffect(() => {
    loadReviews(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey]);

  const initModalContent = () => {
    setReplyText("");
    setRate({});
    setModalContentStatus("main");
    setSelectedReview(null);
  };
  
  const handleClose = () => {
    setShowModal(false);
    initModalContent();
  };

  const handleOpenModal = (review) => {
    setSelectedReview(review);
    // If review has replies, populate the reply text
    if (review.replies && review.replies.length > 0) {
      // Get the latest reply
      const latestReply = review.replies[review.replies.length - 1];
      setReplyText(latestReply.comment || "");
    }
    setShowModal(true);
  };

  const [modalContentStatus, setModalContentStatus] = useState("main");

  const modalContentMap = {
    main: (
      <ModalMainContent
        setModalContentStatus={setModalContentStatus}
        replyText={replyText}
        rate={rate}
      />
    ),
    reply: (
      <ReplyForm
        setModalContentStatus={setModalContentStatus}
        replyText={replyText}
        setReplyText={setReplyText}
      />
    ),
    rate: (
      <RateForm
        setModalContentStatus={setModalContentStatus}
        rate={rate}
        setRate={setRate}
        initModalContent={initModalContent}
      />
    ),
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch (error) {
      return dateString;
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      approved: "bg-green-1 text-white",
      pending: "bg-yellow-1 text-dark-1",
      rejected: "bg-red-1 text-white",
    };
    return statusColors[status] || "bg-light-2 text-dark-1";
  };

  if (loading) {
    return (
      <div className="d-flex justify-center items-center py-40">
        <CircularProgress />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="d-flex justify-center items-center py-40">
        <div className="text-center">
          <p className="text-14 text-light-1">No reviews found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-scroll scroll-bar-1 pt-0">
      <table className="table-2 col-12">
        <thead>
          <tr className="text-light-1 fw-600 text-14">
            <th>Customer</th>
            <th>Listing</th>
            <th>Rating</th>
            <th>Review</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review.id}>
              <td className="align-middle text-12">
                {review.user
                  ? `${review.user.first_name || ""} ${review.user.last_name || ""}`.trim() || review.user.email || "N/A"
                  : "N/A"}
              </td>
              <td className="align-middle text-12">
                {review.listing?.title || listingTitles[review.listing_id] || review.listing_id || "N/A"}
              </td>
              <td className="align-middle text-12">
                {Array(5)
                  .fill(null)
                  .map((_, index) => (
                    <span key={index} className="text-20 text-yellow-1 lh-14">
                      {index < (review.rating || 0) ? "★" : "☆"}
                    </span>
                  ))}
              </td>
              <td className="align-middle text-12">
                <div className="max-w-300">
                  <div className="fw-500">{review.title || "No title"}</div>
                  <div className="text-light-1 text-11 mt-5">
                    {review.comment ? (review.comment.length > 100 ? `${review.comment.substring(0, 100)}...` : review.comment) : "No comment"}
                  </div>
                </div>
              </td>
              <td className="align-middle">
                <span
                  className={`rounded-100 px-10 text-center text-12 ${getStatusBadge(review.status || "pending")}`}
                >
                  {(review.status || "pending").charAt(0).toUpperCase() + (review.status || "pending").slice(1)}
                </span>
              </td>
              <td className="align-middle text-12">{formatDate(review.created_at || review.createdAt)}</td>
              <td className="align-middle">
                <span
                  className="text-10 cursor-pointer"
                  onClick={() => handleOpenModal(review)}
                >
                  <OpenInFull />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Dialog
        open={showModal}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-title"
      >
        <div className="px-20 py-20" style={{ width: "500px" }}>
          <h1 className="text-20 fw-500 mb-10">Rating & Reply</h1>
          {selectedReview && (
            <div className="mb-15 pb-15 border-bottom">
              <div className="text-14 fw-500 mb-5">
                Review by: {selectedReview.user
                  ? `${selectedReview.user.first_name || ""} ${selectedReview.user.last_name || ""}`.trim() || selectedReview.user.email || "N/A"
                  : "N/A"}
              </div>
              <div className="text-12 text-light-1 mb-5">
                Listing: {selectedReview.listing?.title || listingTitles[selectedReview.listing_id] || selectedReview.listing_id || "N/A"}
              </div>
              <div className="text-14 mb-5">
                <div className="fw-500">{selectedReview.title || "No title"}</div>
                <div className="text-12 text-light-1 mt-5">{selectedReview.comment || "No comment"}</div>
              </div>
              <div className="d-flex items-center gap-5">
                <span className="text-12">Rating:</span>
                {Array(5)
                  .fill(null)
                  .map((_, index) => (
                    <span key={index} className="text-16 text-yellow-1">
                      {index < (selectedReview.rating || 0) ? "★" : "☆"}
                    </span>
                  ))}
              </div>
            </div>
          )}
          {modalContentMap[modalContentStatus]}
        </div>
      </Dialog>
    </div>
  );
};

const ModalMainContent = ({ setModalContentStatus, replyText, rate }) => {
  return (
    <>
      <div className="text-14 lh-12 fw-500">How did he do as a guest?</div>
      <div className="text-12 lh-12 text-light-1 mb-10">
        Rating will prompt them to review you in return.
      </div>
      {Object.keys(rate).length > 0 ? (
        <div className="bg-light-2 rounded-8 py-5 px-10 text-12 lh-12 mb-10">
          <div className="row x-gap-10 y-gap-10">
            <div className="col-6 mt-5">
              <h1 className="text-14 lh-12 fw-500">
                Overall Experience<span className="text-red-1">*</span>
              </h1>
              <div className="d-flex items-center gap-1">
                {Array(5)
                  .fill(null)
                  .map((_, index) => (
                    <span
                      className="text-20 text-yellow-1 lh-14 cursor-pointer"
                      onClick={() => setRate({ ...rate, overall: index + 1 })}
                    >
                      {index < rate?.overall ? "★" : "☆"}
                    </span>
                  ))}
              </div>
            </div>

            <div className="col-6 mt-5">
              <h1 className="text-14 lh-12 fw-500">Cleanliness</h1>
              <div className="d-flex items-center gap-1">
                {Array(5)
                  .fill(null)
                  .map((_, index) => (
                    <span
                      className="text-20 text-yellow-1 lh-14 cursor-pointer"
                      onClick={() =>
                        setRate({ ...rate, cleanliness: index + 1 })
                      }
                    >
                      {index < rate?.cleanliness ? "★" : "☆"}
                    </span>
                  ))}
              </div>
            </div>

            <div className="col-6 mt-5">
              <h1 className="text-14 lh-12 fw-500">House Rules</h1>
              <div className="d-flex items-center gap-1">
                {Array(5)
                  .fill(null)
                  .map((_, index) => (
                    <span
                      className="text-20 text-yellow-1 lh-14 cursor-pointer"
                      onClick={() => setRate({ ...rate, houserule: index + 1 })}
                    >
                      {index < rate?.houserule ? "★" : "☆"}
                    </span>
                  ))}
              </div>
            </div>

            <div className="col-6 mt-5">
              <h1 className="text-14 lh-12 fw-500">Communication</h1>
              <div className="d-flex items-center gap-1">
                {Array(5)
                  .fill(null)
                  .map((_, index) => (
                    <span
                      className="text-20 text-yellow-1 lh-14 cursor-pointer"
                      onClick={() =>
                        setRate({ ...rate, communication: index + 1 })
                      }
                    >
                      {index < rate?.communication ? "★" : "☆"}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <button
          className="text-14 text-blue-1 border-blue-1 rounded-8 px-10"
          onClick={() => setModalContentStatus("rate")}
        >
          Rate Guest
        </button>
      )}
      <div className="text-14 lh-12 fw-500 mt-20">Reply to Guest Review</div>
      <div className="text-12 lh-12 text-light-1 mb-10">
        Rating will prompt them to review you in return.
      </div>
      {replyText ? (
        <div className="bg-light-2 mt-10 rounded-8 py-5 px-10 text-16 lh-12 mb-10 text-break">
          {replyText}
        </div>
      ) : (
        <button
          className="text-14 text-blue-1 border-blue-1 rounded-8 px-10"
          onClick={() => setModalContentStatus("reply")}
        >
          Reply
        </button>
      )}
    </>
  );
};

const RateForm = ({ setModalContentStatus, rate, setRate, initModalContent }) => {
  const [reRent, setReRent] = useState(false);

  return (
    <div className="row x-gap-10 y-gap-10">
      <div className="col-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">
          Overall Experience<span className="text-red-1">*</span>
        </h1>
        <div className="d-flex items-center gap-1">
          {Array(5)
            .fill(null)
            .map((_, index) => (
              <span
                className="text-20 text-yellow-1 lh-14 cursor-pointer"
                onClick={() => setRate({ ...rate, overall: index + 1 })}
              >
                {index < rate?.overall ? "★" : "☆"}
              </span>
            ))}
        </div>
      </div>

      <div className="col-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Cleanliness</h1>
        <div className="d-flex items-center gap-1">
          {Array(5)
            .fill(null)
            .map((_, index) => (
              <span
                className="text-20 text-yellow-1 lh-14 cursor-pointer"
                onClick={() => setRate({ ...rate, cleanliness: index + 1 })}
              >
                {index < rate?.cleanliness ? "★" : "☆"}
              </span>
            ))}
        </div>
      </div>

      <div className="col-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">House Rules</h1>
        <div className="d-flex items-center gap-1">
          {Array(5)
            .fill(null)
            .map((_, index) => (
              <span
                className="text-20 text-yellow-1 lh-14 cursor-pointer"
                onClick={() => setRate({ ...rate, houserule: index + 1 })}
              >
                {index < rate?.houserule ? "★" : "☆"}
              </span>
            ))}
        </div>
      </div>

      <div className="col-6 mt-5">
        <h1 className="text-14 lh-12 fw-500">Communication</h1>
        <div className="d-flex items-center gap-1">
          {Array(5)
            .fill(null)
            .map((_, index) => (
              <span
                className="text-20 text-yellow-1 lh-14 cursor-pointer"
                onClick={() => setRate({ ...rate, communication: index + 1 })}
              >
                {index < rate?.communication ? "★" : "☆"}
              </span>
            ))}
        </div>
      </div>

      <div className="col-12 mt-15">
        <h1 className="text-14 lh-12 fw-500">Would you rent to him again?</h1>
        <div className="d-flex items-center gap-1 mt-10">
          <Radio
            className="px-0 py-0"
            checked={reRent}
            onChange={() => setReRent(true)}
          />
          Yes
          <Radio
            className="px-0 py-0"
            checked={!reRent}
            onChange={() => setReRent(false)}
          />
          No
        </div>
      </div>

      <div className="d-flex justify-end gap-2">
        <button
          className="text-14 border-light rounded-8 px-10 py-5"
          onClick={() => {
            setModalContentStatus("main");
            initModalContent();
          }}
        >
          Cancel
        </button>
        <button
          className="text-14 bg-blue-1 text-white fw-500 rounded-8 px-10 py-5"
          onClick={() => {
            setModalContentStatus("main");
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

const ReplyForm = ({ setModalContentStatus, replyText, setReplyText }) => {
  const dynamicFields = [
    { value: "{{property_name}}", label: "Name of booked property" },
    { value: "{{guest_first_name}}", label: "Guest First Name" },
    { value: "{{guest_last_name}}", label: "Guest Last Name" },
    { value: "{{check_in_date}}", label: "Check-in Date" },
    { value: "{{check_in_time}}", label: "Check-in Time" },
    { value: "{{check_out_date}}", label: "Check-out Date" },
    { value: "{{check_out_time}}", label: "Check-out Time" },
    { value: "{{booking_id}}", label: "Booking ID" },
    { value: "{{nights}}", label: "Total nights booked" },
  ];
  return (
    <>
      <div className="d-flex items-center flex-wrap gap-2 mb-10">
        {dynamicFields.map((item, index) => (
          <span
            className="text-12 fw-500 rounded-100 bg-blue-2 px-10 text-blue-1 cursor-pointer"
            key={index}
            onClick={() => setReplyText(replyText + item.value)}
          >
            {item.label}
          </span>
        ))}
      </div>
      <textarea
        className="text-14 border-light rounded-8 bg-white px-10 py-5 mb-10"
        placeholder="Enter your quick reply"
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
      />
      <div className="d-flex justify-end gap-2">
        <button
          className="text-14 border-light rounded-8 px-10 py-5"
          onClick={() => {
            setReplyText("");
            setModalContentStatus("main");
          }}
        >
          Cancel
        </button>
        <button
          className="text-14 bg-blue-1 text-white fw-500 rounded-8 px-10 py-5"
          onClick={() => {
            setModalContentStatus("main");
          }}
        >
          Send
        </button>
      </div>
    </>
  );
};

export default ReviewList;
