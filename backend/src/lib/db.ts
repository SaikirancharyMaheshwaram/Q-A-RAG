import { embeddings } from "../embeddings/google";
import { PrismaClient } from "../generated/prisma";
import { Chroma } from "@langchain/community/vectorstores/chroma";

export const db = new PrismaClient();

export const getVectorStore = async () => {
  return await Chroma.fromExistingCollection(embeddings, {
    collectionName: process.env.CHROMA_COLLECTION_NAME,
    url: process.env.CHROMA_VECTORDB_URL, // ensure chromadb is running
  });
};
