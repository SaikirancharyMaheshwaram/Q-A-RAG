import {
  BaseMessage,
  ChatMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { makeLLM } from "../llms/google";
import { countTokens } from "./tokenCounter";

export async function summarizeMessages(
  messages: BaseMessage[],
  threshold: number,
): Promise<BaseMessage[]> {
  const totalTokens = countTokens(messages);
  if (totalTokens <= threshold) {
    console.log("not hitting the threshold");
    return messages; // nothing to do
  }

  try {
    const recent = messages.slice(-2);
    const toSummarize = messages.slice(0, messages.length - 2);
    const text = toSummarize
      .map((m) => `${m._getType()}: ${m.content}`)
      .join("\n");
    const llm = makeLLM();

    const prompt = `
    Summarize the following conversation into a concise note that keeps all facts and decisions.
    Keep it under 150 tokens. Do not invent information.

    Conversation:
    ${text}
    `;

    const summary = await llm.invoke(prompt);

    const summaryMessage = new ChatMessage({
      role: "system",
      content: JSON.stringify(summary.content),
    });

    console.log("inside summarizer to summarizer-->", summaryMessage);

    return [summaryMessage, ...recent];
  } catch (e) {
    console.log("[CATCH_SUMMARIZER]", e);

    return messages;
  }
}
