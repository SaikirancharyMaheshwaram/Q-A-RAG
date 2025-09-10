"use client";

import { motion, useReducedMotion } from "framer-motion";
import React from "react";

const spinnerVariants = {
  rotate: { rotate: 360 },
};

const dotVariants = {
  float: (i: number) => ({
    y: [0, -8, 0],
    transition: {
      repeat: Infinity,
      repeatType: "loop",
      duration: 1.2,
      delay: i * 0.12,
      ease: "easeInOut",
    },
  }),
};

function Spinner({ size = 96 }: { size?: number }) {
  const shouldReduce = useReducedMotion();

  return (
    <div className="flex flex-col items-center gap-4">
      {/* rotating gradient hub */}
      <motion.div
        aria-hidden
        className="relative rounded-full"
        style={{ width: size, height: size }}
        animate={shouldReduce ? undefined : { rotate: [0, 360] }}
        transition={
          shouldReduce
            ? undefined
            : { repeat: Infinity, ease: "linear", duration: 2.8 }
        }
      >
        {/* gradient ring */}
        <div
          className="w-full h-full rounded-full p-1"
          style={{
            background:
              "conic-gradient(from 180deg at 50% 50%, #f6d365, #fda085, #ff9a9e, #f6d365)",
            WebkitMask:
              "radial-gradient(farthest-side, transparent calc(100% - 10px), black calc(100% - 9px))",
          }}
        />
        {/* inner hub */}
        <div
          className="absolute inset-4 rounded-full"
          style={{ background: "rgba(255,255,255,0.9)" }}
        />
      </motion.div>

      <div className="text-white/90 text-sm font-medium">
        Loading documents…
      </div>

      {/* Orbiting dots */}
      <div className="flex items-center gap-2 pt-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            aria-hidden
            className="block w-3 h-3 rounded-full bg-white/90"
            custom={i}
            // @ts-ignore
            variants={dotVariants}
            animate={shouldReduce ? undefined : "float"}
          />
        ))}
      </div>
    </div>
  );
}

/** single skeleton card */
function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white/10 p-4 min-h-[120px] flex flex-col justify-between animate-pulse">
      <div className="h-6 bg-white/20 rounded w-3/4 mb-3" />
      <div className="h-3 bg-white/10 rounded w-1/2 mb-4" />
      <div className="flex justify-between items-center">
        <div className="h-8 w-20 bg-white/10 rounded" />
        <div className="h-8 w-12 bg-white/10 rounded" />
      </div>
    </div>
  );
}

export function DashboardLoader({
  showSkeletons = true,
}: {
  showSkeletons?: boolean;
}) {
  return (
    <section
      aria-live="polite"
      aria-busy="true"
      className="w-full container mx-auto py-12 px-4"
    >
      <div className="bg-gradient-to-r from-[#b67237] via-[#d89050] to-[#b67237] rounded-2xl p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="flex items-center gap-6">
            <Spinner size={88} />
            <div>
              <h3 className="text-xl font-semibold">Fetching your documents</h3>
              <p className="mt-1 text-white/90 text-sm">
                This might take a few seconds — we’re preparing the best
                results.
              </p>
            </div>
          </div>

          <div className="hidden md:block text-sm text-white/80">
            Tip: Upload PDFs, text files or markdown for better results.
          </div>
        </div>

        {showSkeletons && (
          <div className="mt-8">
            {/* responsive skeleton grid matching your card layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* Render 8 skeletons to fill the grid */}
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8, scale: 0.995 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: i * 0.03,
                    duration: 0.32,
                    ease: "easeOut",
                  }}
                >
                  <SkeletonCard />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default DashboardLoader;
