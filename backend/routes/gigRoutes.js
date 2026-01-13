import express from "express";
import {
  createGig,
  getGigs,
  getGigById,
  updateGig,
  deleteGig,
} from "../controllers/gigController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

// PUBLIC
router.get("/", getGigs);
router.get("/:id", getGigById);

// PROTECTED
router.post("/", isAuthenticated, createGig);
router.put("/:id", isAuthenticated, updateGig);
router.delete("/:id", isAuthenticated, deleteGig);

export default router;
