import express from "express";
import dotenv from "dotenv";
import ConnectDB from "./config/db.js";
import userRoutes from "./router/userRoutes.js";
import chatRoutes from "./router/chatRoutes.js";
import messageRoutes from "./router/messageRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import { Server } from "socket.io";
const app = express();
app.use(express.json());
dotenv.config();
ConnectDB();

app.get("/", (req, res) => {
  res.send("<h1>Active</h1>");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`server online : ${PORT}`);
});

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log(room + "  joined room");
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    let chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
});
