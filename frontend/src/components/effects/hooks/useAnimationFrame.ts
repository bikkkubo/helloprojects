"use client";

import { useEffect, useRef, useCallback } from "react";

interface UseAnimationFrameOptions {
  fps?: number;
  enabled?: boolean;
}

/**
 * requestAnimationFrame を使用したアニメーションループフック
 * - 自動クリーンアップ
 * - FPS制限オプション
 * - 有効/無効の切り替え
 */
export function useAnimationFrame(
  callback: (deltaTime: number, elapsed: number) => void,
  options: UseAnimationFrameOptions = {}
): void {
  const { fps = 60, enabled = true } = options;

  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const frameInterval = 1000 / fps;

  const animate = useCallback(
    (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const deltaTime = currentTime - previousTimeRef.current;
      const elapsed = currentTime - startTimeRef.current;

      // FPS制限
      if (deltaTime >= frameInterval) {
        previousTimeRef.current = currentTime - (deltaTime % frameInterval);
        callback(deltaTime, elapsed);
      }

      requestRef.current = requestAnimationFrame(animate);
    },
    [callback, frameInterval]
  );

  useEffect(() => {
    if (!enabled) {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
      return;
    }

    previousTimeRef.current = performance.now();
    startTimeRef.current = 0;
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate, enabled]);
}
