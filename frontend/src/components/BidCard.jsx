import { useState } from "react";

const BidCard = ({ bid, onHire }) => {
  const [loading, setLoading] = useState(false);

  const handleHire = async () => {
    setLoading(true);
    await onHire(bid._id);
    setLoading(false);
  };

  return (
    <div className="bg-white border rounded p-4 mb-3">
      <p className="font-medium">{bid.proposal}</p>

      <p className="text-gray-600">₹{bid.price}</p>

      <p>
        <strong>Work Time:</strong> {bid.workTime} hours
      </p>

      {/*  STATUS BADGE (ADD HERE) */}
      <p className="text-sm text-gray-700">
  <strong>Freelancer:</strong> {bid.freelancerId?.name}
</p>
      <p
        className={
          bid.status === "hired"
            ? "text-green-600 font-semibold"
            : bid.status === "rejected"
            ? "text-red-500 font-semibold"
            : "text-gray-600 font-semibold"
        }
      >
        Status: {bid.status.toUpperCase()}
      </p>

      {/* ACTION BUTTON */}
      {bid.status === "pending" && (
        <button
          onClick={handleHire}
          disabled={loading}
          className="mt-2 bg-indigo-600 text-white px-3 py-1 rounded"
        >
          {loading ? "Hiring..." : "Hire"}
        </button>
      )}
    </div>
  );
};

export default BidCard;

