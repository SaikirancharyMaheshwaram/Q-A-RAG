"use client";

import axios from "axios";
import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("atest");

  const handleLogin = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/chat", {
        withCredentials: true,
      });
      setMessage(JSON.stringify(res.data, null, 2));
    } catch (error) {
      console.log(error);
      setMessage("Login failed");
    }
  };
  return (
    <div className="text-3xl font-semibold w-4xl mx-auto border border-gray-200 h-screen p-8 m-2 ">
      <div>Protected Route</div>
      <button onClick={handleLogin}>Send test</button>
      <p>{message}</p>
    </div>
  );
}
