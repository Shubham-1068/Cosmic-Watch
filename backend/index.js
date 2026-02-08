import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";
import authRoutes from "./src/routes/auth.js";
import feedRoutes from "./src/routes/feed.js";
import alertRoutes from "./src/routes/alerts.js";
import chatRoutes from "./src/routes/chat.js";
import "./src/jobs/userAlert.js";

const PORT=process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/auth", authRoutes);
app.use("/feed", feedRoutes);
app.use("/alerts", alertRoutes);
app.use("/chat", chatRoutes);

app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
});