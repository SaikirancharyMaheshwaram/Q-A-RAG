import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

export async function chunkText(rawText: string) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500, // max size of each chunk (in characters)
    chunkOverlap: 50, // each chunk overlaps with the previous by 200 chars
  });

  const docs = await splitter.createDocuments([rawText]);

  return docs; // Each is: { pageContent: string, metadata: {} }
}

export function buildPrompt(
  history: (HumanMessage | AIMessage)[],
  chunks: { pageContent: string }[],
  question: string,
): string {
  const context = chunks.map((chunk) => chunk.pageContent).join("\n\n");

  const formattedHistory = history
    .map((msg) => `${msg._getType()}: ${msg.content}`)
    .join("\n");

  return `
You are a helpful AI assistant. Use the following context and conversation history to answer the question.
Please format your response using markdown when helpful (headings, lists, code blocks).

**Conversation History:**
${formattedHistory}

**Context:**
${context}

**Question:**
${question}

**Answer:**
`;
}
