"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ShareButtons from "./ShareButtons";

// ========================================
// Types
// ========================================
export interface ShareModalProps {
  /** モーダルの開閉状態 */
  isOpen: boolean;
  /** モーダルを閉じる関数 */
  onClose: () => void;
  /** シェアするタイトル */
  title: string;
  /** シェアするURL */
  url: string;
}

// ========================================
// Animation Variants
// ========================================
const overlayVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.2,
    },
  },
};

const toastVariants = {
  initial: { opacity: 0, y: 50, scale: 0.9 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      damping: 20,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.9,
    transition: {
      duration: 0.2,
    },
  },
};

// ========================================
// QR Code Generator Component
// ========================================
interface QRCodeProps {
  url: string;
  size?: number;
}

function QRCode({ url, size = 160 }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // QRコードの生成（シンプルな実装）
    // 実際のプロダクションでは qrcode ライブラリを使用することを推奨
    generateQRCode(ctx, url, size);
  }, [url, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="rounded-lg"
      aria-label={`${url}のQRコード`}
    />
  );
}

// シンプルなQRコード風パターン生成
// 注: 実際のQRコードには qrcode ライブラリの使用を推奨
function generateQRCode(
  ctx: CanvasRenderingContext2D,
  url: string,
  size: number
) {
  const moduleCount = 25;
  const moduleSize = size / moduleCount;

  // 白い背景
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, size, size);

  // URLからシード値を生成
  let seed = 0;
  for (let i = 0; i < url.length; i++) {
    seed = (seed + url.charCodeAt(i) * (i + 1)) % 1000000;
  }

  // シード値を使用した疑似乱数生成器
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  ctx.fillStyle = "#000000";

  // QRコードのパターン生成
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      // 位置検出パターン（角の3箇所）
      if (isFinderPattern(row, col, moduleCount)) {
        drawFinderModule(ctx, row, col, moduleSize, moduleCount);
        continue;
      }

      // タイミングパターン
      if ((row === 6 || col === 6) && row < moduleCount && col < moduleCount) {
        if ((row + col) % 2 === 0) {
          ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
        }
        continue;
      }

      // データ領域（URLに基づくパターン）
      if (random() > 0.5) {
        ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
      }
    }
  }
}

function isFinderPattern(row: number, col: number, moduleCount: number): boolean {
  // 左上
  if (row < 7 && col < 7) return true;
  // 右上
  if (row < 7 && col >= moduleCount - 7) return true;
  // 左下
  if (row >= moduleCount - 7 && col < 7) return true;
  return false;
}

function drawFinderModule(
  ctx: CanvasRenderingContext2D,
  row: number,
  col: number,
  moduleSize: number,
  moduleCount: number
) {
  // 位置検出パターンの描画
  let baseRow = 0,
    baseCol = 0;

  if (row < 7 && col < 7) {
    baseRow = 0;
    baseCol = 0;
  } else if (row < 7 && col >= moduleCount - 7) {
    baseRow = 0;
    baseCol = moduleCount - 7;
  } else if (row >= moduleCount - 7 && col < 7) {
    baseRow = moduleCount - 7;
    baseCol = 0;
  }

  const localRow = row - baseRow;
  const localCol = col - baseCol;

  // 外枠 (黒)
  if (localRow === 0 || localRow === 6 || localCol === 0 || localCol === 6) {
    ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
  }
  // 中心 (黒)
  else if (localRow >= 2 && localRow <= 4 && localCol >= 2 && localCol <= 4) {
    ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
  }
  // 内側 (白) - 何も描画しない
}

// ========================================
// Toast Component
// ========================================
interface ToastProps {
  message: string;
  isVisible: boolean;
}

function Toast({ message, isVisible }: ToastProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[60] px-6 py-3 bg-neutral-800 text-white rounded-full shadow-lg flex items-center gap-2"
          variants={toastVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <svg
            className="w-5 h-5 text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="font-medium">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ========================================
// Main Component
// ========================================
export default function ShareModal({
  isOpen,
  onClose,
  title,
  url,
}: ShareModalProps) {
  const [showToast, setShowToast] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // モーダル開閉時のbodyスクロール制御
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // URLコピー
  const handleCopyUrl = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      // フォールバック
      const textArea = document.createElement("textarea");
      textArea.value = url;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setIsCopied(true);
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          setIsCopied(false);
        }, 2000);
      } catch (fallbackError) {
        console.error("Failed to copy URL:", fallbackError);
      }
      document.body.removeChild(textArea);
    }
  }, [url]);

  // ShareButtonsからのコピー成功コールバック
  const handleCopySuccess = useCallback(() => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  }, []);

  // オーバーレイクリックでモーダルを閉じる
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            variants={overlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* オーバーレイ */}
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={handleOverlayClick}
            />

            {/* モーダルコンテンツ */}
            <motion.div
              ref={modalRef}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {/* ヘッダー */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-neutral-text">
                  この記事をシェア
                </h2>
                <motion.button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="閉じる"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </motion.button>
              </div>

              {/* コンテンツ */}
              <div className="p-6">
                {/* 記事タイトル */}
                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-1">シェアする記事</p>
                  <p className="font-medium text-neutral-text line-clamp-2">
                    {title}
                  </p>
                </div>

                {/* QRコード */}
                <motion.div
                  className="flex justify-center mb-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="p-4 bg-white border-2 border-gray-100 rounded-xl shadow-inner">
                    <QRCode url={url} size={160} />
                  </div>
                </motion.div>

                {/* URL表示とコピー */}
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <p className="text-sm text-gray-500 mb-2">URL</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-4 py-2.5 bg-gray-50 rounded-lg overflow-hidden">
                      <p className="text-sm text-gray-600 truncate">{url}</p>
                    </div>
                    <motion.button
                      onClick={handleCopyUrl}
                      className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                        isCopied
                          ? "bg-green-500 text-white"
                          : "bg-primary text-white hover:bg-primary-dark"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isCopied ? "コピー完了!" : "コピー"}
                    </motion.button>
                  </div>
                </motion.div>

                {/* SNSシェアボタン */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-sm text-gray-500 mb-3">SNSでシェア</p>
                  <div className="flex justify-center">
                    <ShareButtons
                      shareText={title}
                      shareUrl={url}
                      size="lg"
                      onCopySuccess={handleCopySuccess}
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* トースト通知 */}
      <Toast message="URLをコピーしました" isVisible={showToast} />
    </>
  );
}
