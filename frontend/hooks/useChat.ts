"use client";

import { useState } from "react";
import axios from "axios";
import api from "@/lib/axios";

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

      const res = await api.post("/chat", { query, docId });

      const response = res.data.response;
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return { messages, loading, error, sendMessage, loadHistory };
}
