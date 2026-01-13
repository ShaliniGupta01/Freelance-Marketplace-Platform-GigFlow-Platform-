import dotenv from "dotenv";
dotenv.config({ quiet: ".env.example" });
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import gigRoutes from "./routes/gigRoutes.js";
import bidRoutes from "./routes/bidRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";



const app = express();
const server = http.createServer(app);

// ================= SOCKET.IO SETUP =================
export const io = new Server(server, {
  cors: {
    origin: "https://freelance-marketplace-platform-gig.vercel.app", // Vite frontend
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // User joins personal room
  socket.on("join", (userId) => {
    if (userId) {
      socket.join(userId);
      console.log(`User joined room: ${userId}`);
    } else {
      console.log("User tried to join with null id");
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});
// ==================================================

connectDB();

app.use(
  cors({
    origin: "https://freelance-marketplace-platform-gig.vercel.app",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);

app.get('/', (req, res) => {
  res.send("GigPlateform backend is working!");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));
