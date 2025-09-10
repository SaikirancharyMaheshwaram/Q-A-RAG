"use client";

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface ChatUIProps {
  messages: { role: "user" | "assistant"; content: string }[];
  loading: boolean;
  error: string | null;
  onSend: (query: string) => Promise<void>;
}

export function ChatUI({ messages, loading, error, onSend }: ChatUIProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // 🔹 Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend() {
    if (!input.trim()) return;
    await onSend(input);
    setInput("");
  }

  return (
    <div className="flex flex-col flex-1 max-w-3xl w-full mx-auto">
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-gray-50 pt-20">
        <AnimatePresence>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[75%] whitespace-pre-wrap break-words shadow ${
                  m.role === "user"
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white"
                    : "bg-white border text-gray-900"
                }`}
              >
                {m.role === "assistant" ? (
                  <ReactMarkdown
                    rehypePlugins={[rehypeHighlight]}
                    // className={"prose prose-sm max-w-none"}
                  >
                    {m.content}
                  </ReactMarkdown>
                ) : (
                  <span>{m.content}</span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="text-gray-500 italic text-sm">🤔 Thinking...</div>
        )}
        {error && (
          <div className="text-red-500 bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <div className="p-4 border-t bg-white flex items-center gap-2  sticky bottom-0">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500"
          disabled={loading}
        />
        <Button
          onClick={handleSend}
          disabled={loading}
          className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-xl"
        >
          {loading ? "..." : "Send"}
        </Button>
      </div>
    </div>
  );
}
