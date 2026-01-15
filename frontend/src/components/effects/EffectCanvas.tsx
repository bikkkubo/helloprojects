"use client";

import React, {
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useAnimationFrame } from "./hooks/useAnimationFrame";
import { useEffectContext } from "./EffectProvider";

export interface EffectCanvasRef {
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
}

interface EffectCanvasProps {
  onDraw: (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    deltaTime: number,
    elapsed: number
  ) => void;
  className?: string;
  style?: React.CSSProperties;
  clearOnDraw?: boolean;
  fps?: number;
}

/**
 * 再利用可能なCanvasコンポーネント
 * - 自動リサイズ対応
 * - デバイスピクセル比対応
 * - RAFループ統合
 */
export const EffectCanvas = forwardRef<EffectCanvasRef, EffectCanvasProps>(
  function EffectCanvas(
    { onDraw, className = "", style, clearOnDraw = true, fps },
    ref
  ) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const sizeRef = useRef({ width: 0, height: 0 });

    const { isEffectsEnabled, targetFPS, pixelRatio } = useEffectContext();
    const effectiveFPS = fps ?? targetFPS;

    // refを外部に公開
    useImperativeHandle(ref, () => ({
      canvas: canvasRef.current,
      ctx: ctxRef.current,
    }));

    // キャンバスのリサイズ処理
    const resizeCanvas = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const parent = canvas.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(pixelRatio, 2);

      // 表示サイズ
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      // 実際の解像度（DPR対応）
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);

      sizeRef.current = {
        width: rect.width,
        height: rect.height,
      };

      // コンテキストを取得・設定
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
        ctxRef.current = ctx;
      }
    }, [pixelRatio]);

    // 初期化とリサイズ監視
    useEffect(() => {
      resizeCanvas();

      const resizeObserver = new ResizeObserver(() => {
        resizeCanvas();
      });

      const parent = canvasRef.current?.parentElement;
      if (parent) {
        resizeObserver.observe(parent);
      }

      return () => {
        resizeObserver.disconnect();
      };
    }, [resizeCanvas]);

    // アニメーションループ
    const draw = useCallback(
      (deltaTime: number, elapsed: number) => {
        const ctx = ctxRef.current;
        if (!ctx) return;

        const { width, height } = sizeRef.current;
        if (width === 0 || height === 0) return;

        if (clearOnDraw) {
          ctx.clearRect(0, 0, width, height);
        }

        onDraw(ctx, width, height, deltaTime, elapsed);
      },
      [onDraw, clearOnDraw]
    );

    useAnimationFrame(draw, {
      fps: effectiveFPS,
      enabled: isEffectsEnabled,
    });

    return (
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 block ${className}`}
        style={{
          pointerEvents: "none",
          ...style,
        }}
        aria-hidden="true"
      />
    );
  }
);
