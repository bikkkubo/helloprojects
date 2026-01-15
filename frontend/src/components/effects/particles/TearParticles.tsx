"use client";

import { useCallback, useMemo } from "react";
import { ParticleCanvas, Particle, ParticleConfig } from "./ParticleCanvas";
import { useEffectContext } from "../EffectProvider";
import { getParticleCount } from "../hooks/useDevicePerformance";

interface TearParticlesProps {
  className?: string;
  intensity?: number; // 0-1 でスクロール連動
}

/**
 * OCHA NORMA用 涙パーティクルエフェクト
 * - 重力に従って落下
 * - 涙の形状
 * - 軌跡（トレイル）効果
 */
export function TearParticles({
  className,
  intensity = 1,
}: TearParticlesProps) {
  const { performanceMode, reducedMotion } = useEffectContext();

  const config = useMemo<ParticleConfig>(
    () => ({
      maxParticles: getParticleCount(performanceMode, "tear"),
      spawnRate: 10 * intensity,
      gravity: 300, // 下向きの重力
      wind: 0,
    }),
    [performanceMode, intensity]
  );

  const createParticle = useCallback(
    (width: number, height: number): Particle => {
      return {
        x: Math.random() * width,
        y: -20,
        vx: (Math.random() - 0.5) * 20,
        vy: Math.random() * 30 + 20,
        size: Math.random() * 4 + 3,
        life: Math.random() * 3 + 2,
        maxLife: 5,
        color: "#b8d4e8", // 涙の青白い色
        opacity: 0.7,
      };
    },
    []
  );

  const updateParticle = useCallback((particle: Particle, dt: number) => {
    // 軽い横揺れ
    particle.vx += Math.sin(particle.y * 0.02) * 10 * dt;
    particle.vx *= 0.99;

    // 透明度は一定
    const lifeRatio = particle.life / particle.maxLife;
    particle.opacity = Math.min(lifeRatio * 1.5, 0.8);
  }, []);

  const drawParticle = useCallback(
    (ctx: CanvasRenderingContext2D, particle: Particle) => {
      ctx.save();

      // 涙の形を描画（ティアドロップ）
      const x = particle.x;
      const y = particle.y;
      const size = particle.size;

      // グロー効果
      ctx.shadowColor = `rgba(184, 212, 232, ${particle.opacity})`;
      ctx.shadowBlur = size * 2;

      // 涙の形状（ベジェ曲線）
      ctx.beginPath();
      ctx.moveTo(x, y - size * 1.5); // 上の尖った部分
      ctx.bezierCurveTo(
        x + size * 0.8,
        y - size * 0.5,
        x + size,
        y + size * 0.3,
        x,
        y + size // 下の丸い部分
      );
      ctx.bezierCurveTo(
        x - size,
        y + size * 0.3,
        x - size * 0.8,
        y - size * 0.5,
        x,
        y - size * 1.5
      );

      // グラデーション塗りつぶし
      const gradient = ctx.createLinearGradient(x - size, y, x + size, y);
      gradient.addColorStop(0, `rgba(150, 190, 220, ${particle.opacity * 0.5})`);
      gradient.addColorStop(0.5, `rgba(184, 212, 232, ${particle.opacity})`);
      gradient.addColorStop(1, `rgba(150, 190, 220, ${particle.opacity * 0.5})`);

      ctx.fillStyle = gradient;
      ctx.fill();

      // ハイライト
      ctx.beginPath();
      ctx.ellipse(
        x - size * 0.3,
        y - size * 0.5,
        size * 0.2,
        size * 0.3,
        -0.3,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity * 0.6})`;
      ctx.fill();

      ctx.restore();
    },
    []
  );

  // アクセシビリティ：アニメーション削減時は静的表示
  if (reducedMotion) {
    return (
      <div
        className={`absolute inset-0 ${className}`}
        style={{
          backgroundImage: `
            linear-gradient(180deg, transparent 0%, rgba(184, 212, 232, 0.1) 100%)
          `,
        }}
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
