import express from 'express';
import process from 'process';
import dotenv from 'dotenv';
import path from "path";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from './lib/db.js';
import { ENV } from './lib/env.js';
import cookieParser from 'cookie-parser';
import { app, server } from './lib/socket.js';

dotenv.config();

// const app = express();
const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;


//payload too large error fix
app.use(express.json({ limit: "50mb"})); // req.body
app.use(express.urlencoded({ limit: "50mb", extended: true}));
app.use(cors({
    origin: ENV.CLIENT_URL, credentials: true
}));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if(ENV.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });
}

server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
    connectDB();
});