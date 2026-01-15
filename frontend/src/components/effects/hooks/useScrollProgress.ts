"use client";

import { useState, useEffect, useRef, RefObject } from "react";

interface ScrollProgressResult {
  progress: number;      // 0-1 のスクロール進捗
  isInView: boolean;     // 要素が表示範囲内か
  scrollY: number;       // 現在のスクロール位置
}

interface UseScrollProgressOptions {
  offset?: number;       // 開始位置のオフセット（px）
  threshold?: number;    // Intersection Observer のしきい値
}

/**
 * 要素に対するスクロール進捗を追跡するフック
 * - 要素が画面に入ってから出るまでの進捗を0-1で返す
 * - Intersection Observer で表示判定
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  options: UseScrollProgressOptions = {}
): ScrollProgressResult {
  const { offset = 0, threshold = 0 } = options;

  const [result, setResult] = useState<ScrollProgressResult>({
    progress: 0,
    isInView: false,
    scrollY: 0,
  });

  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // スクロール進捗を計算
    const calculateProgress = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementHeight = rect.height;

      // 要素が画面に入り始めてから完全に出るまでの進捗
      const start = windowHeight - offset;
      const end = -elementHeight;
      const current = rect.top;

      // 進捗を0-1に正規化
      let progress = (start - current) / (start - end);
      progress = Math.max(0, Math.min(1, progress));

      return {
        progress,
        scrollY: window.scrollY,
      };
    };

    // Intersection Observer で表示判定
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        const isInView = entry.isIntersecting;
        const { progress, scrollY } = calculateProgress();

        setResult({
          progress: isInView ? progress : result.progress,
          isInView,
          scrollY,
        });
      },
      { threshold: [threshold, 0.1, 0.5, 0.9, 1] }
    );

    observerRef.current.observe(element);

    // スクロールイベントで進捗更新
    const handleScroll = () => {
      const { progress, scrollY } = calculateProgress();
      setResult((prev) => ({
        ...prev,
        progress: prev.isInView ? progress : prev.progress,
        scrollY,
      }));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observerRef.current?.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [ref, offset, threshold, result.progress]);

  return result;
}

/**
 * ページ全体のスクロール進捗を取得するシンプルなフック
 */
export function usePageScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollTop = window.scrollY;
      setProgress(scrollHeight > 0 ? scrollTop / scrollHeight : 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // 初期値

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return progress;
}
