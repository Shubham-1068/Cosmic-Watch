import {
	watch,
	unWatch,
	getWatchlist,
	getNotifications,
	markNotificationRead,
} from "../controllers/alerts.js";
import express from "express";
import jwtAuth from "../middlewares/auth.js";

const router = express.Router();

router.use(jwtAuth);

router.post("/watch", watch);
router.post("/unwatch/:neoId", unWatch);
router.get("/watchlist", getWatchlist);
router.get("/notifications", getNotifications);
router.post("/notifications/:id/read", markNotificationRead);

export default router;
