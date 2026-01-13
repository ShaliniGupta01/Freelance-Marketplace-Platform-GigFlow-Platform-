import mongoose from "mongoose";
import Bid from "../models/Bid.js";
import Gig from "../models/Gig.js";
import { getIO } from "../socket/socket.js"; // Optional: For socket.io notifications

// Create bid
export const createBid = async (req, res) => {
  try {
    const { gigId, price, proposal, workTime } = req.body;

    if (!gigId || !price || !proposal || !workTime) {
      return res.status(400).json({ message: "All fields required" });
    }

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    // Owner cannot bid
    if (gig.ownerId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Owner cannot bid" });
    }

    // Gig closed
    if (gig.status === "closed") {
      return res.status(400).json({ message: "Gig already closed" });
    }

    // Duplicate bid
    const existingBid = await Bid.findOne({
      gigId,
      freelancerId: req.user._id,
    });

    if (existingBid) {
      return res.status(400).json({
        message: "You already placed a bid",
      });
    }

    const bid = await Bid.create({
      gigId,
      price,
      proposal,
      workTime,
      freelancerId: req.user._id,
    });

    res.status(201).json(bid);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get bids for a gig (owner only)


export const getBidsByGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.gigId);
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    //  only owner can review bids
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const bids = await Bid.find({ gigId: gig._id })
      .populate("freelancerId", "name email");

    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Hire bid
export const hireBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.bidId);
    if (!bid) return res.status(404).json({ message: "Bid not found" });

    const gig = await Gig.findById(bid.gigId);
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    // only owner can hire
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // hired bid
    bid.status = "hired";
    await bid.save();

    //  reject all other bids
    await Bid.updateMany(
      {
        gigId: gig._id,
        _id: { $ne: bid._id },
      },
      { status: "rejected" }
    );

    //  close gig
    gig.status = "assigned";
    await gig.save();

    res.json(bid);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get hiring data for owner/freelancer

export const getHiringData = async (req, res) => {
  try {
    let bids = [];

    if (req.user.role === "owner") {
      bids = await Bid.find()
        .populate("gigId")
        .populate("freelancerId");

      // only owner gigs
      bids = bids.filter(
        (b) => b.gigId && b.gigId.ownerId.toString() === req.user._id.toString()
      );
    }

    if (req.user.role === "freelancer") {
      bids = await Bid.find({ freelancerId: req.user._id })
        .populate("gigId")
        .populate("freelancerId");
    }

    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const completeProject = async (req, res) => {
  console.log("COMPLETE API HIT", req.params.id, req.user);

  try {
    const bid = await Bid.findById(req.params.id);

    if (!bid) {
      return res.status(404).json({ message: "Bid not found" });
    }

    // CHECK THIS CONDITION
    if (
      bid.freelancerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not your project" });
    }

    if (bid.status !== "hired") {
      return res.status(400).json({ message: "Not hired yet" });
    }

    bid.status = "completed";
    await bid.save();

    await Gig.findByIdAndUpdate(bid.gigId, {
      status: "completed",
    });

    res.json({ bid });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


