"use client";

import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FlameParticles } from "../particles/FlameParticles";
import { useEffectContext } from "../EffectProvider";
import { useReducedMotion } from "../hooks/useReducedMotion";

interface JuiceJuiceEffectProps {
  className?: string;
}

/**
 * Juice=Juice『盛れ！ミ・アモーレ』エフェクト
 * - 赤いリボン曲線（SVG + Framer Motion）
 * - 炎パーティクル
 * - 情熱的な赤のグラデーション背景
 */
export function JuiceJuiceEffect({ className }: JuiceJuiceEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { isEffectsEnabled } = useEffectContext();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // スクロールに連動した値
  const ribbonScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.9]);
  const ribbonRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const flameIntensity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.5]);
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.6, 0.3]);

  // リボンのパス（複数の曲線）
  const ribbonPaths = useMemo(() => [
    "M-100,300 C100,100 300,500 500,200 S700,400 900,300 S1100,100 1300,250",
    "M-50,400 C150,200 250,600 450,300 S650,500 850,400 S1050,200 1250,350",
    "M0,350 C200,150 350,550 550,250 S750,450 950,350 S1150,150 1350,300",
  ], []);

  if (!isEffectsEnabled && !reducedMotion) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* 背景グラデーション */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            180deg,
            rgba(139, 0, 0, 0.4) 0%,
            rgba(220, 20, 60, 0.3) 50%,
            rgba(0, 0, 0, 0.2) 100%
          )`,
          opacity: backgroundOpacity,
        }}
      />

      {/* 脈動する赤いオーラ */}
      <motion.div
        className="absolute inset-0"
        animate={reducedMotion ? {} : {
          background: [
            "radial-gradient(circle at 50% 100%, rgba(255, 69, 0, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 100%, rgba(255, 69, 0, 0.5) 0%, transparent 60%)",
            "radial-gradient(circle at 50% 100%, rgba(255, 69, 0, 0.3) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* リボンSVG */}
      {!reducedMotion && (
        <motion.svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          style={{
            scale: ribbonScale,
          }}
        >
          <defs>
            {/* リボングラデーション */}
            <linearGradient id="ribbonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b0000" />
              <stop offset="30%" stopColor="#dc143c" />
              <stop offset="50%" stopColor="#ff6347" />
              <stop offset="70%" stopColor="#dc143c" />
              <stop offset="100%" stopColor="#8b0000" />
            </linearGradient>

            {/* グロー効果 */}
            <filter id="ribbonGlow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* リボンパス */}
          {ribbonPaths.map((path, index) => (
            <motion.path
              key={index}
              d={path}
              fill="none"
              stroke="url(#ribbonGradient)"
              strokeWidth={15 - index * 3}
              strokeLinecap="round"
              filter="url(#ribbonGlow)"
              style={{
                rotate: ribbonRotate,
                opacity: 0.6 - index * 0.15,
              }}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 3 + index * 0.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: index * 0.3,
              }}
            />
          ))}
        </motion.svg>
      )}

      {/* 炎パーティクル */}
      <motion.div className="absolute inset-0" style={{ opacity: flameIntensity }}>
        <div className="relative w-full h-full">
          <FlameParticles intensity={0.8} />
        </div>
      </motion.div>

      {/* 追加の輝き */}
      {!reducedMotion && (
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px]"
          style={{
            background: "radial-gradient(ellipse at bottom, rgba(255, 99, 71, 0.4) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </div>
  );
}
