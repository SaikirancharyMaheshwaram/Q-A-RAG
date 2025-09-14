import { RedisChatMessageHistory, redisClient } from "../lib/db";
import { BufferWindowMemory } from "langchain/memory";
import { countTokens } from "../lib/tokenCounter";
import { summarizeMessages } from "../lib/summarizer";

export async function getMemory(userId: string, chatId: string) {
  const sessionId = `${userId}:${chatId}`;
  const chatHistory = new RedisChatMessageHistory({
    sessionId,
    client: redisClient,
    sessionTTL: 60 * 60 * 6,
  });

  const memory = new BufferWindowMemory({
    chatHistory,
    returnMessages: true,
    memoryKey: "chat_history",
    k: 10,
  });

  const historyMessages = await memory.loadMemoryVariables({});
  const updatedMessages = await chatHistory.getMessages();
  const tokenCount = countTokens(updatedMessages);

  let summaryText: string | null = null;

  if (tokenCount > 1000) {
    console.log("[SUMMARIZER_TRIGGERED] Trimming conversation");
    const summaryMessages = await summarizeMessages(updatedMessages, 1000);

    summaryText = JSON.stringify(
      summaryMessages.find((msg: any) => msg._getType() === "system"),
    );

    await chatHistory.clear();
    await chatHistory.addMessages(summaryMessages);

    // keep last 1–2 raw turns
    const lastTurns = updatedMessages.slice(-2);
    for (const msg of lastTurns) {
      await chatHistory.addMessage(msg);
    }
  }

  return { memory, historyMessages, summaryText };
}
