
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "https://gigflowplatformbackend.onrender.com/api/bids";

export const createBid = createAsyncThunk(
  "bids/create",
  async (data, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.user.token;
      const res = await axios.post(API, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);



export const hireBid = createAsyncThunk(
  "bids/hire",
  async (bidId, { getState }) => {
    const token = getState().auth.user.token;
    const res = await axios.patch(`${API}/${bidId}/hire`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
);

// Fetch hired projects for owner/freelancer

export const fetchHiringData = createAsyncThunk(
  "bids/fetchHiring",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.user.token;
      console.log("Token for API call:", token ? "Present" : "Missing"); // Debug token
      const res = await axios.get(`${API}/hiring`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("API Response:", res.data); // Debug response
      return res.data;
    } catch (err) {
      console.error("API Error:", err.response?.data); // Debug error
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const fetchBidsByGig = createAsyncThunk(
  "bids/fetchByGig",
  async (gigId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.user.token;

      const res = await axios.get(
        `https://gigflowplatformbackend.onrender.com/api/bids/${gigId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const completeProject = createAsyncThunk(
  "bids/complete",
  async (bidId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.user.token;

      const res = await axios.put(
        `https://gigflowplatformbackend.onrender.com/api/bids/${bidId}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("COMPLETE RESPONSE", res.data);
      return res.data.bid;
    } catch (err) {
      console.log("COMPLETE ERROR", err.response?.data);
      return rejectWithValue(err.response?.data?.message);
    }
  }
);



const bidSlice = createSlice({
  name: "bids",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchBidsByGig
      .addCase(fetchBidsByGig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBidsByGig.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      // createBid
      .addCase(createBid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBid.fulfilled, (state, action) => {
        state.list.push(action.payload);
        state.loading = false;
      })
      .addCase(createBid.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      // hireBid
      .addCase(hireBid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(hireBid.fulfilled, (state, action) => {
        const index = state.list.findIndex((bid) => bid._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
        state.loading = false;
      })
      .addCase(hireBid.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      // fetchHiringData
      .addCase(fetchHiringData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHiringData.fulfilled, (state, action) => {
        console.log("Hired data:", action.payload); // For debugging
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchHiringData.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(fetchBidsByGig.fulfilled, (state, action) => {
  state.list = action.payload;
})
.addCase(completeProject.fulfilled, (state, action) => {
  const index = state.list.findIndex(b => b._id === action.payload._id);
  if (index !== -1) {
    state.list[index] = action.payload;
  }
});


  },
});

export default bidSlice.reducer;