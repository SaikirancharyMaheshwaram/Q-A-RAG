import { Router } from "express";
import { authenticate, AuthenticatedRequest } from "../middleware/authenticate";
import {
  db,
  getVectorStore,
  RedisChatMessageHistory,
  redisClient,
} from "../lib/db";
import { buildPrompt } from "../lib/chunkText";
import { makeLLM } from "../llms/google";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { BufferWindowMemory } from "langchain/memory";

const router = Router();

router.post("/", authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const { query, chatId } = req.body;
    const { userId } = req.user;

    if (!query?.trim()) {
      return res.status(400).json({ error: "Query is required" });
    }
    const sessionId = `${userId}:${chatId}`;

    const chatHistory = new RedisChatMessageHistory({
      sessionId: sessionId,
      client: redisClient,
      sessionTTL: 60 * 60 * 6, //  24 hours
    });

    const memory = new BufferWindowMemory({
      chatHistory: chatHistory,
      returnMessages: true,
      memoryKey: "chat_history",
      k: 5,
    });

    const historyMessages = await memory.loadMemoryVariables({});

    // const historyMessagess = await chatHistory.getMessages();

    const vectorStore = await getVectorStore();
    const results = await vectorStore.similaritySearch(query, 3, { userId });

    if (results.length === 0) {
      return res.status(404).json({ message: "No relevant info found" });
    }

    const promptforllm = buildPrompt(
      historyMessages.chat_history,
      results,
      query,
    );
    console.log({ promptforllm, userId });
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

    //store it in redis
    // await chatHistory.addMessages([
    //   new HumanMessage(query),
    //   new AIMessage(finalContent),
    // ]);

    // storing it in redis using langchain memory
    await memory.saveContext({ human: query }, { ai: finalContent });

    await db.chat.create({
      data: {
        question: query,
        answer: finalContent,
        userId,
        docId: results[0]?.metadata.documentId, // MVP only
      },
    });
    console.log({ finalContent });
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (e) {
    console.error("[CHAT_STREAM_ERROR]", e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/redis", async (req, res) => {
  try {
    const value = await redisClient.set(
      "luffy",
      "I am going to be king of the pirates",
    );
    const response = await redisClient.get("luffy");
    res.json({ value: response });
  } catch (e) {}
});

export default router;
