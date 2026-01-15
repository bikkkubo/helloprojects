"use client";

import { useEffect, useRef, useState } from "react";
import type { YTPlayer } from "@/types/youtube";

interface YouTubeBackgroundProps {
  videoId: string;
  startTime?: number; // 開始秒数
  endTime?: number; // 終了秒数（ループ用）
  className?: string;
}

/**
 * YouTube動画を背景として表示するコンポーネント
 * - 自動再生、ミュート、ループ対応
 * - コントロール非表示
 */
export function YouTubeBackground({
  videoId,
  startTime = 0,
  endTime,
  className = "",
}: YouTubeBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [, setIsReady] = useState(false);
  const checkTimeRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // YouTube IFrame API をロード
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // API準備完了時のコールバック
    const onYouTubeIframeAPIReady = () => {
      if (!containerRef.current) return;

      // 既存のプレイヤーがあれば削除
      const existingPlayer = document.getElementById(`youtube-player-${videoId}`);
      if (existingPlayer) {
        existingPlayer.remove();
      }

      // プレイヤー用のdivを作成
      const playerDiv = document.createElement("div");
      playerDiv.id = `youtube-player-${videoId}`;
      // プレイヤーコンテナのスタイル（動画を画面全体に広げる）
      playerDiv.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100vw;
        height: 56.25vw;
        min-height: 100%;
        min-width: 177.77vh;
      `;
      containerRef.current.appendChild(playerDiv);

      playerRef.current = new window.YT.Player(playerDiv.id, {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          showinfo: 0,
          rel: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          start: startTime,
          loop: 1,
          playlist: videoId, // ループには必要
          disablekb: 1,
          fs: 0,
          cc_load_policy: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            event.target.playVideo();
            setIsReady(true);
          },
          onStateChange: (event) => {
            // 動画が終了したら指定位置から再生
            if (event.data === window.YT.PlayerState.ENDED) {
              event.target.seekTo(startTime, true);
              event.target.playVideo();
            }
            // endTimeが設定されていて、その時間を超えたらループ
            if (endTime && event.data === window.YT.PlayerState.PLAYING) {
              // 前のタイマーをクリア
              if (checkTimeRef.current) {
                clearInterval(checkTimeRef.current);
              }
              checkTimeRef.current = setInterval(() => {
                if (playerRef.current) {
                  const currentTime = playerRef.current.getCurrentTime();
                  if (currentTime >= endTime) {
                    playerRef.current.seekTo(startTime, true);
                  }
                }
              }, 1000);
            } else if (event.data !== window.YT.PlayerState.PLAYING) {
              // 再生中以外はタイマーをクリア
              if (checkTimeRef.current) {
                clearInterval(checkTimeRef.current);
                checkTimeRef.current = null;
              }
            }
          },
        },
      });
    };

    // APIがすでにロードされているか確認
    if (window.YT && window.YT.Player) {
      onYouTubeIframeAPIReady();
    } else {
      // グローバルコールバックを設定
      window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    }

    return () => {
      if (checkTimeRef.current) {
        clearInterval(checkTimeRef.current);
      }
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId, startTime, endTime]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      {/* オーバーレイ（暗くする） */}
      <div className="absolute inset-0 bg-black/30 z-10" />
    </div>
  );
}
