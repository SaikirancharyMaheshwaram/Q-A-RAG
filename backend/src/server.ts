import express from "express";
import dotenv from "dotenv";
dotenv.config();

import chatRouter from "./routes/chat";
import chatsRouter from "./routes/chats";
import uploadRouter from "./routes/upload";
import authRouter from "./routes/auth";
import docsRouter from "./routes/documents";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(express.json());
// app.use(
//   cors({
//     origin: ["http://localhost:3000", "https://009dceac1c3e.ngrok-free.app"],
//     // your frontend
//     credentials: true,
//   }),
// );
//
const allowedOrigins = [
  "http://localhost:3000",
  "https://009dceac1c3e.ngrok-free.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Check if the request origin is in our allowed list
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(cookieParser());
app.use("/api/chat", chatRouter);
app.use("/api/chats", chatsRouter);
app.use("/api/docs", docsRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/auth", authRouter);

export default app;
