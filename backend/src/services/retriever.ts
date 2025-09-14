import { getVectorStore } from "../lib/db";

export async function getRelevantDocs(userId: string, query: string) {
  const vectorStore = await getVectorStore();
  return vectorStore.similaritySearch(query, 3, { userId });
}
