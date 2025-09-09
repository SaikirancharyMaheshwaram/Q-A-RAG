import { Router } from "express";
import { authenticate, AuthenticatedRequest } from "../middleware/authenticate";
import { db, getVectorStore } from "../lib/db";
import { buildPrompt } from "../lib/chunkText";
import { makeLLM } from "../llms/google";

const router = Router();

router.post("/", authenticate, async (req: AuthenticatedRequest, res) => {
  const { query } = req.body;
  const { userId } = req.user;

  const vectorStore = await getVectorStore();
  const results = await vectorStore.similaritySearch(query, 3, { userId });
  console.log({ results });
  if (results.length == 0) {
    return res.json({ message: "No relevant Info found" });
  }

  const promptforllm = buildPrompt(results, query);

  try {
    const llm = makeLLM();
    const aiMsg = await llm.invoke(promptforllm);

    // saving the chat
    const chat = await db.chat.create({
      data: {
        question: query,
        answer: JSON.stringify(aiMsg.content),
        userId,
        docId: results[0]?.metadata.documentId,
      },
    });

    res.json({ query, response: aiMsg.content });
  } catch (e) {
    console.log("[CHAT_ROUTE_CATCH]", e);
    res.json({ error: "Something went wrong" });
  }
});

export default router;
