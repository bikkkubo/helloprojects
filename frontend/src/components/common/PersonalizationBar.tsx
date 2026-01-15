"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// グループデータの型定義
interface Group {
  id: string;
  name: string;
  themeColor: string;
}

// イベント通知の型定義
interface EventNotification {
  id: string;
  groupId: string;
  groupName: string;
  message: string;
  deadline: string;
}

// グループリスト
const GROUPS: Group[] = [
  { id: "morning-musume", name: "モーニング娘。'25", themeColor: "#FF1493" },
  { id: "angerme", name: "アンジュルム", themeColor: "#9370DB" },
  { id: "juice-juice", name: "Juice=Juice", themeColor: "#FFD700" },
  { id: "tsubaki-factory", name: "つばきファクトリー", themeColor: "#FF69B4" },
  { id: "beyooooonds", name: "BEYOOOOONDS", themeColor: "#87CEEB" },
  { id: "ocha-norma", name: "OCHA NORMA", themeColor: "#98FB98" },
  { id: "rosy-chronicle", name: "ロージークロニクル", themeColor: "#FFA07A" },
  { id: "kenshusei", name: "ハロプロ研修生", themeColor: "#DDA0DD" },
];

// サンプルイベント通知（実際にはAPIから取得）
const SAMPLE_NOTIFICATIONS: EventNotification[] = [
  {
    id: "1",
    groupId: "tsubaki-factory",
    groupName: "つばきファクトリー",
    message: "1/23イベント申込締切！",
    deadline: "2025-01-23",
  },
  {
    id: "2",
    groupId: "morning-musume",
    groupName: "モーニング娘。'25",
    message: "1/28春ツアー先行抽選締切！",
    deadline: "2025-01-28",
  },
  {
    id: "3",
    groupId: "angerme",
    groupName: "アンジュルム",
    message: "2/1写真集予約締切！",
    deadline: "2025-02-01",
  },
];

// localStorage キー
const STORAGE_KEYS = {
  FAVORITE_GROUP: "helloprojects_favorite_group",
  BAR_HIDDEN: "helloprojects_bar_hidden",
  DISMISSED_NOTIFICATIONS: "helloprojects_dismissed_notifications",
};

