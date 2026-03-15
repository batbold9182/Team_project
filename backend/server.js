require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const roomsRouter = require("./routes/rooms");
const registerWhiteboardHandlers = require("./socket/whiteboard");

const app = express();
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

app.get("/", (req, res) => res.send("API check ajilj baina"));
app.use("/api/rooms", roomsRouter);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  transports: ["websocket"],
});

registerWhiteboardHandlers(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));