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
    // const aiMsg = await llm.invoke(promptforllm);

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    let finalContent = "";
    const stream = await llm.stream(promptforllm);
    for await (const chunk of stream) {
      let token: any = chunk; // adapt based on model output
      let message = token.content;
      // console.log({ message });
      finalContent += message;

      // send partial token to frontend
      res.write(`data: ${JSON.stringify({ token: message + "" })}\n\n`);
    }

    await db.chat.create({
      data: {
        question: query,
        answer: finalContent,
        userId,
        docId: results[0]?.metadata.documentId, // MVP only
      },
    });
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (e) {
    console.error("[CHAT_STREAM_ERROR]", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