export default function PersonalizationBar() {
  const [favoriteGroup, setFavoriteGroup] = useState<Group | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBarHidden, setIsBarHidden] = useState(false);
  const [notifications, setNotifications] = useState<EventNotification[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // 初期化: localStorageから状態を読み込む
  useEffect(() => {
    const savedGroupId = localStorage.getItem(STORAGE_KEYS.FAVORITE_GROUP);
    const savedBarHidden = localStorage.getItem(STORAGE_KEYS.BAR_HIDDEN);
    const dismissedNotifications = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.DISMISSED_NOTIFICATIONS) || "[]"
    );

    if (savedGroupId) {
      const group = GROUPS.find((g) => g.id === savedGroupId);
      if (group) {
        setFavoriteGroup(group);
      }
    }

    if (savedBarHidden === "true") {
      setIsBarHidden(true);
    }

    // 締切間近のイベント通知をフィルタリング（7日以内）
    const now = new Date();
    const upcomingNotifications = SAMPLE_NOTIFICATIONS.filter((notification) => {
      const deadline = new Date(notification.deadline);
      const daysUntil = Math.ceil(
        (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      return (
        daysUntil > 0 &&
        daysUntil <= 7 &&
        !dismissedNotifications.includes(notification.id)
      );
    });
    setNotifications(upcomingNotifications);
    setIsInitialized(true);
  }, []);

  // グループ選択ハンドラー
  const handleSelectGroup = useCallback((group: Group) => {
    setFavoriteGroup(group);
    localStorage.setItem(STORAGE_KEYS.FAVORITE_GROUP, group.id);
    setIsModalOpen(false);
  }, []);

  // バーを閉じるハンドラー
  const handleCloseBar = useCallback(() => {
    setIsBarHidden(true);
    localStorage.setItem(STORAGE_KEYS.BAR_HIDDEN, "true");
  }, []);

  // バーを再表示するハンドラー
  const handleShowBar = useCallback(() => {
    setIsBarHidden(false);
    localStorage.setItem(STORAGE_KEYS.BAR_HIDDEN, "false");
  }, []);

  // 通知を閉じるハンドラー
  const handleDismissNotification = useCallback((notificationId: string) => {
    const dismissed = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.DISMISSED_NOTIFICATIONS) || "[]"
    );
    dismissed.push(notificationId);
    localStorage.setItem(
      STORAGE_KEYS.DISMISSED_NOTIFICATIONS,
      JSON.stringify(dismissed)
    );
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  }, []);

  // グラデーション背景を生成
  const getGradientBackground = () => {
    if (favoriteGroup) {
      return `linear-gradient(135deg, ${favoriteGroup.themeColor}dd 0%, ${favoriteGroup.themeColor}99 50%, ${favoriteGroup.themeColor}77 100%)`;
    }
    return "linear-gradient(135deg, #FF1493dd 0%, #9370DBaa 50%, #FFD70099 100%)";
  };

  // 初期化前は何も表示しない（ハイドレーションエラー防止）
  if (!isInitialized) {
    return null;
  }

  // バーが非表示の場合、復元ボタンのみ表示
  if (isBarHidden) {
    return (
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-20 right-4 z-40 bg-white shadow-lg rounded-full p-3 hover:shadow-xl transition-shadow"
        onClick={handleShowBar}
        aria-label="パーソナライズバーを表示"
      >
        <svg
          className="w-5 h-5 text-primary"
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
      </motion.button>
    );
  }

  // 推しグループに関連する通知をフィルタリング
  const relevantNotifications = favoriteGroup
    ? notifications.filter((n) => n.groupId === favoriteGroup.id)
    : notifications.slice(0, 1);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative overflow-hidden shadow-md"
        style={{ background: getGradientBackground() }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            {/* 左側: 推しグループ情報 */}
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="flex items-center gap-2"
              >
                <span className="text-white/90 text-sm font-medium">
                  あなたの推し:
                </span>
                {favoriteGroup ? (
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white font-bold text-sm">
                    {favoriteGroup.name}
                  </span>
                ) : (
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white/80 text-sm">
                    未選択
                  </span>
                )}
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="bg-white/25 hover:bg-white/35 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
              >
                変更
              </motion.button>
            </div>

            {/* 中央: イベント通知 */}
            <AnimatePresence mode="wait">
              {relevantNotifications.length > 0 && (
                <motion.div
                  key={relevantNotifications[0].id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-2"
                >
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full">
                    <span className="text-lg" role="img" aria-label="通知">
                      🔔
                    </span>
                    <span className="text-white text-sm font-medium">
                      {relevantNotifications[0].groupName}{" "}
                      {relevantNotifications[0].message}
                    </span>
                    <button
                      onClick={() =>
                        handleDismissNotification(relevantNotifications[0].id)
                      }
                      className="ml-2 text-white/70 hover:text-white transition-colors"
                      aria-label="通知を閉じる"
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 右側: 閉じるボタン */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCloseBar}
              className="text-white/70 hover:text-white transition-colors p-1"
              aria-label="パーソナライズバーを閉じる"
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
        </div>

        {/* 装飾用のキラキラエフェクト */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 50 - 25],
              }}
              transition={{
                duration: 2,
                delay: i * 0.5,
                repeat: Infinity,
                repeatDelay: 3,
              }}
              style={{
                left: `${20 + i * 15}%`,
                top: "50%",
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* グループ選択モーダル */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* モーダルヘッダー */}
              <div className="bg-gradient-to-r from-primary to-secondary-violet p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">
                    推しグループを選択
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-white/80 hover:text-white transition-colors"
                    aria-label="閉じる"
                  >
                    <svg
                      className="w-6 h-6"
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
                  </button>
                </div>
                <p className="text-white/80 text-sm mt-2">
                  あなたの推しグループを選んでください。選んだグループの関連情報が優先表示されます。
                </p>
              </div>

              {/* グループリスト */}
              <div className="p-4 overflow-y-auto max-h-[50vh]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {GROUPS.map((group, index) => (
                    <motion.button
                      key={group.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectGroup(group)}
                      className={`relative flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                        favoriteGroup?.id === group.id
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {/* グループカラーインジケーター */}
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: group.themeColor }}
                      />

                      {/* グループ名 */}
                      <span className="font-medium text-gray-800 text-left flex-1">
                        {group.name}
                      </span>

                      {/* 選択中マーク */}
                      {favoriteGroup?.id === group.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="text-primary"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* モーダルフッター */}
              <div className="border-t border-gray-100 p-4 bg-gray-50">
                <p className="text-xs text-gray-500 text-center">
                  選択内容はブラウザに保存され、次回アクセス時にも反映されます。
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
