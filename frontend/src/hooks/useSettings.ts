"use client";

import { useState, useEffect, useCallback } from "react";
import { GROUP_COLORS } from "@/constants/groupColors";

// 設定の型定義
export interface UserSettings {
  // 推しグループ（複数選択可能）
  favoriteGroups: string[];
  // 通知設定
  notifications: {
    enabled: boolean;
    news: boolean;
    schedule: boolean;
    release: boolean;
  };
  // テーマカラー設定
  themeColor: {
    mode: "default" | "custom" | "favorite";
    customColor: string;
  };
  // 最終更新日時
  updatedAt: string;
}

// デフォルト設定
const defaultSettings: UserSettings = {
  favoriteGroups: [],
  notifications: {
    enabled: false,
    news: true,
    schedule: true,
    release: true,
  },
  themeColor: {
    mode: "default",
    customColor: "#9333EA", // Purple-600
  },
  updatedAt: new Date().toISOString(),
};

const STORAGE_KEY = "helloprojects_settings";

// localStorageから設定を読み込む
const loadSettings = (): UserSettings => {
  if (typeof window === "undefined") {
    return defaultSettings;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // デフォルト設定とマージ（新しいプロパティがあっても対応）
      return {
        ...defaultSettings,
        ...parsed,
        notifications: {
          ...defaultSettings.notifications,
          ...(parsed.notifications || {}),
        },
        themeColor: {
          ...defaultSettings.themeColor,
          ...(parsed.themeColor || {}),
        },
      };
    }
  } catch (error) {
    console.error("Failed to load settings:", error);
  }

  return defaultSettings;
};

// localStorageに設定を保存する
const saveSettings = (data: UserSettings): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save settings:", error);
  }
};

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // 初回読み込み
  useEffect(() => {
    const data = loadSettings();
    setSettings(data);
    setIsLoaded(true);
  }, []);

  // 設定を更新する汎用関数
  const updateSettings = useCallback(
    (updater: (prev: UserSettings) => UserSettings) => {
      setSettings((prev) => {
        const updated = {
          ...updater(prev),
          updatedAt: new Date().toISOString(),
        };
        saveSettings(updated);
        return updated;
      });
    },
    []
  );

  // 推しグループを追加
  const addFavoriteGroup = useCallback(
    (groupId: string) => {
      updateSettings((prev) => ({
        ...prev,
        favoriteGroups: prev.favoriteGroups.includes(groupId)
          ? prev.favoriteGroups
          : [...prev.favoriteGroups, groupId],
      }));
    },
    [updateSettings]
  );

  // 推しグループを削除
  const removeFavoriteGroup = useCallback(
    (groupId: string) => {
      updateSettings((prev) => ({
        ...prev,
        favoriteGroups: prev.favoriteGroups.filter((id) => id !== groupId),
      }));
    },
    [updateSettings]
  );

  // 推しグループをトグル
  const toggleFavoriteGroup = useCallback(
    (groupId: string) => {
      updateSettings((prev) => ({
        ...prev,
        favoriteGroups: prev.favoriteGroups.includes(groupId)
          ? prev.favoriteGroups.filter((id) => id !== groupId)
          : [...prev.favoriteGroups, groupId],
      }));
    },
    [updateSettings]
  );

  // 推しグループを一括設定
  const setFavoriteGroups = useCallback(
    (groupIds: string[]) => {
      updateSettings((prev) => ({
        ...prev,
        favoriteGroups: groupIds,
      }));
    },
    [updateSettings]
  );

  // 推しグループかどうかを確認
  const isFavoriteGroup = useCallback(
    (groupId: string): boolean => {
      return settings.favoriteGroups.includes(groupId);
    },
    [settings.favoriteGroups]
  );

  // 通知設定を更新
  const updateNotifications = useCallback(
    (notifications: Partial<UserSettings["notifications"]>) => {
      updateSettings((prev) => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          ...notifications,
        },
      }));
    },
    [updateSettings]
  );

  // 通知の有効/無効を切り替え
  const toggleNotifications = useCallback(() => {
    updateSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        enabled: !prev.notifications.enabled,
      },
    }));
  }, [updateSettings]);

  // テーマカラーを設定
  const setThemeColor = useCallback(
    (themeColor: Partial<UserSettings["themeColor"]>) => {
      updateSettings((prev) => ({
        ...prev,
        themeColor: {
          ...prev.themeColor,
          ...themeColor,
        },
      }));
    },
    [updateSettings]
  );

  // 推しグループのカラーを取得（最初の推しグループのカラー）
  const getFavoriteGroupColor = useCallback((): string => {
    if (settings.favoriteGroups.length === 0) {
      return "#9333EA"; // デフォルトパープル
    }
    const firstGroup = settings.favoriteGroups[0];
    return GROUP_COLORS[firstGroup]?.color || "#9333EA";
  }, [settings.favoriteGroups]);

  // 現在のテーマカラーを取得
  const getCurrentThemeColor = useCallback((): string => {
    switch (settings.themeColor.mode) {
      case "favorite":
        return getFavoriteGroupColor();
      case "custom":
        return settings.themeColor.customColor;
      default:
        return "#9333EA"; // デフォルトパープル
    }
  }, [settings.themeColor, getFavoriteGroupColor]);

  // 設定をエクスポート
  const exportSettings = useCallback((): string => {
    const exportData = {
      version: 1,
      settings,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(exportData, null, 2);
  }, [settings]);

  // 設定をインポート
  const importSettings = useCallback(
    (jsonString: string): { success: boolean; error?: string } => {
      try {
        const parsed = JSON.parse(jsonString);

        // バージョン確認
        if (!parsed.version || !parsed.settings) {
          return { success: false, error: "Invalid settings format" };
        }

        // 設定を適用
        const importedSettings: UserSettings = {
          ...defaultSettings,
          ...parsed.settings,
          notifications: {
            ...defaultSettings.notifications,
            ...(parsed.settings.notifications || {}),
          },
          themeColor: {
            ...defaultSettings.themeColor,
            ...(parsed.settings.themeColor || {}),
          },
          updatedAt: new Date().toISOString(),
        };

        setSettings(importedSettings);
        saveSettings(importedSettings);

        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to parse settings",
        };
      }
    },
    []
  );

  // 設定をリセット
  const resetSettings = useCallback(() => {
    const resetData = {
      ...defaultSettings,
      updatedAt: new Date().toISOString(),
    };
    setSettings(resetData);
    saveSettings(resetData);
  }, []);

  return {
    settings,
    isLoaded,
    // 推しグループ関連
    addFavoriteGroup,
    removeFavoriteGroup,
    toggleFavoriteGroup,
    setFavoriteGroups,
    isFavoriteGroup,
    // 通知関連
    updateNotifications,
    toggleNotifications,
    // テーマカラー関連
    setThemeColor,
    getFavoriteGroupColor,
    getCurrentThemeColor,
    // エクスポート/インポート
    exportSettings,
    importSettings,
    resetSettings,
  };
}
