import api from "../../api/axios";

export const createBidAPI = (data) =>
  api.post("/bids", data);

export const getBidsByGig = (gigId) =>
  api.get(`/bids/${gigId}`);

export const hireBidAPI = (bidId) =>
  api.patch(`/bids/${bidId}/hire`);
