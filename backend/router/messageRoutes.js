import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { allMessages, sendMessage } from "../controller/messageController.js";

const router = express.Router();

router.route("/").post(verifyToken, sendMessage);
router.route("/:chatId").get(verifyToken, allMessages);

export default router;
