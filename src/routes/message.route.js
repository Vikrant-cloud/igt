import express from "express";
import {
  getCourseMessages,
  sendMessage,
  getPrivateChat,
} from "../controller/message.controller.js";

const router = express.Router();

// Course chat (teacher + all students)
router.get("/:roomId", getCourseMessages);

// Private teacher ↔ student chat
router.get("/:roomId/:userId1/:userId2", getPrivateChat);

// Send message
router.post("/", sendMessage);

export default router;
