import express from "express";
import jwtAuth from "../middlewares/auth.js";
import { getChannels, getMessages, postMessage } from "../controllers/chat.js";

const router = express.Router();

router.use(jwtAuth);

router.get("/channels", getChannels);
router.get("/messages", getMessages);
router.post("/messages", postMessage);

export default router;
