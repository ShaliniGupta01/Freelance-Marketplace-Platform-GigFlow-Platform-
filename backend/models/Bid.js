
// models/Bid.js
import mongoose from "mongoose";

const bidSchema = new mongoose.Schema(
  {
    gigId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
      required: true,
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    price: {            //  PRICE (NOT amount)
      type: Number,
      required: true,
    },
    proposal: {
      type: String,
      required: true,
    },
      workTime: {
      type: Number,
      required: true, // HOURS
    },
    status: {
      type: String,
      enum: ["pending", "hired", "rejected", "completed"], // add enum for status
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Bid", bidSchema);
