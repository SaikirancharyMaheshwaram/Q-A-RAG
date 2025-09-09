import { PathLike } from "fs";
import fs from "fs/promises";
import pdf from "pdf-parse";

// extracting text based on the extenstion
//
export async function extractTextFromFile(
  filePath: PathLike,
  extension: String,
) {
  if (extension === ".pdf") {
    const buffer = await fs.readFile(filePath);
    const data = await pdf(buffer);
    console.log({ data });
    return data.text;
  }
  if (extension === ".txt" || extension === ".md") {
    console.log({ filePath });
    const text = await fs.readFile(filePath, "utf-8");
    console.log({ text });
    return text;
  }
  throw new Error(`Unsupported file extension: ${extension}`);
}
