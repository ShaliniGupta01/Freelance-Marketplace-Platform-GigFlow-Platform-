import User from "../models/User.js";
import Gig from "../models/Gig.js";

// GET USER BY ID (Client info)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // count total gigs posted by this user
    const gigCount = await Gig.countDocuments({ ownerId: user._id });

    res.status(200).json({
      ...user._doc,
      gigCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
