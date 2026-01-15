"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import NewsCard from "@/components/common/NewsCard";
import Button from "@/components/common/Button";

// ========================================
// ダミーデータ
// ========================================

// 詳細なニュースデータ
const NEWS_DETAIL_DATA = [
  {
    id: "1",
    title: "モーニング娘。'25 春ツアー開催決定！全国20公演を予定",
    excerpt:
      "モーニング娘。'25の春のコンサートツアーが発表されました。今回は全国20会場での開催を予定しており、新曲も披露される予定です。",
    content: `
      <p>モーニング娘。'25の春のコンサートツアー「モーニング娘。'25 コンサートツアー春 ～READY! SET!! GO!!!～」の開催が決定しました。</p>

      <h2>ツアー概要</h2>
      <p>今回のツアーは、3月15日の日本武道館公演を皮切りに、全国20都市20公演という過去最大規模での開催となります。メンバー全員が「最高のパフォーマンスをお届けしたい」と意気込みを語っています。</p>

      <h2>セットリストについて</h2>
      <p>セットリストには、最新シングル「未来へのステップ」をはじめ、往年の名曲から最新曲まで幅広いラインナップが予定されています。また、ツアー限定の新曲披露も予定されており、ファンの期待が高まっています。</p>

      <h2>チケット情報</h2>
      <p>ファンクラブ先行受付は2月1日より開始。一般発売は2月20日を予定しています。詳細は公式サイトをご確認ください。</p>

      <blockquote>
        「今年は結成○○周年という節目の年。最高のステージをお届けできるよう、メンバー一同精一杯頑張ります！」- リーダーコメント
      </blockquote>

      <p>各公演の詳細スケジュールは順次公式サイトにて発表予定です。皆様のご来場をお待ちしております。</p>
    `,
    thumbnailUrl: "/images/news/concert-01.jpg",
    category: "concert",
    publishedAt: "2025-01-14",
    groupNames: ["モーニング娘。'25"],
    groupId: "morning-musume",
    relatedMembers: [
      { id: "1", name: "山崎愛生", imageUrl: "/images/members/member1.jpg" },
      { id: "2", name: "佐藤優樹", imageUrl: "/images/members/member2.jpg" },
    ],
    relatedGroups: [{ id: "morning-musume", name: "モーニング娘。'25" }],
  },
  {
    id: "2",
    title: "アンジュルム 新シングル「輝く未来へ」3月リリース決定",
    excerpt:
      "アンジュルムの待望の新シングルが3月にリリースされることが発表されました。今作はメンバー全員で作詞に参加した意欲作です。",
    content: `
      <p>アンジュルムの待望の新シングル「輝く未来へ」が3月にリリースされることが発表されました。</p>

      <h2>楽曲について</h2>
      <p>今作は、メンバー全員が作詞に参加するという意欲作。それぞれのメンバーの想いが詰まった歌詞と、アップテンポで力強いメロディが特徴の楽曲に仕上がっています。</p>

      <h2>収録内容</h2>
      <ul>
        <li>輝く未来へ</li>
        <li>カップリング曲（タイトル未定）</li>
        <li>各曲のInstrumental</li>
      </ul>

      <h2>初回限定盤特典</h2>
      <p>初回限定盤には、メイキング映像やメンバーによる楽曲解説映像が収録されたDVDが付属します。</p>

      <p>予約受付は2月1日より各音楽サイト・CDショップにて開始予定です。</p>
    `,
    thumbnailUrl: "/images/news/release-01.jpg",
    category: "release",
    publishedAt: "2025-01-13",
    groupNames: ["アンジュルム"],
    groupId: "angerme",
    relatedMembers: [
      { id: "3", name: "川名凜", imageUrl: "/images/members/member3.jpg" },
    ],
    relatedGroups: [{ id: "angerme", name: "アンジュルム" }],
  },
  {
    id: "3",
    title: "Juice=Juice メンバーがバラエティ番組に出演決定",
    excerpt:
      "Juice=Juiceのメンバーが人気バラエティ番組への出演が決定しました。グループの魅力をたっぷりとアピールします。",
    content: `
      <p>Juice=Juiceのメンバーが、人気バラエティ番組「〇〇TV」への出演が決定しました！</p>

      <h2>番組概要</h2>
      <p>放送日時：2025年1月20日（月）21:00〜</p>
      <p>放送局：テレビ東京系列</p>

      <h2>出演内容</h2>
      <p>番組では、メンバーのトークコーナーやミニライブなど、Juice=Juiceの魅力が存分に楽しめる内容となっています。また、メンバー同士のガチンコ対決企画も予定されており、普段は見られないメンバーの一面が見られるかもしれません。</p>

      <p>ぜひお見逃しなく！</p>
    `,
    thumbnailUrl: "/images/news/media-01.jpg",
    category: "media",
    publishedAt: "2025-01-12",
    groupNames: ["Juice=Juice"],
    groupId: "juice-juice",
    relatedMembers: [
      { id: "4", name: "入江里咲", imageUrl: "/images/members/member4.jpg" },
    ],
    relatedGroups: [{ id: "juice-juice", name: "Juice=Juice" }],
  },
  {
    id: "4",
    title: "つばきファクトリー ファンミーティング開催のお知らせ",
    excerpt:
      "つばきファクトリーのファンミーティングが2月に開催されます。メンバーとの交流イベントやゲーム大会も予定されています。",
    content: `
      <p>つばきファクトリーのファンミーティングが2月に開催されることが決定しました！</p>

      <h2>イベント概要</h2>
      <p>日程：2025年2月15日（土）</p>
      <p>会場：東京・品川インターシティホール</p>
      <p>時間：第1部 14:00〜 / 第2部 18:00〜</p>

      <h2>イベント内容</h2>
      <ul>
        <li>メンバーによるトークコーナー</li>
        <li>ファン参加型ゲーム大会</li>
        <li>ミニライブ</li>
        <li>写真撮影会（抽選）</li>
      </ul>

      <p>チケットの詳細は後日発表いたします。</p>
    `,
    thumbnailUrl: "/images/news/event-01.jpg",
    category: "event",
    publishedAt: "2025-01-11",
    groupNames: ["つばきファクトリー"],
    groupId: "tsubaki-factory",
    relatedMembers: [
      { id: "5", name: "清野桃々姫", imageUrl: "/images/members/member5.jpg" },
    ],
    relatedGroups: [{ id: "tsubaki-factory", name: "つばきファクトリー" }],
  },
  {
    id: "5",
    title: "BEYOOOOONDS 公式YouTubeチャンネル登録者100万人突破",
    excerpt:
      "BEYOOOOONDSの公式YouTubeチャンネルが登録者数100万人を突破しました。記念動画の公開も予定されています。",
    content: `
      <p>BEYOOOOONDSの公式YouTubeチャンネルが、ついに登録者数100万人を突破しました！</p>

      <h2>感謝のメッセージ</h2>
      <p>メンバー一同、日頃の応援に心より感謝申し上げます。皆様のおかげで、このような大きな節目を迎えることができました。</p>

      <h2>記念企画</h2>
      <p>100万人突破を記念して、以下の企画を予定しています：</p>
      <ul>
        <li>メンバー全員出演の特別記念動画公開</li>
        <li>生配信イベント開催</li>
        <li>限定グッズプレゼントキャンペーン</li>
      </ul>

      <p>詳細は順次公式SNSにて発表いたします。今後ともBEYOOOOONDSをよろしくお願いいたします！</p>
    `,
    thumbnailUrl: "/images/news/other-01.jpg",
    category: "other",
    publishedAt: "2025-01-10",
    groupNames: ["BEYOOOOONDS"],
    groupId: "beyooooonds",
    relatedMembers: [],
    relatedGroups: [{ id: "beyooooonds", name: "BEYOOOOONDS" }],
  },
  {
    id: "6",
    title: "OCHA NORMA 初の単独武道館公演が決定！",
    excerpt:
      "OCHA NORMAが念願の日本武道館単独公演を開催することが発表されました。グループ史上最大規模の公演となります。",
    content: `
      <p>OCHA NORMAが、念願の日本武道館単独公演を開催することが発表されました！</p>

      <h2>公演概要</h2>
      <p>日程：2025年5月5日（月・祝）</p>
      <p>会場：日本武道館</p>
      <p>開場 16:00 / 開演 17:00</p>

      <h2>メンバーコメント</h2>
      <blockquote>
        「デビューからずっと目標にしていた武道館での単独公演。夢が叶う瞬間を皆さんと一緒に迎えられることを、本当に嬉しく思います。最高のステージをお届けします！」
      </blockquote>

      <p>チケット情報は後日発表予定です。</p>
    `,
    thumbnailUrl: "/images/news/concert-02.jpg",
    category: "concert",
    publishedAt: "2025-01-09",
    groupNames: ["OCHA NORMA"],
    groupId: "ocha-norma",
    relatedMembers: [],
    relatedGroups: [{ id: "ocha-norma", name: "OCHA NORMA" }],
  },
];

