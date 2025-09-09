import express from "express";
import dotenv from "dotenv";
dotenv.config();

import chatRouter from "./routes/chat";
import chatsRouter from "./routes/chats";
import uploadRouter from "./routes/upload";
import authRouter from "./routes/auth";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // your frontend
    credentials: true,
  }),
);
app.use(cookieParser());
app.use("/api/chat", chatRouter);
app.use("/api/chats", chatsRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/auth", authRouter);

export default app;
