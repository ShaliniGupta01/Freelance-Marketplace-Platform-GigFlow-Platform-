import { io } from "socket.io-client";

const socket = io("https://gigflowplatformbackend.onrender.com");
export default socket;
