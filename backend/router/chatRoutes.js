import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  accessChat,
  addToGroup,
  createGroupChat,
  fetchChats,
  removeFromGroup,
  renameGroup,
} from "../controller/chatController.js";

const router = express.Router();

router.route("/").post(verifyToken, accessChat);
router.route("/").get(verifyToken, fetchChats);
router.route("/group").post(verifyToken, createGroupChat);
router.route("/rename").put(verifyToken, renameGroup);
router.route("/groupremove").put(verifyToken, removeFromGroup);
router.route("/groupadd").put(verifyToken, addToGroup);

export default router;
