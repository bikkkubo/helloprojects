"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarEvent, CalendarType, addToCalendar } from "@/utils/calendarExport";

interface AddToCalendarButtonProps {
  event: CalendarEvent;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}

interface CalendarOption {
  type: CalendarType;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const calendarOptions: CalendarOption[] = [
  {
    type: "google",
    label: "Google Calendar",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" fill="#4285F4" />
        <path d="M12 7v5l4 2" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" />
        <rect x="6" y="6" width="12" height="12" rx="1" fill="#fff" />
        <path d="M6 10h12" stroke="#4285F4" strokeWidth="1.5" />
        <path d="M8 8h2v-2" stroke="#EA4335" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M16 8h-2v-2" stroke="#FBBC04" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <circle cx="9" cy="13" r="1" fill="#34A853" />
        <circle cx="12" cy="13" r="1" fill="#4285F4" />
        <circle cx="15" cy="13" r="1" fill="#EA4335" />
        <circle cx="9" cy="16" r="1" fill="#FBBC04" />
        <circle cx="12" cy="16" r="1" fill="#34A853" />
      </svg>
    ),
    color: "#4285F4",
  },
  {
    type: "apple",
    label: "Apple Calendar",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <rect x="3" y="4" width="18" height="17" rx="2" fill="#FF3B30" />
        <rect x="3" y="8" width="18" height="13" rx="0" fill="#fff" />
        <rect x="7" y="2" width="2" height="4" rx="1" fill="#6B7280" />
        <rect x="15" y="2" width="2" height="4" rx="1" fill="#6B7280" />
        <text x="12" y="17" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#1F2937">
          31
        </text>
      </svg>
    ),
    color: "#FF3B30",
  },
  {
    type: "outlook",
    label: "Outlook Calendar",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5">
        <rect x="2" y="3" width="20" height="18" rx="2" fill="#0078D4" />
        <rect x="4" y="7" width="16" height="12" fill="#fff" />
        <path d="M2 7h20" stroke="#0078D4" strokeWidth="2" />
        <rect x="6" y="5" width="2" height="4" rx="0.5" fill="#fff" />
        <rect x="16" y="5" width="2" height="4" rx="0.5" fill="#fff" />
        <circle cx="8" cy="12" r="1.5" fill="#0078D4" />
        <circle cx="12" cy="12" r="1.5" fill="#0078D4" />
        <circle cx="16" cy="12" r="1.5" fill="#0078D4" />
        <circle cx="8" cy="16" r="1.5" fill="#0078D4" />
        <circle cx="12" cy="16" r="1.5" fill="#0078D4" />
      </svg>
    ),
    color: "#0078D4",
  },
];

// アニメーション設定
const dropdownVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -10,
  },
  visible: {
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
    y: -10,
    transition: {
      duration: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.2,
    },
  }),
};

export default function AddToCalendarButton({
  event,
  variant = "outline",
  size = "md",
  className = "",
}: AddToCalendarButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // クリック外で閉じる
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // ESCキーで閉じる
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen]);

  const handleCalendarSelect = (type: CalendarType) => {
    addToCalendar(event, type);
    setIsOpen(false);
  };

  // ボタンスタイル
  const baseStyles =
    "font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary:
      "bg-primary text-white hover:bg-primary-dark focus:ring-primary shadow-md hover:shadow-lg",
    secondary:
      "bg-secondary-blue text-white hover:bg-blue-600 focus:ring-secondary-blue shadow-md hover:shadow-lg",
    outline:
      "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary",
    ghost: "text-gray-600 hover:bg-gray-100 focus:ring-gray-300",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm min-h-[32px]",
    md: "px-4 py-2 text-sm min-h-[40px]",
    lg: "px-5 py-2.5 text-base min-h-[48px]",
  };

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* トリガーボタン */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span>カレンダーに追加</span>
        <motion.svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </motion.button>

      {/* ドロップダウンメニュー */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute z-50 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ right: 0 }}
          >
            {/* ヘッダー */}
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <p className="text-xs font-medium text-gray-500">
                カレンダーアプリを選択
              </p>
            </div>

            {/* オプションリスト */}
            <div className="py-2">
              {calendarOptions.map((option, index) => (
                <motion.button
                  key={option.type}
                  onClick={() => handleCalendarSelect(option.type)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left group"
                  custom={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ x: 4 }}
                >
                  <div className="flex-shrink-0">{option.icon}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-text group-hover:text-primary transition-colors">
                      {option.label}
                    </p>
                    <p className="text-xs text-gray-400">
                      {option.type === "apple"
                        ? ".icsファイルをダウンロード"
                        : "新しいタブで開く"}
                    </p>
                  </div>
                  <svg
                    className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.button>
              ))}
            </div>

            {/* フッター */}
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center">
                イベント: {event.title.length > 20 ? `${event.title.slice(0, 20)}...` : event.title}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// コンパクト版（アイコンのみ）
export function AddToCalendarIconButton({
  event,
  className = "",
}: {
  event: CalendarEvent;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleCalendarSelect = (type: CalendarType) => {
    addToCalendar(event, type);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-2 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-primary shadow-sm hover:shadow-md transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="カレンダーに追加"
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
            d="M12 4v16m8-8H4"
          />
        </svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute z-50 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ right: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="py-1">
              {calendarOptions.map((option, index) => (
                <motion.button
                  key={option.type}
                  onClick={() => handleCalendarSelect(option.type)}
                  className="w-full px-3 py-2 flex items-center gap-2 hover:bg-gray-50 transition-colors text-left"
                  custom={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="flex-shrink-0 w-5 h-5">{option.icon}</div>
                  <span className="text-sm text-neutral-text">{option.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
