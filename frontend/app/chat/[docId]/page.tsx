"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChatUI } from "@/components/chatui";
import { useChat } from "@/hooks/useChat";

export default function ChatPage() {
  const { docId } = useParams<{ docId: string }>();
  const { messages, loading, error, sendMessage, loadHistory } = useChat();
  const generateUUID = () => crypto.randomUUID();
  useEffect(() => {
    if (docId) loadHistory(docId);
    const storedChatId = localStorage.getItem(docId);
    if (!storedChatId) {
      const newChatId = generateUUID();

      localStorage.setItem(docId, newChatId);
    }
  }, [docId]);

  return (
    <div className="flex flex-col h-screen ">
      {/* Header */}
      <div className="flex items-center justify-between bg-amber-600 text-white px-6 py-4 shadow-md fixed w-screen z-50">
        <Button
          variant="ghost"
          className="text-white hover:bg-amber-700"
          onClick={() => history.back()}
        >
          ← Back
        </Button>
        <div className="font-semibold text-lg truncate max-w-sm">
          Chatting with Document <span className="font-mono">{docId}</span>
        </div>
        <div className="opacity-70 font-semibold0128">KnowFlow</div>
      </div>

      {/* Chat */}
      <div className="flex-1 flex">
        <ChatUI
          messages={messages}
          loading={loading}
          error={error}
          onSend={(q) => sendMessage(q, docId)}
        />
      </div>
    </div>
  );
}
