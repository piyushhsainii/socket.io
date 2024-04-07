"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const http_1 = __importDefault(require("http"));
const server = http_1.default.createServer();
const ws = new ws_1.WebSocketServer({ server });
ws.on("connection", (socket) => {
    socket.on("error", (error) => {
        console.log(error);
    });
});
server.listen(3000, () => {
    console.log("server has been started", 3000);
});
