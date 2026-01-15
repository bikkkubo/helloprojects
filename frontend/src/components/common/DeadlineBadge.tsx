'use client';

import { useMemo } from 'react';

interface DeadlineBadgeProps {
  /** 締切日時 (ISO 8601形式の文字列またはDateオブジェクト) */
  deadline: string | Date;
  /** バッジのサイズ */
  size?: 'sm' | 'md' | 'lg';
  /** 追加のCSSクラス */
  className?: string;
  /** 締切を過ぎた場合の表示テキスト */
  expiredText?: string;
}

interface DeadlineState {
  daysRemaining: number;
  hoursRemaining: number;
  isExpired: boolean;
  urgency: 'critical' | 'warning' | 'caution' | 'normal' | 'expired';
}

/**
 * 締切日時から残り日数と緊急度を計算
 */
function calculateDeadlineState(deadline: string | Date): DeadlineState {
  const deadlineDate = typeof deadline === 'string' ? new Date(deadline) : deadline;
  const now = new Date();
  const diffMs = deadlineDate.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffMs <= 0) {
    return {
      daysRemaining: 0,
      hoursRemaining: 0,
      isExpired: true,
      urgency: 'expired',
    };
  }

  let urgency: DeadlineState['urgency'];
  if (diffDays <= 1) {
    urgency = 'critical';
  } else if (diffDays <= 3) {
    urgency = 'warning';
  } else if (diffDays <= 7) {
    urgency = 'caution';
  } else {
    urgency = 'normal';
  }

  return {
    daysRemaining: Math.ceil(diffDays),
    hoursRemaining: Math.ceil(diffHours),
    isExpired: false,
    urgency,
  };
}

/**
 * 締切強調バッジコンポーネント
 * 締切までの残り日数に応じて色とアニメーションを変更
 */
export default function DeadlineBadge({
  deadline,
  size = 'md',
  className = '',
  expiredText = '締切終了',
}: DeadlineBadgeProps) {
  const state = useMemo(() => calculateDeadlineState(deadline), [deadline]);

  // サイズに応じたスタイル
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  // 緊急度に応じたスタイル
  const urgencyStyles = {
    critical: 'bg-red-500 text-white animate-deadline-pulse',
    warning: 'bg-orange-500 text-white',
    caution: 'bg-yellow-400 text-yellow-900',
    normal: 'bg-gray-200 text-gray-700',
    expired: 'bg-gray-400 text-white',
  };

  // 緊急度に応じたアイコン
  const urgencyIcons = {
    critical: '🔴',
    warning: '🟠',
    caution: '🟡',
    normal: '🟢',
    expired: '⚫',
  };

  // 表示テキストの生成
  const displayText = useMemo(() => {
    if (state.isExpired) {
      return expiredText;
    }

    switch (state.urgency) {
      case 'critical':
        if (state.hoursRemaining <= 24) {
          return state.hoursRemaining <= 1
            ? '締切間近！'
            : `締切間近！残り${state.hoursRemaining}時間`;
        }
        return '締切間近！';
      case 'warning':
        return `残り${state.daysRemaining}日`;
      case 'caution':
        return `あと${state.daysRemaining}日`;
      case 'normal':
        return `あと${state.daysRemaining}日`;
      default:
        return '';
    }
  }, [state, expiredText]);

  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full font-medium
        ${sizeStyles[size]}
        ${urgencyStyles[state.urgency]}
        ${className}
      `}
      role="status"
      aria-label={`締切まで${state.isExpired ? '終了' : `${state.daysRemaining}日`}`}
    >
      <span className="flex-shrink-0" aria-hidden="true">
        {urgencyIcons[state.urgency]}
      </span>
      <span>{displayText}</span>
    </span>
  );
}

/**
 * 締切までの日数のみを取得するユーティリティ
 */
export function getDaysUntilDeadline(deadline: string | Date): number {
  const state = calculateDeadlineState(deadline);
  return state.daysRemaining;
}

/**
 * 締切の緊急度を取得するユーティリティ
 */
export function getDeadlineUrgency(deadline: string | Date): DeadlineState['urgency'] {
  const state = calculateDeadlineState(deadline);
  return state.urgency;
}
