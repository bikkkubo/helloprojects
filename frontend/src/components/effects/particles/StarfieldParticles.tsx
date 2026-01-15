"use client";

import { useCallback, useMemo, useRef } from "react";
import { EffectCanvas } from "../EffectCanvas";
import { useEffectContext } from "../EffectProvider";
import { getParticleCount } from "../hooks/useDevicePerformance";

interface Star {
  x: number;
  y: number;
  z: number; // 深度（視差用）
  size: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: { r: number; g: number; b: number };
}

interface StarfieldParticlesProps {
  className?: string;
  scrollProgress?: number; // 0-1 でスクロール連動
  speed?: number; // 流れる速度
}

// 星の色バリエーション
const STAR_COLORS = [
  { r: 255, g: 255, b: 255 }, // 白
  { r: 200, g: 220, b: 255 }, // 青白
  { r: 255, g: 240, b: 220 }, // 暖白
  { r: 150, g: 200, b: 255 }, // 水色
  { r: 100, g: 150, b: 255 }, // 青
];

/**
 * モーニング娘。用 星空パーティクルエフェクト
 * - 3層の視差効果
 * - 明滅（twinkle）
 * - スクロールでワープスピード演出
 */
export function StarfieldParticles({
  className,
  scrollProgress = 0,
  speed = 1,
}: StarfieldParticlesProps) {
  const { performanceMode, reducedMotion } = useEffectContext();
  const starsRef = useRef<Star[]>([]);
  const initializedRef = useRef(false);

  const maxStars = getParticleCount(performanceMode, "star");

  // 星を初期化
  const initializeStars = useCallback(
    (width: number, height: number) => {
      if (initializedRef.current && starsRef.current.length > 0) return;

      const stars: Star[] = [];
      for (let i = 0; i < maxStars; i++) {
        const z = Math.random() * 3 + 0.5; // 0.5-3.5 の深度
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z,
          size: (1 / z) * 3 + 0.5, // 近いほど大きい
          twinkleSpeed: Math.random() * 3 + 1,
          twinklePhase: Math.random() * Math.PI * 2,
          color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        });
      }
      starsRef.current = stars;
      initializedRef.current = true;
    },
    [maxStars]
  );

  const handleDraw = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      deltaTime: number,
      elapsed: number
    ) => {
      initializeStars(width, height);

      const stars = starsRef.current;
      const dt = deltaTime / 1000;
      const time = elapsed / 1000;

      // ワープスピード効果（スクロール連動）
      const warpFactor = 1 + scrollProgress * 5;

      // 背景グラデーション
      const bgGradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height)
      );
      bgGradient.addColorStop(0, "rgba(22, 33, 62, 0.3)");
      bgGradient.addColorStop(0.5, "rgba(10, 10, 46, 0.2)");
      bgGradient.addColorStop(1, "rgba(0, 0, 0, 0.1)");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // 星を更新・描画
      for (const star of stars) {
        // 位置更新（視差移動）
        star.y += (speed * 20 * warpFactor) / star.z * dt;

        // 画面外に出たらリセット
        if (star.y > height + 10) {
          star.y = -10;
          star.x = Math.random() * width;
        }

        // 明滅計算
        const twinkle =
          Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.3 + 0.7;
        const opacity = twinkle;

        // サイズ（ワープ時は伸びる）
        const stretchFactor = warpFactor > 1.5 ? warpFactor * 0.5 : 1;
        const displaySize = star.size * (1 + scrollProgress * 0.5);

        ctx.save();

        // グロー効果
        ctx.shadowColor = `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${opacity})`;
        ctx.shadowBlur = displaySize * 3;

        // 星本体
        ctx.fillStyle = `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${opacity})`;

        if (stretchFactor > 1) {
          // ワープ時は縦長に伸ばす
          ctx.beginPath();
          ctx.ellipse(
            star.x,
            star.y,
            displaySize * 0.5,
            displaySize * stretchFactor,
            0,
            0,
            Math.PI * 2
          );
          ctx.fill();
        } else {
          // 通常は円
          ctx.beginPath();
          ctx.arc(star.x, star.y, displaySize, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // 流れ星（ランダム発生）
      if (Math.random() < 0.002 * warpFactor) {
        const shootingStarX = Math.random() * width;
        const shootingStarY = Math.random() * height * 0.5;

        ctx.save();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
        ctx.lineWidth = 2;
        ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
        ctx.shadowBlur = 10;

        ctx.beginPath();
        ctx.moveTo(shootingStarX, shootingStarY);
        ctx.lineTo(shootingStarX + 50, shootingStarY + 50);
        ctx.stroke();
        ctx.restore();
      }
    },
    [initializeStars, scrollProgress, speed]
  );

  // アクセシビリティ：アニメーション削減時は静的表示
  if (reducedMotion) {
    return (
      <div
        className={`absolute inset-0 bg-gradient-radial from-blue-900/30 via-indigo-950/20 to-black/10 ${className}`}
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at 20px 30px, white, transparent),
            radial-gradient(1px 1px at 40px 70px, rgba(200, 220, 255, 0.8), transparent),
            radial-gradient(1px 1px at 50px 160px, white, transparent),
            radial-gradient(1px 1px at 90px 40px, rgba(150, 200, 255, 0.8), transparent),
            radial-gradient(1px 1px at 130px 80px, white, transparent),
            radial-gradient(ellipse at center, rgba(22, 33, 62, 0.5), rgba(0, 0, 0, 0.3))
          `,
          backgroundSize: "200px 200px, 200px 200px, 200px 200px, 200px 200px, 200px 200px, 100% 100%",
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <EffectCanvas onDraw={handleDraw} className={className} />
  );
}
