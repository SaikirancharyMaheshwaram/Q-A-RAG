import express from "express";
import chatRouter from "./routes/chat";
import uploadRouter from "./routes/upload";
import authRouter from "./routes/auth";

import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use("/chat", chatRouter);
app.use("/upload", uploadRouter);
app.use("/auth", authRouter);

export default app;
