import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import {
  createBid,
  getBidsByGig,
  hireBid,
  getHiringData,
  completeProject,
} from "../controllers/bidController.js";

const router = express.Router();

//  STATIC ROUTE FIRST
router.get("/hiring", isAuthenticated, getHiringData);

// CREATE BID
router.post("/", isAuthenticated, createBid);

// HIRE BID
router.patch("/:bidId/hire", isAuthenticated, hireBid);

// DYNAMIC ROUTE LAST
router.get("/:gigId", isAuthenticated, getBidsByGig);

router.put("/:id/complete", isAuthenticated, completeProject);

export default router;
