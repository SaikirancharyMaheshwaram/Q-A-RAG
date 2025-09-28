import { Router } from "express";
import { authenticate, AuthenticatedRequest } from "../middleware/authenticate";
import multer from "multer";
import path from "path";
import fs from "fs";
import { extractTextFromFile } from "../lib/extractText";
import { db, pineconeIndex } from "../lib/db";
import { chunkText } from "../lib/chunkText";
import { embeddings } from "../llms/google";
import { Document } from "@langchain/core/documents";
import { PineconeStore } from "@langchain/pinecone";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post(
  "/",
  authenticate,
  upload.single("file"),
  async (req: AuthenticatedRequest, res) => {
    const userId = req.user.userId;

    const file = req.file;
    const p = process.env.JWT_SECRET!;

    if (!file) {
      return res.json({ message: "No file uploaded" });
    }
    const ext = path.extname(file.originalname).toLowerCase();

    if (![".pdf", ".txt", ".md"].includes(ext)) {
      fs.unlinkSync(file.path);
      return res.status(400).json({ error: "Unsupported file type" });
    }

    try {
      //extract the raw text from file
      const text = await extractTextFromFile(file.path, ext);

      //saving the metadata to postgres

      const doc = await db.document.create({
        data: {
          title: file.originalname,
          name: file.filename,
          userId,
        },
      });

      const chunks = await chunkText(text);
      const docs = chunks.map((chunk, i) => {
        return new Document({
          pageContent: chunk.pageContent,
          metadata: {
            userId,
            documentId: doc.id,
            chunkIndex: i,
          },
        });
      });

      // const vectorStore = await Chroma.fromDocuments(docs, embeddings, {
      //   collectionName: process.env.CHROMA_COLLECTION_NAME,
      //   url: process.env.CHROMA_VECTORDB_URL, // ensure chromadb is running
      // });

      await PineconeStore.fromDocuments(docs, embeddings, {
        pineconeIndex,
        maxConcurrency: 5,
      });
      console.log("uploaded successfully");

      fs.unlinkSync(file.path); // cleanup

      res.json({
        message: "File uploaded and chunked",
        chunksCount: chunks.length,
      });
    } catch (e) {
      console.log("[API/UPLOAD/CATCH]", e);
      if (file?.path) fs.unlinkSync(file.path);
      return res.status(500).json({ error: "Failed to process file" });
    }
  },
);

export default router;
