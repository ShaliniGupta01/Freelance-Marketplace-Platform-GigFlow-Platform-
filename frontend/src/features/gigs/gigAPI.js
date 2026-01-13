import api from "../../api/axios";

export const fetchGigs = async (search = "") => {
  const res = await api.get(`/gigs?search=${search}`);
  return res.data; // ONLY JSON DATA
};

export const createGigAPI = async (data) => {
  const res = await api.post("/gigs", data);
  return res.data; //  ONLY JSON DATA
};
