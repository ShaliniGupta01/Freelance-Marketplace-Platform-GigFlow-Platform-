import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "https://gigflowplatformbackend.onrender.com/api/gigs";

/* ================== THUNKS ================== */

// All open gigs (Dashboard)
export const getGigs = createAsyncThunk(
  "gigs/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(API);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

// Single gig by id
export const getGigById = createAsyncThunk(
  "gigs/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

//  Create gig (OWNER)
export const createGig = createAsyncThunk(
  "gigs/create",
  async (data, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.user.token;

      const res = await axios.post(API, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

//  My gigs (OWNER ONLY)
export const getMyGigs = createAsyncThunk(
  "gigs/myGigs",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.user.token;

      const res = await axios.get(`${API}/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);
//  UPDATE GIG (OWNER)
export const updateGig = createAsyncThunk(
  "gigs/update",
  async ({ id, data }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.user.token;

      const res = await axios.put(`${API}/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

//  DELETE GIG (OWNER)
export const deleteGig = createAsyncThunk(
  "gigs/delete",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.user.token;

      await axios.delete(`${API}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return id;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

/* ================== SLICE ================== */

const gigSlice = createSlice({
  name: "gigs",
  initialState: {
    gigs: [],
    myGigs: [],
    gig: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // getGigs
      .addCase(getGigs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getGigs.fulfilled, (state, action) => {
        state.loading = false;
        state.gigs = action.payload;
      })
      .addCase(getGigs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getGigById
      .addCase(getGigById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getGigById.fulfilled, (state, action) => {
        state.loading = false;
        state.gig = action.payload;
      })
      .addCase(getGigById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // createGig
      .addCase(createGig.pending, (state) => {
        state.loading = true;
      })
      .addCase(createGig.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createGig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getMyGigs
      .addCase(getMyGigs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyGigs.fulfilled, (state, action) => {
        state.loading = false;
        state.myGigs = action.payload;
      })
      .addCase(getMyGigs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateGig
      .addCase(updateGig.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateGig.fulfilled, (state, action) => {
        state.loading = false;
        state.gig = action.payload;

        state.gigs = state.gigs.map((g) =>
          g._id === action.payload._id ? action.payload : g
        );
      })
      .addCase(updateGig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // deleteGig
      .addCase(deleteGig.fulfilled, (state, action) => {
        state.gigs = state.gigs.filter((g) => g._id !== action.payload);
        state.gig = null;
      });
  },
});

export default gigSlice.reducer;
