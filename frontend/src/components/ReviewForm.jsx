import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createReview, fetchReviewsByGig } from "../features/reviews/reviewSlice";

const ReviewForm = ({ gigId }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  // Safe state from Redux
  const reviewsState = useSelector((state) => state.reviews) || {};
  const reviews = reviewsState.reviews || [];

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Fetch reviews for this gig when component mounts
  useEffect(() => {
    if (gigId) dispatch(fetchReviewsByGig(gigId));
  }, [dispatch, gigId]);

  // Check if user already submitted a review
  const userReview = user ? reviews.find((r) => r.clientId === user._id) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login first!");
      return;
    }

    if (!gigId || !rating || !comment) {
      alert("All fields are required!");
      return;
    }

    // Dispatch Redux action
    const resultAction = await dispatch(
      createReview({ gigId, rating, comment })
    );

    if (resultAction.meta.requestStatus === "fulfilled") {
      setSubmitted(true);
    } else {
      alert("Failed to submit review: " + (resultAction.payload?.message || "Unknown error"));
    }
  };

  // Show existing review if already submitted
  if (userReview) {
    return (
      <div className="mt-4 p-4 border rounded bg-green-50">
        <p className="text-green-700 font-semibold">
          You already submitted a review! ⭐ {userReview.rating}
        </p>
        <p>{userReview.comment}</p>
      </div>
    );
  }

  // Show confirmation after submitting
  if (submitted) {
    return (
      <div className="mt-4 p-4 border rounded bg-green-50">
        <p className="text-green-700 font-semibold">
          Review submitted! ⭐ {rating}
        </p>
        <p>{comment}</p>
      </div>
    );
  }

  // Review form
  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 border p-4 rounded bg-white shadow-sm"
    >
      <h3 className="font-semibold mb-2">Leave a Review</h3>

      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="border p-2 rounded w-full mb-2"
      >
        {[5, 4, 3, 2, 1].map((r) => (
          <option key={r} value={r}>
            {r} ⭐
          </option>
        ))}
      </select>

      <textarea
        placeholder="Write your feedback..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="border p-2 rounded w-full mb-3"
        required
      />

      <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
