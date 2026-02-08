import {getNeoFeed, getNeoFeedById} from "../controllers/nasaNeo.js";
import express from "express";

const router = express.Router();

router.get("/", getNeoFeed);

router.get("/:id", getNeoFeedById);

export default router;
