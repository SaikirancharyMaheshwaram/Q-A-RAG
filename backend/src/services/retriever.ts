import { pineconeIndex } from "../lib/db";
import { embeddings } from "../llms/google";

export async function getRelevantDocs(userId: string, query: string) {
  // const vectorStore = await getVectorStore();
  const queryVector = await embeddings.embedQuery(query);

  const searchResults = await pineconeIndex.query({
    topK: 10,
    vector: queryVector,
    includeMetadata: true,
    filter: { userId },
  });
  return searchResults;
}
