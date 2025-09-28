import { HumanMessage, AIMessage } from "@langchain/core/messages";
export function buildPrompt(
  history: (HumanMessage | AIMessage)[],
  summary: string | null,
  // chunks: { pageContent: string }[],
  context: string,
  question: string,
): string {
  // const context = chunks.map((chunk) => chunk.pageContent).join("\n\n");

  const formattedHistory = history
    .map((msg) => `${msg._getType()}: ${msg.content}`)
    .join("\n");

  return `
You are a helpful AI assistant. Use the following information to answer the question.
- Rely on both the **conversation summary** (long-term memory) and the **recent history** (short-term memory).
- Use the provided context from documents when relevant.
- Be concise, accurate, and use markdown when helpful.

${summary ? `**Conversation Summary:**\n${summary}\n` : ""}

**Recent Conversation History:**
${formattedHistory || "No recent history."}

**Retrieved Context:**
${context || "No additional context."}

**Question:**
${question}

**Answer:**
`;
}
