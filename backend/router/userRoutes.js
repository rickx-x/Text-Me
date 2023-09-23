import express from "express";
import {
  registerUser,
  authUser,
  allUsers,
} from "../controller/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(registerUser).get(verifyToken, allUsers);
router.post("/login", authUser);

export default router;
