"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/ui/navbar";

export default function Login() {
  const [message, setMessage] = useState("");
  const router = useRouter();
  const handleLogin = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setMessage("Login failed: no credential");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3001/api/auth/google",
        {
          id_token: credentialResponse.credential,
        },
        {
          withCredentials: true,
        },
      );

      if (!res.data.success) throw new Error("Login failed");

      toast("Login Successfull");
      router.push("/dashboard");
    } catch (error) {
      toast("Login failed");
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#b67237] via-[#d89050] to-[#b67237] p-4 w-screen overflow-hidden relative">
      {/* Background Blobs */}
      <div className="absolute top-20 -left-20 w-72 h-72 bg-white/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -right-20 w-72 h-72 bg-[#ffcf9c]/40 rounded-full blur-3xl" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 w-full max-w-md text-center"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/knowflowicon.png" // replace with your logo icon
            alt="KnowFlow Logo"
            width={64}
            height={64}
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-white mb-2">
          Welcome to KnowFlow
        </h1>
        <p className="text-white/70 mb-6 text-sm">
          Sign in to continue and chat with your knowledge.
        </p>

        {/* Google Sign-In Button */}
        <GoogleLogin
          onSuccess={handleLogin}
          onError={() => toast("Login Failed")}
        />
      </motion.div>
    </div>
  );
}
