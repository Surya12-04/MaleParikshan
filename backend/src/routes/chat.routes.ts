import { Router } from "express";
import multer from "multer";
import { chat, getChatHistory } from "../controllers/chat.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post("/", authenticate, upload.single("file"), chat);
router.get("/history", authenticate, getChatHistory);

export default router;