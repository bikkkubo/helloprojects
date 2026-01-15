"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { StarfieldParticles } from "../particles/StarfieldParticles";
import { useEffectContext } from "../EffectProvider";
import { useReducedMotion } from "../hooks/useReducedMotion";

interface MorningMusumeEffectProps {
  className?: string;
}

/**
 * モーニング娘。'26『てか HAPPYのHAPPY!』エフェクト
 * - 星空パーティクル（視差効果）
 * - ホログラフィックグリッド
 * - 宇宙的な青のグラデーション
 */
export function MorningMusumeEffect({ className }: MorningMusumeEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { isEffectsEnabled } = useEffectContext();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // スクロールに連動した値
  const gridRotateX = useTransform(scrollYProgress, [0, 1], [60, 75]);
  const gridScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.3, 1]);
  const warpSpeed = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.5, 0.8, 0.3]);

  if (!isEffectsEnabled && !reducedMotion) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* 宇宙背景グラデーション */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            ellipse at center,
            rgba(22, 33, 62, 0.6) 0%,
            rgba(10, 10, 46, 0.5) 50%,
            rgba(0, 0, 0, 0.4) 100%
          )`,
        }}
      />

      {/* 星空パーティクル */}
      <motion.div className="absolute inset-0">
        <div className="relative w-full h-full">
          <StarfieldParticles
            scrollProgress={warpSpeed.get()}
            speed={1.5}
          />
        </div>
      </motion.div>

      {/* ホログラフィックグリッド */}
      {!reducedMotion && (
        <motion.div
          className="absolute inset-0"
          style={{
            perspective: "1000px",
            perspectiveOrigin: "50% 100%",
          }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              rotateX: gridRotateX,
              scale: gridScale,
              transformStyle: "preserve-3d",
              backgroundImage: `
                linear-gradient(to right, rgba(0, 212, 255, 0.15) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0, 212, 255, 0.15) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
              maskImage: "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)",
            }}
          />

          {/* グリッドのグロー効果 */}
          <motion.div
            className="absolute inset-0"
            style={{
              rotateX: gridRotateX,
              scale: gridScale,
              transformStyle: "preserve-3d",
              backgroundImage: `
                linear-gradient(to right, rgba(0, 212, 255, 0.3) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0, 212, 255, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
              filter: "blur(2px)",
              opacity: 0.5,
              maskImage: "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)",
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      )}

      {/* ホログラムの光線 */}
      {!reducedMotion && (
        <>
          <motion.div
            className="absolute top-1/2 left-0 right-0 h-px"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.5), transparent)",
            }}
            animate={{
              opacity: [0, 1, 0],
              scaleX: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-0 bottom-0 left-1/2 w-px"
            style={{
              background: "linear-gradient(180deg, transparent, rgba(0, 212, 255, 0.3), transparent)",
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
        </>
      )}

      {/* 中央の輝き */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(0, 212, 255, 0.2) 0%, transparent 70%)",
        }}
        animate={reducedMotion ? {} : {
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
