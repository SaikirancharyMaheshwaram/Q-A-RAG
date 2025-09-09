"use client";

import { AuthGate } from "@/components/ui/authgate";

const ChatPage = () => {
  return (
    <AuthGate>
      <div>Dashboard</div>
    </AuthGate>
  );
};

export default ChatPage;
