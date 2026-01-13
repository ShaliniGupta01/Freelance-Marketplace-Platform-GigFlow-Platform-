import express from "express";
import { createReview , getReviewsByGig} from "../controllers/reviewController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", isAuthenticated, createReview);

// Get all reviews for a gig
router.get("/gig/:gigId", getReviewsByGig);

export default router;
