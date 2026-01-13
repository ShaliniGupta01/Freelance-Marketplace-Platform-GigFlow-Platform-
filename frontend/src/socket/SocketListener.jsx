import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const SocketListener = () => {
  const user = useSelector((state) => state.auth.user);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      return;
    }

    if (!socketRef.current) {
      socketRef.current = io("https://gigflowplatformbackend.onrender.com", {
        withCredentials: true,
      });

      socketRef.current.on("connect", () => {
        console.log("Socket connected:", socketRef.current.id);
        socketRef.current.emit("join", user._id);
      });

      socketRef.current.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      socketRef.current.on("hired", (data) => {
        alert(`You have been hired for "${data.gigTitle}"`);
      });
    }

    return () => {
      socketRef.current?.off("hired");
    };
  }, [user]);

  return null;
};

export default SocketListener;