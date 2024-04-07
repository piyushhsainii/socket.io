"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["POST", "GET"],
        credentials: true
    }
});
app.use((0, cors_1.default)());
app.get('/', (req, res) => (res.json({
    success: true
})));
io.on("connection", (socket) => {
    console.log(socket.id, "user id");
    socket.on("message", (data) => {
        console.log(data, "data from message");
        io.emit("message-receive", data);
    });
});
httpServer.listen(5000, () => {
    console.log("Server has started on PORT 5000");
});
