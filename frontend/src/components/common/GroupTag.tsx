'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { getGroupColor, type GroupColorInfo } from '@/constants/groupColors';

interface GroupTagProps {
  /** グループID */
  groupId: string;
  /** グループ名（指定しない場合はgroupColorsから取得） */
  groupName?: string;
  /** タグのサイズバリアント */
  size?: 'sm' | 'md' | 'lg';
  /** アイコンを表示するか */
  showIcon?: boolean;
  /** クリック可能にするか */
  clickable?: boolean;
  /** クリック時のハンドラ */
  onClick?: () => void;
  /** 追加のCSSクラス */
  className?: string;
  /** バリアント（filled: 塗りつぶし, outlined: 枠線のみ, subtle: 薄い背景） */
  variant?: 'filled' | 'outlined' | 'subtle';
}

/**
 * グループタグコンポーネント
 * グループIDに基づいてカラーコーディングされたタグを表示
 */
export default function GroupTag({
  groupId,
  groupName,
  size = 'md',
  showIcon = false,
  clickable = false,
  onClick,
  className = '',
  variant = 'filled',
}: GroupTagProps) {
  const colorInfo = useMemo(() => getGroupColor(groupId), [groupId]);
  const displayName = groupName ?? colorInfo.name;

  // サイズに応じたスタイル
  const sizeStyles = {
    sm: {
      container: 'px-2 py-0.5 text-xs gap-1',
      icon: 'w-3 h-3',
    },
    md: {
      container: 'px-3 py-1 text-sm gap-1.5',
      icon: 'w-4 h-4',
    },
    lg: {
      container: 'px-4 py-1.5 text-base gap-2',
      icon: 'w-5 h-5',
    },
  };

  // バリアントに応じたスタイル（インラインスタイルで動的カラーを適用）
  const getVariantStyles = (color: GroupColorInfo) => {
    switch (variant) {
      case 'filled':
        return {
          backgroundColor: color.color,
          color: '#FFFFFF',
          border: 'none',
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          color: color.color,
          border: `2px solid ${color.color}`,
        };
      case 'subtle':
        return {
          backgroundColor: `${color.color}20`,
          color: color.darkColor,
          border: 'none',
        };
      default:
        return {};
    }
  };

  const baseStyles = `
    inline-flex items-center rounded-full font-medium
    transition-all duration-200
    ${clickable ? 'cursor-pointer hover:opacity-80 hover:scale-105 active:scale-95' : ''}
    ${sizeStyles[size].container}
  `;

  const Tag = clickable ? 'button' : 'span';

  return (
    <Tag
      className={`${baseStyles} ${className}`}
      style={getVariantStyles(colorInfo)}
      onClick={clickable ? onClick : undefined}
      type={clickable ? 'button' : undefined}
      aria-label={clickable ? `${displayName}を選択` : undefined}
    >
      {showIcon && colorInfo.iconUrl && (
        <span className={`relative flex-shrink-0 ${sizeStyles[size].icon}`}>
          <Image
            src={colorInfo.iconUrl}
            alt=""
            fill
            className="object-contain rounded-full"
            aria-hidden="true"
          />
        </span>
      )}
      <span className="truncate">{displayName}</span>
    </Tag>
  );
}

/**
 * 複数のグループタグをまとめて表示するコンポーネント
 */
interface GroupTagListProps {
  /** グループIDの配列 */
  groupIds: string[];
  /** 各タグのサイズ */
  size?: 'sm' | 'md' | 'lg';
  /** 各タグのバリアント */
  variant?: 'filled' | 'outlined' | 'subtle';
  /** 表示する最大数（超過分は「+N」で表示） */
  maxDisplay?: number;
  /** 追加のCSSクラス */
  className?: string;
}

export function GroupTagList({
  groupIds,
  size = 'sm',
  variant = 'subtle',
  maxDisplay,
  className = '',
}: GroupTagListProps) {
  const displayIds = maxDisplay ? groupIds.slice(0, maxDisplay) : groupIds;
  const remainingCount = maxDisplay ? Math.max(0, groupIds.length - maxDisplay) : 0;

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {displayIds.map((id) => (
        <GroupTag key={id} groupId={id} size={size} variant={variant} />
      ))}
      {remainingCount > 0 && (
        <span
          className={`
            inline-flex items-center rounded-full bg-gray-200 text-gray-600 font-medium
            ${size === 'sm' ? 'px-2 py-0.5 text-xs' : ''}
            ${size === 'md' ? 'px-3 py-1 text-sm' : ''}
            ${size === 'lg' ? 'px-4 py-1.5 text-base' : ''}
          `}
        >
          +{remainingCount}
        </span>
      )}
    </div>
  );
}
