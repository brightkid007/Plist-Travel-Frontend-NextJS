import { OpenInFull } from "@mui/icons-material";
import { Dialog, Radio, CircularProgress } from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import { getReviews, getListingById, createReviewReply } from "@/helpers/backend_helper";
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
    setSelectedReview(null);
  };
  
  const handleClose = () => {
    setShowModal(false);
    initModalContent();
  };

  const handleOpenModal = (review) => {
    setSelectedReview(review);
    // If review has replies, populate the reply text and ratings
    if (review.replies && review.replies.length > 0) {
      // Get the latest reply
      const latestReply = review.replies[review.replies.length - 1];
      setReplyText(latestReply.comment || "");
      // Populate ratings if they exist
      if (latestReply.overall_experience || latestReply.cleanliness || latestReply.house_rules || latestReply.communication || latestReply.would_rent_again !== undefined) {
        setRate({
          overall: latestReply.overall_experience || null,
          cleanliness: latestReply.cleanliness || null,
          houserule: latestReply.house_rules || null,
          communication: latestReply.communication || null,
          would_rent_again: latestReply.would_rent_again !== undefined ? latestReply.would_rent_again : null,
        });
      } else {
        setRate({});
      }
    } else {
      // Reset if no replies
      setReplyText("");
      setRate({});
    }
    setShowModal(true);
  };

  const handleSubmit = async (wouldRentAgain) => {
    if (!selectedReview?.id) {
      toast.error("Review ID is missing");
      return;
    }

    // Validate that at least overall_experience is provided (required field)
    if (!rate.overall) {
      toast.error("Please provide an Overall Experience rating");
      return;
    }

    // Validate that comment is provided (required field)
    const trimmedComment = replyText?.trim() || "";
    if (!trimmedComment) {
      toast.error("Please provide a reply comment");
      return;
    }

    try {
      const payload = {
        review_id: selectedReview.id,
        overall_experience: rate.overall || null,
        cleanliness: rate.cleanliness || null,
        house_rules: rate.houserule || null,
        communication: rate.communication || null,
        would_rent_again: wouldRentAgain !== undefined ? wouldRentAgain : null,
        comment: trimmedComment, // Required field - ensure it's not null or undefined
      };

      // Debug: Log the payload to verify comment is included
      console.log("Submitting payload:", payload);
      console.log("Comment value:", payload.comment);
      console.log("Comment type:", typeof payload.comment);
      console.log("Comment length:", payload.comment?.length);

      // Use the general createReviewReply endpoint instead of createReviewReplyRating
      // because the rating endpoint doesn't accept comment, but comment is required
      await createReviewReply(payload);
      toast.success("Guest rating and reply submitted successfully");
      
      // Refresh reviews to get updated data with replies
      const response = await getReviews(filters);
      const reviewsData = response?.data?.reviews || response?.reviews || response?.data || response || [];
      const reviewsArray = Array.isArray(reviewsData) ? reviewsData : [];
      setReviews(reviewsArray);
      
      // Update selected review if it's still open
      if (selectedReview) {
        const updatedReview = reviewsArray.find(r => r.id === selectedReview.id);
        if (updatedReview) {
          setSelectedReview(updatedReview);
          // Update rate and reply state with the new reply data
          if (updatedReview.replies && updatedReview.replies.length > 0) {
            const latestReply = updatedReview.replies[updatedReview.replies.length - 1];
            setRate({
              overall: latestReply.overall_experience || null,
              cleanliness: latestReply.cleanliness || null,
              houserule: latestReply.house_rules || null,
              communication: latestReply.communication || null,
              would_rent_again: latestReply.would_rent_again !== undefined ? latestReply.would_rent_again : null,
            });
            setReplyText(latestReply.comment || "");
          }
        }
      }
      
      // Close modal after successful submission
      handleClose();
    } catch (error) {
      console.error("Error submitting rating and reply:", error);
      toast.error(error?.message || "Failed to submit rating and reply");
      throw error;
    }
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
      approved: "bg-green-2 text-white", // Made green bolder for 'approved'
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
          <CombinedRatingReplyForm
            rate={rate}
            setRate={setRate}
            replyText={replyText}
            setReplyText={setReplyText}
            onSubmit={handleSubmit}
            onCancel={handleClose}
          />
        </div>
      </Dialog>
    </div>
  );
};

