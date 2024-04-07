"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
// const client = redis.createClient();
const app = express();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
    connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000,
        skipMiddlewares: true
    }
});
app.use((0, cors_1.default)());
io.on("connection", (socket) => {
    console.log(socket.id, "USERID");
    socket.on("message", (room, data, username) => {
        console.log(data, "Message in backend");
        io.to(room).emit("message-sent", data, username);
    });
    socket.on("join-room", (room) => {
        socket.join(room);
        console.log("joined", room);
    });
});
server.listen(3000, () => {
    console.log('Server started on PORT', 3000);
});
