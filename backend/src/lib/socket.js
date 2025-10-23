import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: [ENV.CLIENT_URL],
        credentials: true,
    },
});

//applying authentication middleware to socket connections

io.use(socketAuthMiddleware);

//to store online users
// ... (imports and server setup are the same)

const userSocketMap = {};

io.on("connection", (socket) => {
    console.log("A user connected", socket.user.fullName);

    const userId = socket.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    // Send the updated list of online users to everyone
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.user.fullName);
        const userId = socket.userId;
        // FIX: Only delete the user if the disconnecting socket is the one in the map
        if (userId && userSocketMap[userId] === socket.id) {
            delete userSocketMap[userId];
            // Resend the online users list after deletion
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        }
    });
});

export { io, app, server };