
// src/features/reviews/reviewSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Create a new review
export const createReview = createAsyncThunk(
  "reviews/create",
  async ({ gigId, rating, comment }, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { user },
      } = getState();

      if (!user?.token) return rejectWithValue({ message: "Not authenticated" });

      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      const res = await axios.post(
        "http://localhost:5000/api/reviews",
        { gigId, rating, comment }, // ✅ clientId removed
        config
      );

      return res.data;
    } catch (err) {
      // handle duplicate review
      const message = err.response?.data?.message || err.message;

      if (message === "You already reviewed this project") {
        return rejectWithValue({ message, alreadyReviewed: true });
      }

      return rejectWithValue({ message });
    }
  }
);


// Fetch all reviews for a specific gig
export const fetchReviewsByGig = createAsyncThunk(
  "reviews/fetchByGig",
  async (gigId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/reviews/gig/${gigId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue({ message: err.response?.data?.message || "Failed to fetch reviews" });
    }
  }
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    reviews: [],
    loading: false,
    error: null,
    alreadyReviewed: false, // ✅ track duplicate review
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Review
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.alreadyReviewed = false;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.push(action.payload);
        state.error = null;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;

        if (action.payload?.alreadyReviewed) {
          state.error = null;
          state.alreadyReviewed = true; // mark that user already reviewed
        } else {
          state.error = action.payload?.message || "Failed to submit review";
          state.alreadyReviewed = false;
        }
      })

      // Fetch Reviews By Gig
      .addCase(fetchReviewsByGig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewsByGig.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviewsByGig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch reviews";
      });
  },
});

export default reviewSlice.reducer;
