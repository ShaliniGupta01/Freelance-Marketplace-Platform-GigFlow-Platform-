// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import gigReducer from "../features/gigs/gigSlice";
import bidReducer from "../features/bids/bidSlice";
import userReducer from "../features/users/userSlice"; 
import authReducer from "../features/auth/authSlice";
import reviewReducer from "../features/reviews/reviewSlice"; 

export const store = configureStore({
  reducer: {
    gigs: gigReducer,
    bids: bidReducer,
    users: userReducer,
    auth: authReducer,
    reviews: reviewReducer, 
  },
});
