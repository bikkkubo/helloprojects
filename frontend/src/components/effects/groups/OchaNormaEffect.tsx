"use client";

import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { TearParticles } from "../particles/TearParticles";
import { useEffectContext } from "../EffectProvider";
import { useReducedMotion } from "../hooks/useReducedMotion";

interface OchaNormaEffectProps {
  className?: string;
}

/**
 * OCHA NORMA『女の愛想は武器じゃない』エフェクト
 * - 金属チェーン（SVG）
 * - 涙パーティクル
 * - 泥スプラッシュ
 * - ダークな世界観
 */
export function OchaNormaEffect({ className }: OchaNormaEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { isEffectsEnabled } = useEffectContext();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // スクロールに連動した値
  const chainSwing = useTransform(scrollYProgress, [0, 0.5, 1], [10, -10, 5]);
  const chainTension = useTransform(scrollYProgress, [0, 0.6, 0.8, 1], [0, 0, 1, 0.5]);
  const mudOpacity = useTransform(scrollYProgress, [0.5, 0.7, 1], [0, 0.4, 0.6]);
  const tearIntensity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 0.8, 1, 0.5]);

  // チェーンリンクを生成
  const chainLinks = useMemo(() => {
    const links = [];
    for (let i = 0; i < 12; i++) {
      links.push({
        id: i,
        y: i * 45,
        rotation: i % 2 === 0 ? 0 : 90,
      });
    }
    return links;
  }, []);

  if (!isEffectsEnabled && !reducedMotion) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* ダーク背景 */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            ellipse at center,
            rgba(26, 26, 26, 0.7) 0%,
            rgba(10, 10, 10, 0.8) 70%,
            rgba(0, 0, 0, 0.9) 100%
          )`,
        }}
      />

      {/* ネオンピンクのアクセント */}
      <motion.div
        className="absolute inset-0"
        style={{
          boxShadow: "inset 0 0 150px rgba(255, 0, 64, 0.1)",
        }}
        animate={reducedMotion ? {} : {
          boxShadow: [
            "inset 0 0 100px rgba(255, 0, 64, 0.1)",
            "inset 0 0 150px rgba(255, 0, 64, 0.2)",
            "inset 0 0 100px rgba(255, 0, 64, 0.1)",
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* チェーンSVG */}
      {!reducedMotion && (
        <motion.svg
          className="absolute left-1/4 top-0 w-[100px] h-full"
          viewBox="0 0 100 600"
          style={{
            x: chainSwing,
          }}
        >
          <defs>
            {/* メタリックグラデーション */}
            <linearGradient id="chainMetal" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1a1a1a" />
              <stop offset="30%" stopColor="#4a4a4a" />
              <stop offset="50%" stopColor="#c0c0c0" />
              <stop offset="70%" stopColor="#4a4a4a" />
              <stop offset="100%" stopColor="#1a1a1a" />
            </linearGradient>

            {/* グロー */}
            <filter id="chainGlow">
              <feGaussianBlur stdDeviation="1" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* チェーンリンク */}
          {chainLinks.map((link, index) => (
            <motion.g
              key={link.id}
              transform={`translate(50, ${link.y + 30})`}
            >
              <motion.ellipse
                cx="0"
                cy="0"
                rx="25"
                ry="15"
                fill="none"
                stroke="url(#chainMetal)"
                strokeWidth="8"
                filter="url(#chainGlow)"
                style={{
                  rotate: link.rotation,
                }}
                animate={{
                  rotate: link.rotation + (index % 2 === 0 ? 5 : -5),
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                  delay: index * 0.1,
                }}
              />
            </motion.g>
          ))}
        </motion.svg>
      )}

      {/* 右側のチェーン */}
      {!reducedMotion && (
        <motion.svg
          className="absolute right-1/4 top-0 w-[100px] h-full"
          viewBox="0 0 100 600"
          style={{
            x: useTransform(chainSwing, (v) => -v),
          }}
        >
          {chainLinks.map((link, index) => (
            <motion.g
              key={`right-${link.id}`}
              transform={`translate(50, ${link.y + 50})`}
            >
              <motion.ellipse
                cx="0"
                cy="0"
                rx="25"
                ry="15"
                fill="none"
                stroke="url(#chainMetal)"
                strokeWidth="8"
                filter="url(#chainGlow)"
                style={{
                  rotate: link.rotation,
                }}
                animate={{
                  rotate: link.rotation + (index % 2 === 0 ? -5 : 5),
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                  delay: index * 0.12,
                }}
              />
            </motion.g>
          ))}
        </motion.svg>
      )}

      {/* 涙パーティクル */}
      <motion.div className="absolute inset-0" style={{ opacity: tearIntensity }}>
        <div className="relative w-full h-full">
          <TearParticles intensity={0.7} />
        </div>
      </motion.div>

      {/* 泥エフェクト（下部） */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[200px]"
        style={{
          background: `linear-gradient(
            to top,
            rgba(101, 67, 33, 0.6) 0%,
            rgba(101, 67, 33, 0.3) 50%,
            transparent 100%
          )`,
          opacity: mudOpacity,
        }}
      />

      {/* 泥のスプラッシュパターン */}
      {!reducedMotion && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[100px]"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 40px 20px at 10% 100%, rgba(101, 67, 33, 0.5) 50%, transparent 50%),
              radial-gradient(ellipse 30px 15px at 30% 100%, rgba(80, 50, 20, 0.4) 50%, transparent 50%),
              radial-gradient(ellipse 50px 25px at 50% 100%, rgba(101, 67, 33, 0.5) 50%, transparent 50%),
              radial-gradient(ellipse 35px 18px at 70% 100%, rgba(80, 50, 20, 0.4) 50%, transparent 50%),
              radial-gradient(ellipse 45px 22px at 90% 100%, rgba(101, 67, 33, 0.5) 50%, transparent 50%)
            `,
            opacity: mudOpacity,
          }}
        />
      )}

      {/* ギザギザパターン（上下） */}
      {!reducedMotion && (
        <>
          <motion.svg
            className="absolute top-0 left-0 right-0 h-[30px]"
            viewBox="0 0 1200 30"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M0,15 L30,0 L60,15 L90,0 L120,15 L150,0 L180,15 L210,0 L240,15 L270,0 L300,15 L330,0 L360,15 L390,0 L420,15 L450,0 L480,15 L510,0 L540,15 L570,0 L600,15 L630,0 L660,15 L690,0 L720,15 L750,0 L780,15 L810,0 L840,15 L870,0 L900,15 L930,0 L960,15 L990,0 L1020,15 L1050,0 L1080,15 L1110,0 L1140,15 L1170,0 L1200,15"
              fill="none"
              stroke="rgba(255, 0, 64, 0.3)"
              strokeWidth="2"
              animate={{
                x: [-30, 0, -30],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </motion.svg>

          <motion.svg
            className="absolute bottom-0 left-0 right-0 h-[30px]"
            viewBox="0 0 1200 30"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M0,15 L30,30 L60,15 L90,30 L120,15 L150,30 L180,15 L210,30 L240,15 L270,30 L300,15 L330,30 L360,15 L390,30 L420,15 L450,30 L480,15 L510,30 L540,15 L570,30 L600,15 L630,30 L660,15 L690,30 L720,15 L750,30 L780,15 L810,30 L840,15 L870,30 L900,15 L930,30 L960,15 L990,30 L1020,15 L1050,30 L1080,15 L1110,30 L1140,15 L1170,30 L1200,15"
              fill="none"
              stroke="rgba(255, 0, 64, 0.3)"
              strokeWidth="2"
              animate={{
                x: [0, -30, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </motion.svg>
        </>
      )}
    </div>
  );
}
