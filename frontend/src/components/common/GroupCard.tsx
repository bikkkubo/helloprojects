import Image from "next/image";
import Link from "next/link";

interface GroupCardProps {
  id: string;
  name: string;
  imageUrl?: string;
  memberCount: number;
  status: "active" | "disbanded" | "hiatus";
  themeColor?: string;
}

export default function GroupCard({
  id,
  name,
  imageUrl,
  memberCount,
  status,
  themeColor = "#FF69B4",
}: GroupCardProps) {
  // ステータスに応じた表示
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "active":
        return {
          label: "活動中",
          color: "bg-green-500",
          textColor: "text-green-700",
          bgColor: "bg-green-50",
        };
      case "disbanded":
        return {
          label: "解散",
          color: "bg-gray-500",
          textColor: "text-gray-700",
          bgColor: "bg-gray-50",
        };
      case "hiatus":
        return {
          label: "活動休止中",
          color: "bg-yellow-500",
          textColor: "text-yellow-700",
          bgColor: "bg-yellow-50",
        };
      default:
        return {
          label: "不明",
          color: "bg-gray-400",
          textColor: "text-gray-700",
          bgColor: "bg-gray-50",
        };
    }
  };

  const statusDisplay = getStatusDisplay(status);

  return (
    <Link href={`/groups/${id}`}>
      <div className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
        {/* グループ画像 */}
        <div className="relative w-full aspect-video overflow-hidden bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="w-20 h-20 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          )}

          {/* グラデーションオーバーレイ */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"
            style={{
              background: `linear-gradient(to top, ${themeColor}dd, ${themeColor}66, transparent)`,
            }}
          ></div>

          {/* ステータスバッジ */}
          <div className="absolute top-4 right-4">
            <span
              className={`${statusDisplay.color} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1`}
            >
              <span
                className={`w-2 h-2 ${statusDisplay.color} rounded-full animate-pulse`}
              ></span>
              {statusDisplay.label}
            </span>
          </div>

          {/* グループ名（画像上） */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-2xl font-bold text-white drop-shadow-lg group-hover:scale-105 transition-transform duration-300">
              {name}
            </h3>
          </div>
        </div>

        {/* 情報エリア */}
        <div className="p-5">
          {/* メンバー数 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <span className="text-sm font-semibold text-gray-700">
                メンバー数
              </span>
            </div>
            <span className="text-2xl font-bold" style={{ color: themeColor }}>
              {memberCount}
              <span className="text-sm text-gray-500 ml-1">人</span>
            </span>
          </div>

          {/* ステータス情報 */}
          <div className={`${statusDisplay.bgColor} rounded-lg p-3 mb-4`}>
            <p className={`text-sm ${statusDisplay.textColor} font-medium`}>
              {status === "active" && "現在活動中のグループです"}
              {status === "disbanded" && "活動を終了しています"}
              {status === "hiatus" && "現在活動を休止しています"}
            </p>
          </div>

          {/* 詳細ボタン */}
          <div
            className="flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-white transition-all duration-300 group-hover:shadow-lg"
            style={{
              backgroundColor: themeColor,
            }}
          >
            <span>詳細を見る</span>
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </div>
        </div>

        {/* テーマカラーアクセント */}
        <div
          className="h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
          style={{ backgroundColor: themeColor }}
        ></div>
      </div>
    </Link>
  );
}
