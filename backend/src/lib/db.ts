import { embeddings } from "../llms/google";
import { PrismaClient } from "../generated/prisma";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { createClient } from "redis";
import { RedisChatMessageHistory } from "@langchain/redis";

export const db = new PrismaClient();

export const getVectorStore = async () => {
  return await Chroma.fromExistingCollection(embeddings, {
    collectionName: process.env.CHROMA_COLLECTION_NAME,
    url: process.env.CHROMA_VECTORDB_URL, // ensure chromadb is running
  });
};

const redisClient = createClient({ url: process.env.REDIS_URL });

redisClient.on("error", (err) => console.error("Redis Client Error:", err));

async function connectRedis() {
  await redisClient.connect();
  console.log("Redis client connected successfully!");
}

export { redisClient, connectRedis, RedisChatMessageHistory };
