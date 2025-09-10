import { Router } from "express";
import { authenticate, AuthenticatedRequest } from "../middleware/authenticate";
import { db, getVectorStore } from "../lib/db";
import { buildPrompt } from "../lib/chunkText";
import { makeLLM } from "../llms/google";

const router = Router();

router.post("/", authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { query } = req.body;
    const { userId } = req.user;

    if (!query?.trim()) {
      return res.status(400).json({ error: "Query is required" });
    }

    const vectorStore = await getVectorStore();
    const results = await vectorStore.similaritySearch(query, 3, { userId });

    if (results.length === 0) {
      return res.status(404).json({ message: "No relevant info found" });
    }

    const promptforllm = buildPrompt(results, query);
    const llm = makeLLM();
    const aiMsg = await llm.invoke(promptforllm);

    const content =
      typeof aiMsg.content === "string"
        ? aiMsg.content
        : JSON.stringify(aiMsg.content);

    await db.chat.create({
      data: {
        question: query,
        answer: content,
        userId,
        docId: results[0]?.metadata.documentId, // MVP only
      },
    });

    return res.status(200).json({ query, response: content });
  } catch (e) {
    console.error("[CHAT_ROUTE_CATCH]", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
