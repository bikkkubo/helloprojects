"use client";

import { motion } from "framer-motion";

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function ToggleSwitch({
  enabled,
  onChange,
  label,
  description,
  disabled = false,
  size = "md",
}: ToggleSwitchProps) {
  const sizeConfig = {
    sm: {
      track: "w-9 h-5",
      thumb: "w-4 h-4",
      translate: enabled ? "translateX(16px)" : "translateX(2px)",
    },
    md: {
      track: "w-11 h-6",
      thumb: "w-5 h-5",
      translate: enabled ? "translateX(20px)" : "translateX(2px)",
    },
    lg: {
      track: "w-14 h-7",
      thumb: "w-6 h-6",
      translate: enabled ? "translateX(28px)" : "translateX(2px)",
    },
  };

  const config = sizeConfig[size];

  return (
    <label
      className={`flex items-center justify-between gap-4 ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      {(label || description) && (
        <div className="flex-1">
          {label && (
            <span className="block text-sm font-medium text-gray-900">
              {label}
            </span>
          )}
          {description && (
            <span className="block text-xs text-gray-500 mt-0.5">
              {description}
            </span>
          )}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        disabled={disabled}
        onClick={() => !disabled && onChange(!enabled)}
        className={`
          relative inline-flex items-center rounded-full
          transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
          ${config.track}
          ${enabled ? "bg-purple-600" : "bg-gray-200"}
          ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        <motion.span
          className={`
            inline-block rounded-full bg-white shadow-sm
            ${config.thumb}
          `}
          animate={{
            x: enabled
              ? size === "sm"
                ? 16
                : size === "md"
                ? 20
                : 28
              : 2,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        />
      </button>
    </label>
  );
}
