import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export async function chunkText(rawText: string) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500, // max size of each chunk (in characters)
    chunkOverlap: 50, // each chunk overlaps with the previous by 200 chars
  });

  const docs = await splitter.createDocuments([rawText]);

  return docs; // Each is: { pageContent: string, metadata: {} }
}

export function buildPrompt(
  chunks: { pageContent: string }[],
  question: string,
): string {
  const context = chunks.map((chunk) => chunk.pageContent).join("\n\n");

  return `
You are an AI assistant. Use the following context to answer the question.
and also Please format your response using markdown when helpful
(headings, lists, code blocks).
Context:
${context}

Question:
${question}

Answer:
`;
}
