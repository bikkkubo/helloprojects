"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function StickyCTA() {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollThreshold = 10;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDiff = currentScrollY - lastScrollY.current;

      // 下スクロールで非表示、上スクロールで表示
      if (scrollDiff > scrollThreshold) {
        setIsVisible(false);
      } else if (scrollDiff < -scrollThreshold) {
        setIsVisible(true);
      }

      // ページ最上部では常に表示
      if (currentScrollY < 50) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
        >
          {/* グラデーション背景 */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 px-4 py-3 shadow-lg shadow-purple-500/20">
            {/* 上部のフェード効果 */}
            <div className="absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-purple-600/50 to-transparent pointer-events-none" />

            <div className="flex gap-3 max-w-md mx-auto">
              {/* ファンクラブ入会ボタン */}
              <Link
                href="/fanclub"
                className="flex-1 flex items-center justify-center gap-2 bg-white text-purple-600 font-bold py-3 px-4 rounded-full shadow-md hover:bg-purple-50 active:scale-95 transition-all duration-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span className="text-sm">ファンクラブ入会</span>
              </Link>

              {/* イベント申込ボタン */}
              <Link
                href="/events"
                className="flex-1 flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm text-white font-bold py-3 px-4 rounded-full border-2 border-white/50 hover:bg-white/30 active:scale-95 transition-all duration-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm">イベント申込</span>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
