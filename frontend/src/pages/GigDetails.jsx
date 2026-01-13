import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import { getGigById, updateGig, deleteGig } from "../features/gigs/gigSlice";
import { createBid, fetchBidsByGig, hireBid } from "../features/bids/bidSlice";
import { getUserById } from "../features/users/userSlice";
import ReviewForm from "../components/ReviewForm";

import BidCard from "../components/BidCard";

const GigDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const gig = useSelector((state) => state.gigs.gig);
  const bids = useSelector((state) => state.bids.list);
  const user = useSelector((state) => state.auth.user);

  const [client, setClient] = useState(null);
  const [amount, setAmount] = useState("");
  const [proposal, setProposal] = useState("");
  const [workTime, setWorkTime] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    budget: "",
  });

  const canReview =
  user?.role === "freelancer" &&
  gig?.status === "completed" &&
  myBid?.status === "hired";


  /* ================= FETCH GIG ================= */
  useEffect(() => {
    dispatch(getGigById(id));
  }, [id, dispatch]);

/* ================= FETCH CLIENT INFO ================= */
useEffect(() => {
  if (gig?.ownerId) {
    dispatch(getUserById(gig.ownerId)).then((res) => {
      const owner = res.payload;
      if (owner) {
        setClient({
          name: owner.name,
          email: owner.email,
          rating: owner.rating || null,
          gigCount: owner.gigCount || 0,
        });
      }
    });
  }
}, [gig, dispatch]);
;

  /* ================= FETCH BIDS (OWNER ONLY) ================= */
  useEffect(() => {
    if (user && gig && gig.ownerId === user._id) {
      dispatch(fetchBidsByGig(id));
    }
  }, [user, gig, id, dispatch]);

  /* ================= ROLE CHECKS ================= */
  const isOwner = user && gig?.ownerId === user._id;
  const isFreelancer = user && user.role?.toLowerCase() === "freelancer";

  const myBid = bids.find((b) => b.freelancerId === user?._id);
  const isHiredFreelancer = myBid?.status === "hired";
  const canBid = isFreelancer && !isOwner && gig?.status === "open" && !myBid;

  /* ================= BID SUBMIT ================= */
  const submitBid = (e) => {
    e.preventDefault();
    if (!amount || !proposal || !workTime) return alert("All fields required");

    dispatch(
      createBid({
        gigId: gig._id,
        price: Number(amount),
        proposal,
        workTime: Number(workTime),
      })
    );

    setAmount("");
    setProposal("");
    setWorkTime("");
  };

  /* ================= HIRE BID ================= */
  const handleHire = (bidId) => {
    dispatch(hireBid(bidId));
  };

  /* ================= UPDATE GIG ================= */
  const handleEditClick = () => {
    setEditData({
      title: gig.title,
      description: gig.description,
      budget: gig.budget,
    });
    setEditMode(true);
  };

  const handleUpdateGig = () => {
    dispatch(updateGig({ id: gig._id, data: editData }));
    setEditMode(false);
  };

  /* ================= DELETE GIG ================= */
  const handleDeleteGig = () => {
    if (window.confirm("Are you sure you want to delete this gig?")) {
      dispatch(deleteGig(gig._id));
      navigate("/");
    }
  };

  if (!gig) return <p className="text-center mt-10">Loading...</p>;

  /* ================= UI ================= */
  return (
    <div className="max-w-5xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* ===== GIG INFO ===== */}
      <div className="md:col-span-2">
        <h1 className="text-2xl font-bold mb-2">{gig.title}</h1>
        <p className="text-gray-600 mb-2">{gig.description}</p>
        <p className="font-semibold mb-4">Budget: ₹{gig.budget}</p>

        {/* ===== OWNER ACTIONS ===== */}
        {isOwner && (
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleEditClick}
              className="bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit Gig
            </button>
            <button
              onClick={handleDeleteGig}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete Gig
            </button>
          </div>
        )}

        {/* ===== EDIT MODE ===== */}
        {editMode && (
          <div className="space-y-3 mb-8">
            <input
              className="w-full border p-2 rounded"
              value={editData.title}
              onChange={(e) =>
                setEditData({ ...editData, title: e.target.value })
              }
            />
            <textarea
              className="w-full border p-2 rounded"
              value={editData.description}
              onChange={(e) =>
                setEditData({ ...editData, description: e.target.value })
              }
            />
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={editData.budget}
              onChange={(e) =>
                setEditData({ ...editData, budget: e.target.value })
              }
            />
            <div className="flex gap-3">
              <button
                onClick={handleUpdateGig}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ===== FREELANCER BID FORM ===== */}
        {canBid && (
          <form onSubmit={submitBid} className="mt-6 space-y-3">
            <h2 className="text-lg font-semibold">Place Your Bid</h2>

            <input
              type="number"
              placeholder="Bid Amount (₹)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />

            <input
              type="number"
              placeholder="Estimated Work Time (Hours)"
              value={workTime}
              onChange={(e) => setWorkTime(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />

            <textarea
              placeholder="Write your proposal..."
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />

            <button className="bg-indigo-600 text-white px-4 py-2 rounded">
              Place Bid
            </button>
          </form>
        )}

        {/* ===== HIRED MESSAGE ===== */}
        {isHiredFreelancer && (
          <div className="mt-6 p-4 bg-green-100 border border-green-400 rounded">
            <h2 className="text-lg font-semibold text-green-800">
              You have been hired for this gig!
            </h2>
          </div>
        )}

        {/* ===== REVIEW FORM (ONLY AFTER COMPLETION) ===== */}
{canReview && (
  <ReviewForm gigId={gig._id} />
)}

        {/* ===== OWNER BID LIST ===== */}
        {isOwner && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3">
              All Bids (Review & Hire)
            </h2>

            {bids.length === 0 ? (
              <p className="text-gray-500">No bids yet.</p>
            ) : (
              bids
                .filter((bid) => bid.status !== "rejected")
                .map((bid) => (
                  <BidCard key={bid._id} bid={bid} onHire={handleHire} />
                ))
            )}
          </div>
        )}
      </div>

      {/* ===== CLIENT INFO CARD ===== */}
      {client && (
        <div className="bg-white border rounded p-4 shadow">
          <h2 className="text-lg font-semibold mb-2">Client Info</h2>
          <p>
            <strong>Name:</strong> {client.name || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {client.email || "N/A"}
          </p>
          <p>
            <strong>Rating:</strong>{" "}
            {client.rating ? client.rating + " ⭐" : "No reviews yet ⭐"}
          </p>
          <p>
            <strong>Projects Posted:</strong> {client.gigCount || 0}
          </p>
        </div>
      )}
    </div>
  );
};

export default GigDetails;