// 関連ニュースデータ（NewsCardで使用）
const RELATED_NEWS = [
  {
    id: "7",
    title: "ロージークロニクル デビューシングル発売記念イベント開催",
    excerpt:
      "ロージークロニクルのデビューシングル発売を記念して、全国各地でイベントが開催されます。",
    thumbnailUrl: "/images/news/event-02.jpg",
    category: "event",
    publishedAt: "2025-01-08",
    groupNames: ["ロージークロニクル"],
  },
  {
    id: "8",
    title: "ハロプロ合同 夏の大型フェス開催決定",
    excerpt:
      "ハロー!プロジェクト所属グループが一堂に会する夏の大型フェスの開催が決定しました。",
    thumbnailUrl: "/images/news/concert-03.jpg",
    category: "concert",
    publishedAt: "2025-01-07",
    groupNames: ["モーニング娘。'25", "アンジュルム", "Juice=Juice"],
  },
  {
    id: "9",
    title: "モーニング娘。'25 ドキュメンタリー映画公開決定",
    excerpt:
      "モーニング娘。'25の軌跡を追ったドキュメンタリー映画の公開が決定しました。",
    thumbnailUrl: "/images/news/media-02.jpg",
    category: "media",
    publishedAt: "2025-01-06",
    groupNames: ["モーニング娘。'25"],
  },
  {
    id: "10",
    title: "アンジュルム ベストアルバム発売のお知らせ",
    excerpt:
      "アンジュルムの結成10周年を記念したベストアルバムの発売が決定しました。",
    thumbnailUrl: "/images/news/release-02.jpg",
    category: "release",
    publishedAt: "2025-01-05",
    groupNames: ["アンジュルム"],
  },
];

