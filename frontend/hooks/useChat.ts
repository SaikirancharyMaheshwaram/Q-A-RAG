"use client";

import { useState } from "react";
import api from "@/lib/axios";
import { BACKEND_URL } from "@/lib/utils";

export function useChat() {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadHistory(docId: string) {
    try {
      setLoading(true);
      const res = await api.get(`/chats/${docId}`);
      const chats = res.data.map((c: any) => [
        { role: "user", content: c.question },
        { role: "assistant", content: c.answer },
      ]);

      setMessages(chats.flat());
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to load chat history");
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage(query: string, docId?: string) {
    try {
      setLoading(true);
      setError(null);

      setMessages((prev) => [...prev, { role: "user", content: query }]);

      // const res = await api.post("/chat", { query, docId });
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ query, docId, chatId: "sample-id" }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      let done = false;
      let assistantMessage = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          buffer += decoder.decode(value, { stream: true });

          const parts = buffer.split("\n\n");
          buffer = parts.pop()!;

          for (const part of parts) {
            if (part.startsWith("data:")) {
              const jsonStr = part.replace(/^data:\s*/, "");
              try {
                const data = JSON.parse(jsonStr);
                if (data.token) {
                  assistantMessage += data.token;
                  setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1].content = assistantMessage;
                    return updated;
                  });
                }

                if (data.done) {
                  done = true;
                }
              } catch (e) {
                console.error("Failed to parse SSE chunk:", jsonStr, e);
              }
            }
          }
        }
      }
      // const response = res.data.response;
      // setMessages((prev) => [
      //   ...prev,
      //   { role: "assistant", content: response },
      // ]);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return { messages, loading, error, sendMessage, loadHistory };
}
