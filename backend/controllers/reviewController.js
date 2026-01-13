

import Review from "../models/Review.js";
import Bid from "../models/Bid.js";
import User from "../models/User.js";


export const createReview = async (req, res) => {
  try {
    const { gigId, rating, comment } = req.body;

    if (!gigId || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const bid = await Bid.findOne({
      gigId,
      status: "completed",
    });

    if (!bid) {
      return res.status(400).json({ message: "Project not completed or invalid" });
    }

    // check if already reviewed
    const existing = await Review.findOne({ gigId, clientId: req.user._id });
    if (existing) {
      return res.status(400).json({ message: "You already reviewed this project" });
    }

    const review = await Review.create({
      gigId,
      clientId: req.user._id, // logged-in client
      freelancerId: bid.freelancerId, // optional
      rating,
      comment,
    });

     // update client average rating
    const reviews = await Review.find({ clientId: bid.clientId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await User.findByIdAndUpdate(bid.clientId, { rating: avgRating.toFixed(1) });



    res.status(201).json({ message: "Review submitted", review });
  } catch (err) {
    console.error("Create Review Error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getReviewsByGig = async (req, res) => {
  try {
    const { gigId } = req.params;

    const reviews = await Review.find({ gigId })
      .populate("clientId", "name email") // optional: populate client info
      .sort({ createdAt: -1 }); // newest first

    if (!reviews || reviews.length === 0) {
      return res.status(200).json([]); // return empty array if none
    }

    res.status(200).json(reviews);
  } catch (err) {
    console.error("Get Reviews Error:", err);
    res.status(500).json({ message: err.message });
  }
};


