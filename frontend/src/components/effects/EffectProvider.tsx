"use client";

import React, { createContext, useContext, useMemo, ReactNode } from "react";
import { useReducedMotion } from "./hooks/useReducedMotion";
import {
  useDevicePerformance,
  PerformanceMode,
  getTargetFPS,
} from "./hooks/useDevicePerformance";

interface EffectContextValue {
  reducedMotion: boolean;
  performanceMode: PerformanceMode;
  isMobile: boolean;
  isEffectsEnabled: boolean;
  targetFPS: number;
  pixelRatio: number;
}

const EffectContext = createContext<EffectContextValue | null>(null);

interface EffectProviderProps {
  children: ReactNode;
  forceDisable?: boolean;
}

/**
 * エフェクト関連の設定をアプリ全体に提供するプロバイダー
 */
export function EffectProvider({
  children,
  forceDisable = false,
}: EffectProviderProps) {
  const reducedMotion = useReducedMotion();
  const { mode, isMobile, pixelRatio } = useDevicePerformance();

  const value = useMemo<EffectContextValue>(
    () => ({
      reducedMotion,
      performanceMode: mode,
      isMobile,
      isEffectsEnabled: !reducedMotion && !forceDisable,
      targetFPS: getTargetFPS(mode),
      pixelRatio,
    }),
    [reducedMotion, mode, isMobile, forceDisable, pixelRatio]
  );

  return (
    <EffectContext.Provider value={value}>{children}</EffectContext.Provider>
  );
}

/**
 * エフェクト設定を取得するフック
 */
export function useEffectContext(): EffectContextValue {
  const context = useContext(EffectContext);

  if (!context) {
    // プロバイダー外で使用された場合のデフォルト値
    return {
      reducedMotion: false,
      performanceMode: "high",
      isMobile: false,
      isEffectsEnabled: true,
      targetFPS: 60,
      pixelRatio: 1,
    };
  }

  return context;
}
