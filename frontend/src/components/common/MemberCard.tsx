import Image from "next/image";
import Link from "next/link";

interface MemberCardProps {
  id: string;
  name: string;
  nameKana?: string;
  imageUrl?: string;
  groupName: string;
  nickname?: string;
  birthDate?: string;
}

export default function MemberCard({
  id,
  name,
  nameKana,
  imageUrl,
  groupName,
  nickname,
  birthDate,
}: MemberCardProps) {
  // 年齢計算
  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <Link href={`/members/${id}`}>
      <div className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
        {/* メンバー画像 */}
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="w-24 h-24 text-gray-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          )}

          {/* ホバーオーバーレイ */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="text-sm font-medium">詳しく見る</p>
            </div>
          </div>

          {/* ニックネームバッジ */}
          {nickname && (
            <div className="absolute top-3 right-3">
              <span className="bg-primary-pink text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                {nickname}
              </span>
            </div>
          )}
        </div>

        {/* 情報エリア */}
        <div className="p-4">
          {/* グループ名 */}
          <p className="text-xs text-primary-pink font-semibold mb-2 uppercase tracking-wide">
            {groupName}
          </p>

          {/* メンバー名 */}
          <h3 className="text-lg font-bold text-neutral-text mb-1 group-hover:text-primary-pink transition-colors">
            {name}
          </h3>

          {/* ふりがな */}
          {nameKana && (
            <p className="text-xs text-gray-500 mb-3">{nameKana}</p>
          )}

          {/* 誕生日・年齢 */}
          {birthDate && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
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
              <span>
                {new Date(birthDate).toLocaleDateString("ja-JP", {
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="text-gray-400">•</span>
              <span>{calculateAge(birthDate)}歳</span>
            </div>
          )}
        </div>

        {/* アニメーションアクセント */}
        <div className="h-1 bg-gradient-to-r from-primary-pink via-secondary-purple to-primary-pink transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
      </div>
    </Link>
  );
}
