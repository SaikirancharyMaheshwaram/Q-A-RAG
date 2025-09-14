import { makeLLM } from "../llms/google";

export async function streamLLMResponse(res: any, prompt: string) {
  const llm = makeLLM();

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let finalContent = "";
  const stream = await llm.stream(prompt);

  for await (const chunk of stream) {
    const token = chunk.content;
    finalContent += token;
    res.write(`data: ${JSON.stringify({ token })}\n\n`);
  }

  res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  res.end();

  return { finalContent };
}
