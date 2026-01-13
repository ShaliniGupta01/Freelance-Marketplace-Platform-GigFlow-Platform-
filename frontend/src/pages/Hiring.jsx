import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHiringData, completeProject } from "../features/bids/bidSlice";
import ReviewForm from "../components/ReviewForm";

const Hiring = () => {
  const dispatch = useDispatch();

  const { list: bids, loading } = useSelector((state) => state.bids);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchHiringData());
  }, [dispatch]);

  if (!user) return null;

  const handleComplete = (bidId) => {
    dispatch(completeProject(bidId));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        {user.role === "owner" ? "Hiring Dashboard" : "My Bids & Projects"}
      </h1>

      {loading && <p>Loading...</p>}
      {!loading && bids.length === 0 && (
        <p className="text-gray-500">No projects found</p>
      )}

      {!loading &&
        bids.map((gig) => (
          <div
            key={gig._id}
            className="bg-white border rounded p-4 mb-3 shadow"
          >
            {/* GIG INFO */}
            <h3 className="font-semibold">{gig.gigId?.title}</h3>
            <p className="text-gray-600">{gig.gigId?.description}</p>
            <p>
              <strong>Budget:</strong> ₹{gig.gigId?.budget}
            </p>
            <p>
              <strong>Bid Price:</strong> ₹{gig.price}
            </p>

            {/* OWNER VIEW */}
            {user.role === "owner" && (
              <p>
                <strong>Freelancer:</strong> {gig.freelancerId?.name}
              </p>
            )}

            {/* STATUS */}
            <p
              className={
                gig.status === "hired"
                  ? "text-green-600 font-semibold"
                  : gig.status === "completed"
                  ? "text-green-700 font-semibold"
                  : gig.status === "rejected"
                  ? "text-red-500 font-semibold"
                  : "text-yellow-600 font-semibold"
              }
            >
              Status: {gig.status.toUpperCase()}
            </p>

            {/* COMPLETE BUTTON (freelancer only, for hired projects) */}
            {user.role === "freelancer" && gig.status === "hired" && (
              <button
                onClick={() => handleComplete(gig._id)}
                className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
              >
                Mark as Complete
              </button>
            )}

            {/* COMPLETED MESSAGE */}
            {gig.status === "completed" && (
              <p className="mt-2 text-green-700 font-semibold">
                Project Completed
              </p>
            )}

            {/* REVIEW FORM (freelancer only, if not reviewed yet) */}
            {user.role === "freelancer" &&
              gig.status === "completed" &&
              !gig.review && <ReviewForm gigId={gig.gigId._id} />}

            {/* SHOW SUBMITTED REVIEW */}
            {gig.review && (
              <div className="mt-2 p-2 bg-green-100 rounded">
                <p>
                  Review submitted! ⭐ {gig.review.rating}
                </p>
                <p>{gig.review.comment}</p>
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default Hiring;

