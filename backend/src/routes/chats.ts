import { Router } from "express";
import { authenticate, AuthenticatedRequest } from "../middleware/authenticate";
import { db, getVectorStore } from "../lib/db";
import { buildPrompt } from "../lib/chunkText";
import { makeLLM } from "../llms/google";

const router = Router();

router.get("/", authenticate, async (req: AuthenticatedRequest, res) => {
  const userId = req.user.userId;

  try {
    const allChats = await db.chat.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ allChats });
  } catch (e) {
    console.log("[ALLCHAT_ROUTE]", e);
    res.json({ error: "Something went wrong" });
  }
});

export default router;
