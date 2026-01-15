"use client";

import { useCallback, useMemo } from "react";
import { ParticleCanvas, Particle, ParticleConfig } from "./ParticleCanvas";
import { useEffectContext } from "../EffectProvider";
import { getParticleCount } from "../hooks/useDevicePerformance";

interface FlameParticlesProps {
  className?: string;
  intensity?: number; // 0-1 でスクロール連動
  baseColor?: string; // 基本色（hex）
}

// 炎の色グラデーション（黄→オレンジ→赤→透明）
const FLAME_COLORS = [
  { r: 255, g: 255, b: 100 }, // 明るい黄色
  { r: 255, g: 200, b: 50 },  // 黄色
  { r: 255, g: 150, b: 0 },   // オレンジ
  { r: 255, g: 80, b: 0 },    // 濃いオレンジ
  { r: 220, g: 20, b: 60 },   // クリムゾン
  { r: 139, g: 0, b: 0 },     // ダークレッド
];

function getFlameColor(lifeRatio: number): { r: number; g: number; b: number } {
  const index = Math.min(
    Math.floor((1 - lifeRatio) * (FLAME_COLORS.length - 1)),
    FLAME_COLORS.length - 2
  );
  const t = ((1 - lifeRatio) * (FLAME_COLORS.length - 1)) % 1;

  const c1 = FLAME_COLORS[index];
  const c2 = FLAME_COLORS[index + 1];

  return {
    r: Math.floor(c1.r + (c2.r - c1.r) * t),
    g: Math.floor(c1.g + (c2.g - c1.g) * t),
    b: Math.floor(c1.b + (c2.b - c1.b) * t),
  };
}

/**
 * Juice=Juice用 炎パーティクルエフェクト
 * - 上昇しながら消えていく
 * - 色が黄→オレンジ→赤へ変化
 * - グロー効果
 */
export function FlameParticles({
  className,
  intensity = 1,
  baseColor,
}: FlameParticlesProps) {
  const { performanceMode, reducedMotion } = useEffectContext();

  const config = useMemo<ParticleConfig>(
    () => ({
      maxParticles: getParticleCount(performanceMode, "flame"),
      spawnRate: 30 * intensity, // 秒間スポーン数
      gravity: -150, // 上向きの力（負の重力）
      wind: 0,
    }),
    [performanceMode, intensity]
  );

  const createParticle = useCallback(
    (width: number, height: number): Particle => {
      // 画面下部からランダムにスポーン
      const x = Math.random() * width;
      const y = height + Math.random() * 20;

      return {
        x,
        y,
        vx: (Math.random() - 0.5) * 50, // 左右にゆらゆら
        vy: -Math.random() * 100 - 50, // 上昇速度
        size: Math.random() * 8 + 4,
        life: Math.random() * 2 + 1, // 1-3秒
        maxLife: 3,
        color: "#ff6347",
        opacity: 1,
      };
    },
    []
  );

  const updateParticle = useCallback((particle: Particle, dt: number) => {
    // 横揺れ
    particle.vx += (Math.random() - 0.5) * 100 * dt;
    particle.vx *= 0.98; // 減衰

    // ライフに応じてサイズ縮小
    const lifeRatio = particle.life / particle.maxLife;
    particle.opacity = lifeRatio;

    // サイズも縮小
    const baseSize = 8;
    particle.size = baseSize * lifeRatio + 2;
  }, []);

  const drawParticle = useCallback(
    (ctx: CanvasRenderingContext2D, particle: Particle) => {
      const lifeRatio = particle.life / particle.maxLife;
      const color = getFlameColor(lifeRatio);

      ctx.save();

      // グロー効果
      ctx.globalCompositeOperation = "lighter";
      ctx.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, ${particle.opacity})`;
      ctx.shadowBlur = particle.size * 2;

      // パーティクル本体
      const gradient = ctx.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        particle.size
      );
      gradient.addColorStop(
        0,
        `rgba(${color.r}, ${color.g}, ${color.b}, ${particle.opacity})`
      );
      gradient.addColorStop(
        0.5,
        `rgba(${color.r}, ${color.g}, ${color.b}, ${particle.opacity * 0.5})`
      );
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    },
    []
  );

  // アクセシビリティ：アニメーション削減時は静的表示
  if (reducedMotion) {
    return (
      <div
        className={`absolute inset-0 bg-gradient-to-t from-red-500/30 via-orange-500/20 to-transparent ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <ParticleCanvas
      config={config}
      createParticle={createParticle}
      updateParticle={updateParticle}
      drawParticle={drawParticle}
      className={className}
    />
  );
}
