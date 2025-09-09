"use client";

import { Button } from "@/components/ui/button";
import { NavBar } from "@/components/ui/navbar";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <div className="p-2 xl:container xl:mx-auto">
      <div className="relative overflow-hidden bg-gradient-to-r from-[#b67237] via-[#d89050] to-[#b67237] min-h-[80vh] rounded-3xl shadow-2xl">
        {/* Background Glow Blobs */}
        <div className="absolute top-20 -left-20 w-72 h-72 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-20 w-72 h-72 bg-[#ffcf9c]/40 rounded-full blur-3xl" />

        {/* Navbar */}
        <NavBar />

        {/* Hero Section */}
        <div className="relative flex flex-col md:flex-row items-center justify-between px-6 py-12">
          {/* Left side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-lg space-y-6 font-mono text-white/90"
          >
            <h1 className="text-4xl md:text-5xl font-bold leading-tight drop-shadow-md">
              Chat with Your Knowledge. Instantly.
            </h1>

            <div className="space-y-3 text-lg">
              <div className="flex items-start gap-2">
                <span className="text-white/50 font-bold">01.</span>
                <p>Upload docs, ask questions</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-white/50 font-bold">02.</span>
                <p>Get answers with memory-aware AI</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-white/50 font-bold">03.</span>
                <p>Knowledge that flows into answers</p>
              </div>
            </div>

            <Link href={"/login"}>
              <Button className="bg-white text-[#b67237] hover:bg-white/90 rounded-xl px-6 py-2 shadow-md">
                🚀 Try
              </Button>
            </Link>
          </motion.div>

          {/* Right side graphics */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative mt-12 md:mt-0 md:w-1/2 flex justify-center"
          >
            {/* Chat Window Mockup */}
            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-96 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/knowflowicon.png"
                  alt="KnowFlow Logo"
                  width={32}
                  height={32}
                />
                <h2 className="text-white/90 font-semibold">KnowFlow</h2>
              </div>

              <div className="space-y-3 text-sm text-white/80">
                <div className="bg-white/5 p-3 rounded-lg">
                  How do I add a user?
                </div>
                <div className="bg-[#b67237]/50 p-3 rounded-lg self-end">
                  Go to Settings → Users → Add New.
                </div>
              </div>
            </div>

            {/* Floating Docs */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-8 -left-10"
            >
              <Image src="/doc.png" alt="Doc" width={60} height={60} />
            </motion.div>
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -bottom-10 -right-8"
            >
              <Image src="/doc.png" alt="Doc" width={60} height={60} />
            </motion.div>

            {/* Glowing Knowledge Network */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute bottom-12 left-12 w-28 h-28 bg-white/20 rounded-full blur-2xl"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
