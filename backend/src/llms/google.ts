import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY!,
  model: "text-embedding-004",
});

export const makeLLM = () =>
  new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    temperature: 0.4,
    apiKey: process.env.GEMINI_API_KEY!,
  });