const CombinedRatingReplyForm = ({ rate, setRate, replyText, setReplyText, onSubmit, onCancel }) => {
  const [reRent, setReRent] = useState(rate?.would_rent_again !== undefined ? rate.would_rent_again : false);
  const [submitting, setSubmitting] = useState(false);

  // Update reRent when rate changes
  useEffect(() => {
    if (rate?.would_rent_again !== undefined) {
      setReRent(rate.would_rent_again);
    }
  }, [rate?.would_rent_again]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit(reRent);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="text-14 lh-12 fw-500 mb-10">How did he do as a guest?</div>
      <div className="text-12 lh-12 text-light-1 mb-15">
        Rate the guest on different aspects and provide a reply.
      </div>

      {/* Rating Section */}
      <div className="bg-light-2 rounded-8 py-10 px-15 mb-20">
        <div className="row x-gap-10 y-gap-10">
          <div className="col-6 mt-5">
            <h1 className="text-14 lh-12 fw-500">
              Overall Experience<span className="text-red-1">*</span>
            </h1>
            <div className="d-flex items-center gap-1 mt-5">
              {Array(5)
                .fill(null)
                .map((_, index) => (
                  <span
                    key={index}
                    className="text-20 text-yellow-1 lh-14 cursor-pointer"
                    onClick={() => setRate({ ...rate, overall: index + 1 })}
                  >
                    {index < (rate?.overall || 0) ? "★" : "☆"}
                  </span>
                ))}
            </div>
          </div>

          <div className="col-6 mt-5">
            <h1 className="text-14 lh-12 fw-500">Cleanliness</h1>
            <div className="d-flex items-center gap-1 mt-5">
              {Array(5)
                .fill(null)
                .map((_, index) => (
                  <span
                    key={index}
                    className="text-20 text-yellow-1 lh-14 cursor-pointer"
                    onClick={() => setRate({ ...rate, cleanliness: index + 1 })}
                  >
                    {index < (rate?.cleanliness || 0) ? "★" : "☆"}
                  </span>
                ))}
            </div>
          </div>

          <div className="col-6 mt-5">
            <h1 className="text-14 lh-12 fw-500">House Rules</h1>
            <div className="d-flex items-center gap-1 mt-5">
              {Array(5)
                .fill(null)
                .map((_, index) => (
                  <span
                    key={index}
                    className="text-20 text-yellow-1 lh-14 cursor-pointer"
                    onClick={() => setRate({ ...rate, houserule: index + 1 })}
                  >
                    {index < (rate?.houserule || 0) ? "★" : "☆"}
                  </span>
                ))}
            </div>
          </div>

          <div className="col-6 mt-5">
            <h1 className="text-14 lh-12 fw-500">Communication</h1>
            <div className="d-flex items-center gap-1 mt-5">
              {Array(5)
                .fill(null)
                .map((_, index) => (
                  <span
                    key={index}
                    className="text-20 text-yellow-1 lh-14 cursor-pointer"
                    onClick={() => setRate({ ...rate, communication: index + 1 })}
                  >
                    {index < (rate?.communication || 0) ? "★" : "☆"}
                  </span>
                ))}
            </div>
          </div>

          <div className="col-12 mt-10">
            <h1 className="text-14 lh-12 fw-500 mb-5">Would you rent to him again?</h1>
            <div className="d-flex items-center gap-15">
              <label className="d-flex items-center cursor-pointer">
                <Radio
                  checked={reRent === true}
                  onChange={(e) => setReRent(true)}
                  value="yes"
                  name="would_rent_again"
                />
                <span className="text-14">Yes</span>
              </label>
              <label className="d-flex items-center cursor-pointer">
                <Radio
                  checked={reRent === false}
                  onChange={(e) => setReRent(false)}
                  value="no"
                  name="would_rent_again"
                />
                <span className="text-14">No</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Reply Section */}
      <div className="text-14 lh-12 fw-500 mb-5">Reply to Guest Review<span className="text-red-1">*</span></div>
      <div className="text-12 lh-12 text-light-1 mb-10">
        Provide a reply comment to the guest's review. Click on tokens below to insert dynamic fields.
      </div>
      
      {/* Dynamic Fields/Tokens */}
      <div className="mb-10">
        <div className="row x-gap-5 y-gap-5">
          {[
            { value: "{{property_name}}", label: "Property Name" },
            { value: "{{guest_first_name}}", label: "Guest First Name" },
            { value: "{{guest_last_name}}", label: "Guest Last Name" },
            { value: "{{check_in_date}}", label: "Check-in Date" },
            { value: "{{check_in_time}}", label: "Check-in Time" },
            { value: "{{check_out_date}}", label: "Check-out Date" },
            { value: "{{check_out_time}}", label: "Check-out Time" },
            { value: "{{booking_id}}", label: "Booking ID" },
            { value: "{{nights}}", label: "Total Nights" },
          ].map((item, index) => (
            <div key={index} className="col-auto">
              <span
                className="text-12 fw-500 rounded-100 bg-blue-2 px-10 py-5 text-blue-1 cursor-pointer hover:bg-blue-3 transition d-inline-block"
                onClick={() => setReplyText((prev) => (prev || "") + item.value)}
                title={`Insert ${item.label}`}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <textarea
        className="text-14 border-light rounded-8 bg-white px-10 py-10 mb-20 w-full"
        placeholder="Enter your reply to the guest review..."
        value={replyText || ""}
        onChange={(e) => setReplyText(e.target.value)}
        rows={4}
        required
      />

      {/* Submit Buttons */}
      <div className="d-flex justify-end" style={{ gap: 16 }}>
        <button
          className="text-14 border-light rounded-8 px-15 py-8"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          className="text-14 bg-blue-1 text-white fw-500 rounded-8 px-15 py-8"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Rating & Reply"}
        </button>
      </div>
    </>
  );
};


export default ReviewList;
