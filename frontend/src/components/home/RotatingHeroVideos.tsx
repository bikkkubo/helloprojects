"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Button from "@/components/common/Button";

// グループビデオ設定
interface GroupVideo {
  groupId: string;
  groupName: string;
  groupNameEn?: string;
  videoSrc: string;
  themeColor: string;
  groupUrl: string;
}

// 各グループのビデオ設定（ローカルファイル）
const GROUP_VIDEOS: GroupVideo[] = [
  {
    groupId: "morning-musume",
    groupName: "モーニング娘。'25",
    groupNameEn: "Morning Musume '25",
    videoSrc: "/videos/hero/morning-musume.mp4",
    themeColor: "#E4007F",
    groupUrl: "/groups/morning-musume",
  },
  {
    groupId: "angerme",
    groupName: "アンジュルム",
    groupNameEn: "ANGERME",
    videoSrc: "/videos/hero/angerme.mp4",
    themeColor: "#0082C8",
    groupUrl: "/groups/angerme",
  },
  {
    groupId: "juice-juice",
    groupName: "Juice=Juice",
    groupNameEn: "Juice=Juice",
    videoSrc: "/videos/hero/juice-juice.mp4",
    themeColor: "#8E44AD",
    groupUrl: "/groups/juice-juice",
  },
  {
    groupId: "tsubaki-factory",
    groupName: "つばきファクトリー",
    groupNameEn: "Tsubaki Factory",
    videoSrc: "/videos/hero/tsubaki-factory.mp4",
    themeColor: "#FF69B4",
    groupUrl: "/groups/tsubaki-factory",
  },
  {
    groupId: "beyooooonds",
    groupName: "BEYOOOOONDS",
    groupNameEn: "BEYOOOOONDS",
    videoSrc: "/videos/hero/beyooooonds.mp4",
    themeColor: "#27AE60",
    groupUrl: "/groups/beyooooonds",
  },
  {
    groupId: "ocha-norma",
    groupName: "OCHA NORMA",
    groupNameEn: "OCHA NORMA",
    videoSrc: "/videos/hero/ocha-norma.mp4",
    themeColor: "#00A884",
    groupUrl: "/groups/ocha-norma",
  },
  {
    groupId: "rosy-chronicle",
    groupName: "ロージークロニクル",
    groupNameEn: "Rosy Chronicle",
    videoSrc: "/videos/hero/rosy-chronicle.mp4",
    themeColor: "#E91E63",
    groupUrl: "/groups/rosy-chronicle",
  },
];

// ローテーション間隔（ミリ秒）
const ROTATION_INTERVAL = 10000;

export default function RotatingHeroVideos() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const rotationTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentGroup = GROUP_VIDEOS[currentIndex];

  // 次のグループに切り替え
  const goToNext = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % GROUP_VIDEOS.length);
      setIsTransitioning(false);
    }, 500);
  }, []);

  // ドットインジケーターをクリック
  const goToIndex = useCallback(
    (index: number) => {
      if (index === currentIndex) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(index);
        setIsTransitioning(false);
      }, 500);
    },
    [currentIndex]
  );

  // 動画の再生制御
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentIndex) {
          video.currentTime = 0;
          video.play().catch(() => {
            // Autoplay blocked, ignore
          });
        } else {
          video.pause();
        }
      }
    });
  }, [currentIndex]);

  // ローテーションタイマー
  useEffect(() => {
    rotationTimerRef.current = setInterval(goToNext, ROTATION_INTERVAL);

    return () => {
      if (rotationTimerRef.current) {
        clearInterval(rotationTimerRef.current);
      }
    };
  }, [goToNext]);

  return (
    <section className="relative min-h-[500px] md:min-h-[600px] lg:min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* 背景動画 */}
      {GROUP_VIDEOS.map((group, index) => (
        <div
          key={group.groupId}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <video
            ref={(el) => {
              videoRefs.current[index] = el;
            }}
            src={group.videoSrc}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover"
            muted
            loop
            playsInline
            preload="auto"
          />
        </div>
      ))}

      {/* オーバーレイ（トランジション用） */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="absolute inset-0 bg-black z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      {/* 常時オーバーレイ */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* グラデーションオーバーレイ */}
      <motion.div
        className="absolute inset-0 z-10"
        animate={{
          background: `linear-gradient(135deg, ${currentGroup.themeColor}40 0%, transparent 50%, ${currentGroup.themeColor}20 100%)`,
        }}
        transition={{ duration: 1 }}
      />

      {/* コンテンツ */}
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
        {/* グループ名 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentGroup.groupId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <span
              className="inline-block px-6 py-2 rounded-full text-sm font-bold mb-4 backdrop-blur-sm"
              style={{
                backgroundColor: `${currentGroup.themeColor}80`,
                color: "white",
              }}
            >
              {currentGroup.groupNameEn || currentGroup.groupName}
            </span>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-lg">
              {currentGroup.groupName}
            </h1>
          </motion.div>
        </AnimatePresence>

        {/* CTAボタン */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Link href={currentGroup.groupUrl}>
            <Button
              size="lg"
              className="w-full sm:w-auto text-white border-white hover:bg-white/20"
              style={{
                backgroundColor: currentGroup.themeColor,
                borderColor: currentGroup.themeColor,
              }}
            >
              グループページへ
            </Button>
          </Link>
          <Link href="/groups">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-white text-white hover:bg-white/20"
            >
              全グループ一覧
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* ドットインジケーター */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {GROUP_VIDEOS.map((group, index) => (
          <button
            key={group.groupId}
            onClick={() => goToIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "scale-125"
                : "bg-white/50 hover:bg-white/80"
            }`}
            style={{
              backgroundColor:
                index === currentIndex ? group.themeColor : undefined,
            }}
            aria-label={`${group.groupName}に切り替え`}
          />
        ))}
      </div>

      {/* プログレスバー */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
        <motion.div
          className="h-full"
          style={{ backgroundColor: currentGroup.themeColor }}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{
            duration: ROTATION_INTERVAL / 1000,
            ease: "linear",
          }}
          key={currentIndex}
        />
      </div>
    </section>
  );
}
