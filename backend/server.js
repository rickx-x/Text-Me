import express from "express";
import dotenv from "dotenv";
import ConnectDB from "./config/db.js";
import userRoutes from "./router/userRoutes.js";
import chatRoutes from "./router/chatRoutes.js";
import messageRoutes from "./router/messageRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

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
app.listen(PORT, () => {
  console.log(`server online : ${PORT}`);
});
