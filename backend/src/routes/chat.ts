import { Router } from "express";
import { authenticate, AuthenticatedRequest } from "../middleware/authenticate";
import { buildPrompt } from "../lib/prompt";
import { getMemory } from "../services/memory";
import { getRelevantDocs } from "../services/retriever";
import { streamLLMResponse } from "../services/streamer";
import { db } from "../lib/db";


const router = Router();

router.post("/", authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { query, chatId } = req.body;
    const { userId } = req.user;

    if (!query?.trim()) {
      return res.status(400).json({ error: "Query is required" });
    }

    // 1. Setup memory (Redis + summarization
    const { memory, historyMessages, summaryText } = await getMemory(
      userId,
      chatId,
    );

    // 2. Retrieve relevant documents
    const results = await getRelevantDocs(userId, query);
    const context = results.matches
      .map((match) => match.metadata?.text)
      .join("\n\n---\n\n");

    // buiding prompt for llm

    const promptforllm = buildPrompt(
      historyMessages.chat_history,
      summaryText ?? "",
      context,
      query,
    );

    // 4. Stream LLM response
    const { finalContent } = await streamLLMResponse(res, promptforllm);

    // 5.  storing message in redis and postgres
    await memory.saveContext({ human: query }, { ai: finalContent });
    await db.chat.create({
      data: {
        question: query,
        answer: finalContent,
        userId,
        docId: results.matches[0]?.metadata?.documentId + "", // MVP
      },
    });
  } catch (e) {
    console.error("[CHAT_STREAM_ERROR]", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
