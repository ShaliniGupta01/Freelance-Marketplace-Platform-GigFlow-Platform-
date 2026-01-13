import Gig from "../models/Gig.js";

/* CREATE GIG */
export const createGig = async (req, res) => {
  try {
    const gig = await Gig.create({
      title: req.body.title,
      description: req.body.description,
      budget: req.body.budget,
      ownerId: req.user._id,
    });

    res.status(201).json(gig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 *  GET ALL OPEN GIGS (SEARCH SUPPORTED)
 * GET /api/gigs?search=react
 */
export const getGigs = async (req, res) => {
  try {
    const { search } = req.query;

    const query = {
      status: "open",
    };

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const gigs = await Gig.find(query).sort({ createdAt: -1 });
    res.json(gigs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 *  GET SINGLE GIG
 * GET /api/gigs/:id
 */
export const getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    res.json(gig);
  } catch (error) {
    res.status(400).json({ message: "Invalid Gig ID" });
  }
};

/**
 *  UPDATE GIG (OWNER ONLY)
 * PUT /api/gigs/:id
 */
export const updateGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    // OWNER CHECK
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    gig.title = req.body.title || gig.title;
    gig.description = req.body.description || gig.description;
    gig.budget = req.body.budget || gig.budget;

    await gig.save();

    res.json(gig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 *  DELETE GIG (OWNER ONLY)
 * DELETE /api/gigs/:id
 */
export const deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    // OWNER CHECK
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await gig.deleteOne();

    res.json({ message: "Gig deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
