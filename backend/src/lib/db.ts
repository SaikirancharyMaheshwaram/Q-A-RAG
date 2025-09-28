import { PrismaClient } from "../generated/prisma";
import { Pinecone } from "@pinecone-database/pinecone";
import { createClient } from "redis";
import { RedisChatMessageHistory } from "@langchain/redis";

export const db = new PrismaClient();
export const pinecone = new Pinecone();
export const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

// export const getVectorStore = async () => {
//   return await Chroma.fromExistingCollection(embeddings, {
//     collectionName: process.env.CHROMA_COLLECTION_NAME,
//     url: process.env.CHROMA_VECTORDB_URL, // ensure chromadb is running
//   });
// };

const redisClient = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT!),
  },
});

redisClient.on("error", (err) => console.error("Redis Client Error:", err));

async function connectRedis() {
  await redisClient.connect();
  console.log("Redis client connected successfully!");
}

export { redisClient, connectRedis, RedisChatMessageHistory };
