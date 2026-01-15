"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSettings } from "@/hooks/useSettings";
import { useBookmarks } from "@/hooks/useBookmarks";
import {
  SettingsCard,
  ToggleSwitch,
  GroupSelectGrid,
  ThemeColorPicker,
  DataExportImport,
} from "@/components/mypage";

export default function MyPage() {
  const {
    settings,
    isLoaded,
    toggleFavoriteGroup,
    updateNotifications,
    toggleNotifications,
    setThemeColor,
    exportSettings,
    importSettings,
    resetSettings,
  } = useSettings();

  const { getCount, getCountByCategory } = useBookmarks();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヒーローセクション */}
      <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 text-white">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">マイページ</h1>
                <p className="text-white/80 mt-1">
                  あなたの設定をカスタマイズ
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* 推しグループ設定 */}
          <SettingsCard
            title="推しグループ設定"
            description="推しグループを選択すると、関連ニュースを優先表示します"
            icon={
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
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            }
          >
            <GroupSelectGrid
              selectedGroups={settings.favoriteGroups}
              onToggle={toggleFavoriteGroup}
            />
          </SettingsCard>

          {/* ブックマーク */}
          <SettingsCard
            title="ブックマーク"
            description="保存したコンテンツを管理"
            icon={
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
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            }
          >
            <div className="space-y-4">
              {/* ブックマーク統計 */}
              <div className="grid grid-cols-3 gap-4">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="bg-purple-50 rounded-xl p-4 text-center"
                >
                  <div className="text-2xl font-bold text-purple-600">
                    {getCountByCategory("news")}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">ニュース</div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="bg-pink-50 rounded-xl p-4 text-center"
                >
                  <div className="text-2xl font-bold text-pink-600">
                    {getCountByCategory("event")}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">イベント</div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="bg-blue-50 rounded-xl p-4 text-center"
                >
                  <div className="text-2xl font-bold text-blue-600">
                    {getCountByCategory("member")}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">メンバー</div>
                </motion.div>
              </div>

              {/* ブックマークページへのリンク */}
              <Link
                href="/bookmarks"
                className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-700 font-medium">
                    ブックマーク一覧を見る
                  </span>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full text-xs font-medium">
                    {getCount()}件
                  </span>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors"
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
              </Link>
            </div>
          </SettingsCard>

          {/* 通知設定 */}
          <SettingsCard
            title="通知設定"
            description="プッシュ通知の設定（将来の拡張用）"
            icon={
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
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            }
          >
            <div className="space-y-4">
              {/* メイン通知トグル */}
              <div className="pb-4 border-b border-gray-100">
                <ToggleSwitch
                  enabled={settings.notifications.enabled}
                  onChange={toggleNotifications}
                  label="通知を有効にする"
                  description="新着情報のプッシュ通知を受け取ります"
                  size="lg"
                />
              </div>

              {/* 通知カテゴリ設定 */}
              <div
                className={`space-y-3 transition-opacity ${
                  settings.notifications.enabled
                    ? "opacity-100"
                    : "opacity-50 pointer-events-none"
                }`}
              >
                <ToggleSwitch
                  enabled={settings.notifications.news}
                  onChange={(enabled) => updateNotifications({ news: enabled })}
                  label="ニュース通知"
                  description="新しいニュースが投稿されたとき"
                  disabled={!settings.notifications.enabled}
                />
                <ToggleSwitch
                  enabled={settings.notifications.schedule}
                  onChange={(enabled) =>
                    updateNotifications({ schedule: enabled })
                  }
                  label="スケジュール通知"
                  description="イベント前日のリマインダー"
                  disabled={!settings.notifications.enabled}
                />
                <ToggleSwitch
                  enabled={settings.notifications.release}
                  onChange={(enabled) =>
                    updateNotifications({ release: enabled })
                  }
                  label="リリース通知"
                  description="新曲・新アルバムの発売情報"
                  disabled={!settings.notifications.enabled}
                />
              </div>

              {/* 将来拡張用メッセージ */}
              <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-xs text-amber-700">
                    通知機能は現在開発中です。設定は保存されますが、
                    実際の通知は今後のアップデートで有効になります。
                  </p>
                </div>
              </div>
            </div>
          </SettingsCard>

          {/* テーマカラー設定 */}
          <SettingsCard
            title="テーマカラー設定"
            description="サイト全体のアクセントカラーを変更"
            icon={
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
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
              </svg>
            }
          >
            <ThemeColorPicker
              mode={settings.themeColor.mode}
              customColor={settings.themeColor.customColor}
              favoriteGroups={settings.favoriteGroups}
              onModeChange={(mode) => setThemeColor({ mode })}
              onCustomColorChange={(color) =>
                setThemeColor({ customColor: color })
              }
            />
          </SettingsCard>

          {/* データ管理 */}
          <SettingsCard
            title="データ管理"
            description="設定のバックアップと復元"
            icon={
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
                  d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                />
              </svg>
            }
          >
            <div className="space-y-6">
              <DataExportImport
                onExport={exportSettings}
                onImport={importSettings}
              />

              {/* 設定リセット */}
              <div className="pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      設定をリセット
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      すべての設定を初期状態に戻します
                    </p>
                  </div>
                  {showResetConfirm ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          resetSettings();
                          setShowResetConfirm(false);
                        }}
                        className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                      >
                        リセット実行
                      </button>
                      <button
                        onClick={() => setShowResetConfirm(false)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        キャンセル
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowResetConfirm(true)}
                      className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                    >
                      リセット
                    </button>
                  )}
                </div>
              </div>
            </div>
          </SettingsCard>

          {/* 最終更新日時 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-xs text-gray-400 py-4"
          >
            最終更新:{" "}
            {new Date(settings.updatedAt).toLocaleString("ja-JP", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
