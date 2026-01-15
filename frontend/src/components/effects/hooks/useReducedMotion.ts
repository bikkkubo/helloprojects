"use client";

import { useState, useEffect } from "react";

/**
 * prefers-reduced-motion メディアクエリを検出するフック
 * アクセシビリティ対応：ユーザーがアニメーション削減を希望している場合にtrueを返す
 */
export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // SSR対応：windowがない場合はfalseを維持
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    // 初期値を設定
    setReducedMotion(mediaQuery.matches);

    // 変更を監視
    const handleChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return reducedMotion;
}