// ========================================
// ユーティリティ関数
// ========================================

// カテゴリに応じた色を返す
const getCategoryColor = (category: string) => {
  switch (category) {
    case "concert":
      return "bg-primary";
    case "release":
      return "bg-secondary-yellow text-neutral-text";
    case "media":
      return "bg-secondary-green";
    case "event":
      return "bg-secondary-blue";
    case "other":
      return "bg-secondary-violet";
    default:
      return "bg-gray-500";
  }
};

// カテゴリの日本語表示
const getCategoryLabel = (category: string) => {
  switch (category) {
    case "concert":
      return "コンサート";
    case "release":
      return "リリース";
    case "media":
      return "メディア";
    case "event":
      return "イベント";
    case "other":
      return "その他";
    default:
      return category;
  }
};

// 日付フォーマット
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// ========================================
// アニメーション設定
// ========================================
const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

// ========================================
// SNSシェアボタンコンポーネント
// ========================================
interface ShareButtonsProps {
  title: string;
  url: string;
}

function ShareButtons({ title, url }: ShareButtonsProps) {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const shareToX = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareToLINE = () => {
    window.open(
      `https://social-plugins.line.me/lineit/share?url=${encodedUrl}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-500 font-medium">シェア:</span>
      <button
        onClick={shareToX}
        className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
        aria-label="Xでシェア"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>
      <button
        onClick={shareToLINE}
        className="w-10 h-10 bg-[#00B900] text-white rounded-full flex items-center justify-center hover:bg-[#00A000] transition-colors"
        aria-label="LINEでシェア"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
        </svg>
      </button>
    </div>
  );
}

// ========================================
// メインコンポーネント
// ========================================
export default function NewsDetailPage() {
  const params = useParams();
  const newsId = params.id as string;

  // ニュース詳細データを取得
  const newsDetail = useMemo(() => {
    return NEWS_DETAIL_DATA.find((news) => news.id === newsId);
  }, [newsId]);

  // 関連ニュース（現在の記事を除く3-4件）
  const relatedNews = useMemo(() => {
    return RELATED_NEWS.filter((news) => news.id !== newsId).slice(0, 4);
  }, [newsId]);

  // ニュースが見つからない場合
  if (!newsDetail) {
    return (
      <div className="min-h-screen bg-neutral-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-text mb-4">
            記事が見つかりませんでした
          </h1>
          <Link href="/news">
            <Button variant="primary">ニュース一覧に戻る</Button>
          </Link>
        </div>
      </div>
    );
  }

  // 現在のURL（シェア用）
  const currentUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://helloprojects.com/news/${newsId}`;

  return (
    <div className="min-h-screen bg-neutral-bg">
      {/* パンくずリスト */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white border-b border-neutral-border"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center text-sm text-gray-500 overflow-x-auto whitespace-nowrap">
            <Link
              href="/"
              className="hover:text-primary transition-colors flex-shrink-0"
            >
              ホーム
            </Link>
            <svg
              className="w-4 h-4 mx-2 flex-shrink-0"
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
            <Link
              href="/news"
              className="hover:text-primary transition-colors flex-shrink-0"
            >
              ニュース
            </Link>
            <svg
              className="w-4 h-4 mx-2 flex-shrink-0"
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
            <span className="text-neutral-text font-medium truncate max-w-[200px] sm:max-w-none">
              {newsDetail.title}
            </span>
          </nav>
        </div>
      </motion.div>

      {/* 記事メインコンテンツ */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 記事ヘッダー */}
        <motion.header
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* カテゴリバッジ & 公開日 */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className={`${getCategoryColor(
                newsDetail.category
              )} text-white text-sm font-bold px-4 py-1.5 rounded-full`}
            >
              {getCategoryLabel(newsDetail.category)}
            </span>
            <time
              dateTime={newsDetail.publishedAt}
              className="text-gray-500 text-sm"
            >
              {formatDate(newsDetail.publishedAt)}
            </time>
          </div>

          {/* タイトル */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-text leading-tight mb-4">
            {newsDetail.title}
          </h1>

          {/* 関連グループ */}
          {newsDetail.groupNames && newsDetail.groupNames.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {newsDetail.groupNames.map((groupName, index) => (
                <Link
                  key={index}
                  href={`/groups/${newsDetail.relatedGroups[index]?.id || ""}`}
                  className="inline-flex items-center gap-1 text-primary hover:text-primary-dark transition-colors text-sm font-medium"
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {groupName}
                </Link>
              ))}
            </div>
          )}
        </motion.header>

        {/* サムネイル画像 */}
        <motion.div
          className="relative w-full aspect-video rounded-xl overflow-hidden mb-8 bg-gray-100 shadow-lg"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {newsDetail.thumbnailUrl ? (
            <Image
              src={newsDetail.thumbnailUrl}
              alt={newsDetail.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 896px"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <svg
                className="w-24 h-24 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </motion.div>

        {/* 記事本文 */}
        <motion.div
          className="bg-white rounded-xl shadow-md p-6 sm:p-8 lg:p-10 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* リッチテキストコンテンツ */}
          <div
            className="prose prose-lg max-w-none
              prose-headings:text-neutral-text prose-headings:font-bold
              prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-l-4 prose-h2:border-primary prose-h2:pl-4
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
              prose-ul:my-4 prose-ul:pl-6
              prose-li:text-gray-700 prose-li:mb-2
              prose-blockquote:border-l-4 prose-blockquote:border-primary-light prose-blockquote:bg-pink-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:italic prose-blockquote:text-gray-600
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: newsDetail.content }}
          />
        </motion.div>

        {/* 関連メンバー・グループセクション */}
        {(newsDetail.relatedMembers.length > 0 ||
          newsDetail.relatedGroups.length > 0) && (
          <motion.div
            className="bg-white rounded-xl shadow-md p-6 sm:p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-lg font-bold text-neutral-text mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              関連リンク
            </h2>

            <div className="flex flex-wrap gap-4">
              {/* 関連メンバー */}
              {newsDetail.relatedMembers.map((member) => (
                <Link
                  key={member.id}
                  href={`/members/${member.id}`}
                  className="flex items-center gap-3 bg-gray-50 hover:bg-pink-50 rounded-full pr-4 transition-colors group"
                >
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                    {member.imageUrl ? (
                      <Image
                        src={member.imageUrl}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-gray-400"
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
                    )}
                  </div>
                  <span className="text-sm font-medium text-neutral-text group-hover:text-primary transition-colors">
                    {member.name}
                  </span>
                </Link>
              ))}

              {/* 関連グループ */}
              {newsDetail.relatedGroups.map((group) => (
                <Link
                  key={group.id}
                  href={`/groups/${group.id}`}
                  className="flex items-center gap-2 bg-gray-50 hover:bg-pink-50 rounded-full px-4 py-2 transition-colors group"
                >
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors"
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
                  <span className="text-sm font-medium text-neutral-text group-hover:text-primary transition-colors">
                    {group.name}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* SNSシェアボタン */}
        <motion.div
          className="bg-white rounded-xl shadow-md p-6 sm:p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <ShareButtons title={newsDetail.title} url={currentUrl} />
            <Link href="/news">
              <Button variant="outline" size="sm">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                ニュース一覧に戻る
              </Button>
            </Link>
          </div>
        </motion.div>
      </article>

      {/* 関連ニュースセクション */}
      <section className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <span className="inline-block text-primary font-semibold text-sm tracking-wider uppercase mb-2">
              Related News
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-text">
              関連ニュース
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary-violet mx-auto rounded-full mt-4" />
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {relatedNews.map((news, index) => (
              <motion.div
                key={news.id}
                variants={staggerItem}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <NewsCard
                  id={news.id}
                  title={news.title}
                  excerpt={news.excerpt}
                  thumbnailUrl={news.thumbnailUrl}
                  category={news.category}
                  publishedAt={news.publishedAt}
                  groupNames={news.groupNames}
                />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          >
            <Link href="/news">
              <Button variant="outline" size="lg">
                すべてのニュースを見る
                <svg
                  className="w-5 h-5 ml-2"
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
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
