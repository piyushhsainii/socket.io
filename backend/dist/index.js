"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const redis_1 = require("redis");
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
function startApp() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = (0, redis_1.createClient)();
        yield client.connect();
        function sendMessage(socket) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("control is reaching here");
                const data = yield client.lRange("messages", 0, -1);
                data.map((x) => {
                    const userNameMessage = x.split(":");
                    const redisUserName = userNameMessage[0];
                    const redisMessage = userNameMessage[1];
                    socket.emit("message-sent", redisMessage, redisUserName);
                    console.log(redisUserName);
                    console.log(redisMessage);
                });
            });
        }
        io.on("connection", (socket) => {
            sendMessage(socket);
            socket.on("message", (room, data, username) => {
                client.rPush("messages", `${username}:${data}`);
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
    });
}
startApp();
