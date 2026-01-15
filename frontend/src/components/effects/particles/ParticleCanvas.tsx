"use client";

import { useCallback, useRef, useEffect } from "react";
import { EffectCanvas, EffectCanvasRef } from "../EffectCanvas";
import { useEffectContext } from "../EffectProvider";

// パーティクル基底クラス
export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  color: string;
  opacity: number;
}

export interface ParticleConfig {
  maxParticles: number;
  spawnRate: number;
  gravity?: number;
  wind?: number;
  fadeSpeed?: number;
}

interface ParticleCanvasProps {
  config: ParticleConfig;
  createParticle: (width: number, height: number) => Particle;
  updateParticle: (particle: Particle, deltaTime: number) => void;
  drawParticle: (
    ctx: CanvasRenderingContext2D,
    particle: Particle
  ) => void;
  className?: string;
  scrollProgress?: number;
}

/**
 * 汎用パーティクルシステムコンポーネント
 * - オブジェクトプーリング
 * - スクロール連動対応
 */
export function ParticleCanvas({
  config,
  createParticle,
  updateParticle,
  drawParticle,
  className,
  scrollProgress = 0,
}: ParticleCanvasProps) {
  const canvasRef = useRef<EffectCanvasRef>(null);
  const particlesRef = useRef<Particle[]>([]);
  const poolRef = useRef<Particle[]>([]);
  const spawnAccumulatorRef = useRef(0);

  const { performanceMode } = useEffectContext();

  // パフォーマンスモードに応じたパーティクル数調整
  const adjustedMaxParticles = Math.floor(
    config.maxParticles *
      (performanceMode === "high" ? 1 : performanceMode === "medium" ? 0.5 : 0.25)
  );

  // パーティクルをプールから取得または新規作成
  const acquireParticle = useCallback(
    (width: number, height: number): Particle => {
      if (poolRef.current.length > 0) {
        const particle = poolRef.current.pop()!;
        const newParticle = createParticle(width, height);
        Object.assign(particle, newParticle);
        return particle;
      }
      return createParticle(width, height);
    },
    [createParticle]
  );

  // パーティクルをプールに返却
  const releaseParticle = useCallback((particle: Particle) => {
    poolRef.current.push(particle);
  }, []);

  // 描画処理
  const handleDraw = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      deltaTime: number
    ) => {
      const particles = particlesRef.current;
      const dt = deltaTime / 1000; // 秒に変換

      // スポーン処理
      spawnAccumulatorRef.current += config.spawnRate * dt;
      while (
        spawnAccumulatorRef.current >= 1 &&
        particles.length < adjustedMaxParticles
      ) {
        particles.push(acquireParticle(width, height));
        spawnAccumulatorRef.current -= 1;
      }

      // 更新と描画
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];

        // 更新
        updateParticle(particle, dt);

        // 重力適用
        if (config.gravity) {
          particle.vy += config.gravity * dt;
        }

        // 風適用
        if (config.wind) {
          particle.vx += config.wind * dt;
        }

        // 位置更新
        particle.x += particle.vx;
        particle.y += particle.vy;

        // ライフ減少
        particle.life -= dt;

        // 死亡判定
        if (
          particle.life <= 0 ||
          particle.y > height + 50 ||
          particle.y < -50 ||
          particle.x < -50 ||
          particle.x > width + 50
        ) {
          releaseParticle(particles.splice(i, 1)[0]);
          continue;
        }

        // 描画
        drawParticle(ctx, particle);
      }
    },
    [
      config,
      adjustedMaxParticles,
      acquireParticle,
      releaseParticle,
      updateParticle,
      drawParticle,
    ]
  );

  // クリーンアップ
  useEffect(() => {
    return () => {
      particlesRef.current = [];
      poolRef.current = [];
    };
  }, []);

  return (
    <EffectCanvas
      ref={canvasRef}
      onDraw={handleDraw}
      className={className}
    />
  );
}
