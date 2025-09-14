import { BaseMessage } from "@langchain/core/messages";

function approxTokenCount(text: string): number {
  return Math.ceil(text.split(/\s+/).length * 1.3);
}

export function countTokens(messages: BaseMessage[]): number {
  let total = 0;
  // console.log(
  //   "message from tokencounter-->" + JSON.stringify(messages, null, 2),
  // );
  for (const msg of messages) {
    const text = msg.content || "";
    total += approxTokenCount(text + "");
  }
  return total;
}
