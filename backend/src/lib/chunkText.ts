import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";


export async function chunkText(rawText: string) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500, // max size of each chunk (in characters)
    chunkOverlap: 50, // each chunk overlaps with the previous by 200 chars
  });

  const docs = await splitter.createDocuments([rawText]);

  return docs; // Each is: { pageContent: string, metadata: {} }
}

