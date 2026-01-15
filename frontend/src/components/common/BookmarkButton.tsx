"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type BookmarkSize = "sm" | "md" | "lg";

interface BookmarkButtonProps {
  isBookmarked: boolean;
  onToggle: () => void;
  size?: BookmarkSize;
  className?: string;
  showLabel?: boolean;
}

// サイズ別のスタイル定義
const sizeStyles: Record<
  BookmarkSize,
  { button: string; icon: string; particle: string }
> = {
  sm: {
    button: "w-8 h-8",
    icon: "w-4 h-4",
    particle: "w-1 h-1",
  },
  md: {
    button: "w-10 h-10",
    icon: "w-5 h-5",
    particle: "w-1.5 h-1.5",
  },
  lg: {
    button: "w-12 h-12",
    icon: "w-6 h-6",
    particle: "w-2 h-2",
  },
};

// パーティクルのアニメーション設定
const particleColors = [
  "#FF69B4", // ピンク
  "#FFD700", // ゴールド
  "#FF6B6B", // 赤
  "#4ECDC4", // ティール
  "#A855F7", // パープル
];

export default function BookmarkButton({
  isBookmarked,
  onToggle,
  size = "md",
  className = "",
  showLabel = false,
}: BookmarkButtonProps) {
  const [particles, setParticles] = useState<number[]>([]);
  const styles = sizeStyles[size];

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // ブックマーク追加時のみパーティクルを表示
      if (!isBookmarked) {
        // パーティクルを生成（8個）
        const newParticles = Array.from({ length: 8 }, (_, i) => Date.now() + i);
        setParticles(newParticles);

        // パーティクルを削除
        setTimeout(() => {
          setParticles([]);
        }, 800);
      }

      onToggle();
    },
    [isBookmarked, onToggle]
  );

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <motion.button
        onClick={handleClick}
        className={`${styles.button} relative flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-primary-pink focus:ring-offset-2`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={isBookmarked ? "ブックマークを解除" : "ブックマークに追加"}
      >
        {/* ブックマークアイコン */}
        <motion.svg
          className={`${styles.icon} ${
            isBookmarked ? "text-primary-pink" : "text-gray-400"
          }`}
          fill={isBookmarked ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
          initial={false}
          animate={{
            scale: isBookmarked ? [1, 1.3, 1] : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </motion.svg>

        {/* パーティクルエフェクト */}
        <AnimatePresence>
          {particles.map((id, index) => {
            const angle = (index / 8) * 360;
            const radians = (angle * Math.PI) / 180;
            const distance = 30;
            const x = Math.cos(radians) * distance;
            const y = Math.sin(radians) * distance;

            return (
              <motion.span
                key={id}
                className={`absolute ${styles.particle} rounded-full`}
                style={{
                  backgroundColor:
                    particleColors[index % particleColors.length],
                }}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0, 1.5, 0],
                  x: [0, x],
                  y: [0, y],
                  opacity: [1, 1, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                }}
              />
            );
          })}
        </AnimatePresence>

        {/* リップルエフェクト */}
        <AnimatePresence>
          {particles.length > 0 && (
            <motion.span
              className="absolute inset-0 rounded-full bg-primary-pink"
              initial={{ scale: 0.5, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </AnimatePresence>
      </motion.button>

      {/* ラベル表示（オプション） */}
      {showLabel && (
        <motion.span
          className="ml-2 text-sm font-medium text-gray-600"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {isBookmarked ? "保存済み" : "保存する"}
        </motion.span>
      )}
    </div>
  );
}
