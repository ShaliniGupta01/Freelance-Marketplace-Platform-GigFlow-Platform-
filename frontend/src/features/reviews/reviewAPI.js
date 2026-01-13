import axios from "axios";

export const createReview = async ({ gigId, rating, comment, clientId }) => {
  try {
    const res = await axios.post("http://localhost:5000/api/reviews", {
      gigId,
      rating,
      comment,
      clientId,
    });
    return res.data;
  } catch (err) {
    console.error("Failed to submit review:", err.response.data);
    throw err;
  }
};
