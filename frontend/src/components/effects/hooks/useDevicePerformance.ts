"use client";

import { useState, useEffect } from "react";

export type PerformanceMode = "high" | "medium" | "low";

interface DevicePerformanceResult {
  mode: PerformanceMode;
  isMobile: boolean;
  isLowPower: boolean;
  pixelRatio: number;
}

/**
 * デバイスのパフォーマンスレベルを検出するフック
 * - モバイルデバイス検出
 * - 低電力モード検出
 * - ハードウェア性能推定
 */
export function useDevicePerformance(): DevicePerformanceResult {
  const [result, setResult] = useState<DevicePerformanceResult>({
    mode: "high",
    isMobile: false,
    isLowPower: false,
    pixelRatio: 1,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // モバイルデバイス検出
    const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    // タッチデバイス検出
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    // 低電力モード検出（Data Saver API）
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const isLowPower = connection?.saveData === true;
    const isSlowConnection = connection?.effectiveType === "slow-2g" || connection?.effectiveType === "2g";

    // ハードウェア性能推定
    const cores = navigator.hardwareConcurrency || 4;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 4;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    // パフォーマンスモード判定
    let mode: PerformanceMode = "high";

    if (isLowPower || isSlowConnection || cores <= 2 || memory < 2) {
      mode = "low";
    } else if (isMobile || isTouch || cores <= 4 || memory < 4) {
      mode = "medium";
    }

    setResult({
      mode,
      isMobile: isMobile || isTouch,
      isLowPower: isLowPower || isSlowConnection,
      pixelRatio,
    });
  }, []);

  return result;
}

/**
 * パフォーマンスモードに応じたパーティクル数を返す
 */
export function getParticleCount(
  mode: PerformanceMode,
  type: "flame" | "star" | "tear"
): number {
  const counts = {
    high: { flame: 100, star: 200, tear: 50 },
    medium: { flame: 50, star: 100, tear: 25 },
    low: { flame: 20, star: 40, tear: 10 },
  };

  return counts[mode][type];
}

/**
 * パフォーマンスモードに応じたFPSを返す
 */
export function getTargetFPS(mode: PerformanceMode): number {
  return mode === "low" ? 30 : 60;
}
