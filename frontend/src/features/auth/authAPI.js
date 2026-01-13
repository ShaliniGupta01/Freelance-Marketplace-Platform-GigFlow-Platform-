import api from "../../api/axios";

// Only return data from API, not the full Axios response
export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data; // <-- important
};

export const loginUser = async (userData) => {
  const response = await api.post("/auth/login", userData);
  return response.data; // <-- important
};

export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};
