"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";

// ========================================
// Types
// ========================================
export interface ShareButtonsProps {
  /** シェアするテキスト */
  shareText: string;
  /** シェアするURL */
  shareUrl: string;
  /** 縦並び/横並びのバリアント */
  direction?: "horizontal" | "vertical";
  /** ボタンサイズ */
  size?: "sm" | "md" | "lg";
  /** URLコピー完了時のコールバック */
  onCopySuccess?: () => void;
  /** クラス名 */
  className?: string;
}

// ========================================
// SNS Brand Colors
// ========================================
const BRAND_COLORS = {
  x: {
    default: "#000000",
    hover: "#333333",
  },
  line: {
    default: "#00B900",
    hover: "#00A000",
  },
  facebook: {
    default: "#1877F2",
    hover: "#166FE5",
  },
  copy: {
    default: "#6B7280",
    hover: "#4B5563",
  },
};

// ========================================
// Size Configuration
// ========================================
const SIZE_CONFIG = {
  sm: {
    button: "w-8 h-8",
    icon: "w-4 h-4",
  },
  md: {
    button: "w-10 h-10",
    icon: "w-5 h-5",
  },
  lg: {
    button: "w-12 h-12",
    icon: "w-6 h-6",
  },
};

// ========================================
// Animation Variants
// ========================================
const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.1 },
  tap: { scale: 0.95 },
};

const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

// ========================================
// Icons
// ========================================
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LINEIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const CopyIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
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
);

// ========================================
// Main Component
// ========================================
export default function ShareButtons({
  shareText,
  shareUrl,
  direction = "horizontal",
  size = "md",
  onCopySuccess,
  className = "",
}: ShareButtonsProps) {
  const [isCopied, setIsCopied] = useState(false);

  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(shareUrl);
  const sizeConfig = SIZE_CONFIG[size];

  // X (Twitter) シェア
  const shareToX = useCallback(() => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      "_blank",
      "noopener,noreferrer,width=550,height=420"
    );
  }, [encodedText, encodedUrl]);

  // LINE シェア
  const shareToLINE = useCallback(() => {
    window.open(
      `https://social-plugins.line.me/lineit/share?url=${encodedUrl}&text=${encodedText}`,
      "_blank",
      "noopener,noreferrer,width=550,height=420"
    );
  }, [encodedText, encodedUrl]);

  // Facebook シェア
  const shareToFacebook = useCallback(() => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      "_blank",
      "noopener,noreferrer,width=550,height=420"
    );
  }, [encodedText, encodedUrl]);

  // URLコピー
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      onCopySuccess?.();
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      // フォールバック: 古いブラウザ対応
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setIsCopied(true);
        onCopySuccess?.();
        setTimeout(() => setIsCopied(false), 2000);
      } catch (fallbackError) {
        console.error("Failed to copy URL:", fallbackError);
      }
      document.body.removeChild(textArea);
    }
  }, [shareUrl, onCopySuccess]);

  const buttons = [
    {
      id: "x",
      label: "Xでシェア",
      icon: XIcon,
      onClick: shareToX,
      color: BRAND_COLORS.x,
    },
    {
      id: "line",
      label: "LINEでシェア",
      icon: LINEIcon,
      onClick: shareToLINE,
      color: BRAND_COLORS.line,
    },
    {
      id: "facebook",
      label: "Facebookでシェア",
      icon: FacebookIcon,
      onClick: shareToFacebook,
      color: BRAND_COLORS.facebook,
    },
    {
      id: "copy",
      label: isCopied ? "コピーしました" : "URLをコピー",
      icon: isCopied ? CheckIcon : CopyIcon,
      onClick: copyToClipboard,
      color: isCopied
        ? { default: "#10B981", hover: "#059669" }
        : BRAND_COLORS.copy,
    },
  ];

  return (
    <motion.div
      className={`flex items-center gap-3 ${
        direction === "vertical" ? "flex-col" : "flex-row"
      } ${className}`}
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {buttons.map((button) => (
        <motion.button
          key={button.id}
          onClick={button.onClick}
          className={`${sizeConfig.button} rounded-full flex items-center justify-center text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2`}
          style={{
            backgroundColor: button.color.default,
          }}
          variants={itemVariants}
          whileHover={{
            scale: 1.1,
            backgroundColor: button.color.hover,
          }}
          whileTap={{ scale: 0.95 }}
          aria-label={button.label}
          title={button.label}
        >
          <button.icon className={sizeConfig.icon} />
        </motion.button>
      ))}
    </motion.div>
  );
}
