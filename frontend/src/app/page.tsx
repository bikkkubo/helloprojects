"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import NewsCard from "@/components/common/NewsCard";
import MemberCard from "@/components/common/MemberCard";
import GroupCard from "@/components/common/GroupCard";
import Button from "@/components/common/Button";

// ========================================
// ダミーデータ（後でAPI連携用に置き換え可能）
// ========================================

// 最新ニュースデータ
const latestNews = [
  {
    id: "1",
    title: "モーニング娘。'25 春ツアー開催決定！全国20公演",
    excerpt:
      "待望の春ツアーが決定しました。今回は全国20公演、過去最大規模での開催となります。",
    thumbnailUrl: "/images/news/news1.jpg",
    category: "event",
    publishedAt: "2025-01-10T10:00:00Z",
    groupNames: ["モーニング娘。'25"],
  },
  {
    id: "2",
    title: "アンジュルム 新メンバーオーディション開催のお知らせ",
    excerpt:
      "アンジュルムでは新たな仲間を募集します。応募条件や詳細はこちらをご確認ください。",
    thumbnailUrl: "/images/news/news2.jpg",
    category: "release",
    publishedAt: "2025-01-08T14:30:00Z",
    groupNames: ["アンジュルム"],
  },
  {
    id: "3",
    title: "Juice=Juice テレビ出演情報まとめ",
    excerpt:
      "今月のJuice=Juiceメンバーのテレビ出演情報をまとめました。チェックをお忘れなく！",
    thumbnailUrl: "/images/news/news3.jpg",
    category: "media",
    publishedAt: "2025-01-05T09:00:00Z",
    groupNames: ["Juice=Juice"],
  },
  {
    id: "4",
    title: "ハロプロ研修生 定期公演のご案内",
    excerpt:
      "1月の研修生定期公演の日程が決定しました。新メンバーのお披露目も予定しています。",
    thumbnailUrl: "/images/news/news4.jpg",
    category: "event",
    publishedAt: "2025-01-03T12:00:00Z",
    groupNames: ["ハロプロ研修生"],
  },
];

// 注目メンバーデータ
const featuredMembers = [
  {
    id: "1",
    name: "山崎愛生",
    nameKana: "やまざき めい",
    imageUrl: "/images/members/member1.jpg",
    groupName: "モーニング娘。'25",
    nickname: "めいめい",
    birthDate: "2003-09-28",
  },
  {
    id: "2",
    name: "川名凜",
    nameKana: "かわな りん",
    imageUrl: "/images/members/member2.jpg",
    groupName: "アンジュルム",
    nickname: "りんりん",
    birthDate: "2004-05-12",
  },
  {
    id: "3",
    name: "入江里咲",
    nameKana: "いりえ りさ",
    imageUrl: "/images/members/member3.jpg",
    groupName: "Juice=Juice",
    nickname: "りさまる",
    birthDate: "2004-08-15",
  },
  {
    id: "4",
    name: "清野桃々姫",
    nameKana: "きよの ももひめ",
    imageUrl: "/images/members/member4.jpg",
    groupName: "つばきファクトリー",
    nickname: "ももひめ",
    birthDate: "2003-01-05",
  },
];

// グループデータ
const groups = [
  {
    id: "1",
    name: "モーニング娘。'25",
    imageUrl: "/images/groups/morning.jpg",
    memberCount: 12,
    status: "active" as const,
    themeColor: "#FF1493",
  },
  {
    id: "2",
    name: "アンジュルム",
    imageUrl: "/images/groups/angerme.jpg",
    memberCount: 10,
    status: "active" as const,
    themeColor: "#9370DB",
  },
  {
    id: "3",
    name: "Juice=Juice",
    imageUrl: "/images/groups/juicejuice.jpg",
    memberCount: 8,
    status: "active" as const,
    themeColor: "#FFD700",
  },
  {
    id: "4",
    name: "つばきファクトリー",
    imageUrl: "/images/groups/tsubaki.jpg",
    memberCount: 9,
    status: "active" as const,
    themeColor: "#87CEEB",
  },
];

// イベントスケジュールデータ
const upcomingEvents = [
  {
    id: "1",
    title: "モーニング娘。'25 コンサートツアー春",
    date: "2025-03-15",
    time: "18:00",
    venue: "日本武道館",
    groupName: "モーニング娘。'25",
    type: "concert",
  },
  {
    id: "2",
    title: "アンジュルム 握手会",
    date: "2025-02-20",
    time: "13:00",
    venue: "幕張メッセ",
    groupName: "アンジュルム",
    type: "event",
  },
  {
    id: "3",
    title: "Juice=Juice ファンミーティング",
    date: "2025-02-10",
    time: "15:00",
    venue: "中野サンプラザ",
    groupName: "Juice=Juice",
    type: "fanmeeting",
  },
  {
    id: "4",
    title: "ハロプロ研修生発表会",
    date: "2025-01-28",
    time: "17:00",
    venue: "山野ホール",
    groupName: "ハロプロ研修生",
    type: "event",
  },
];

// ========================================
// アニメーション設定
// ========================================
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.1,
    },
  },
  viewport: { once: true },
};

const staggerItem = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

// ========================================
// イベントタイプのアイコン・色取得
// ========================================
const getEventTypeStyle = (type: string) => {
  switch (type) {
    case "concert":
      return { icon: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3", bgColor: "bg-pink-100", textColor: "text-pink-600" };
    case "event":
      return { icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", bgColor: "bg-blue-100", textColor: "text-blue-600" };
    case "fanmeeting":
      return { icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", bgColor: "bg-purple-100", textColor: "text-purple-600" };
    default:
      return { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", bgColor: "bg-gray-100", textColor: "text-gray-600" };
  }
};

// ========================================
// 日付フォーマット
// ========================================
const formatEventDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const weekday = weekdays[date.getDay()];
  return { month, day, weekday };
};

// ========================================
// メインコンポーネント
// ========================================
export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-bg">
      {/* ========================================
          ヒーローセクション
          ======================================== */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* 背景グラデーション */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-secondary-violet opacity-90" />

        {/* 装飾パターン */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
          <div className="absolute top-40 right-20 w-48 h-48 bg-secondary-yellow rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-secondary-blue rounded-full blur-3xl" />
        </div>

        {/* アニメーション装飾 */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-4 h-4 bg-white rounded-full"
          animate={{
            y: [0, -20, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-secondary-yellow rounded-full"
          animate={{
            y: [0, 15, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />

        {/* コンテンツ */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full text-sm font-medium mb-6">
              Hello! Project Official Portal
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            夢と笑顔を届ける
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-secondary-yellow to-white">
              アイドルの世界へ
            </span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            ハロー！プロジェクトの最新情報、メンバー紹介、
            <br className="hidden md:block" />
            イベントスケジュールをお届けします
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Link href="/news">
              <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-gray-100">
                最新ニュースを見る
              </Button>
            </Link>
            <Link href="/groups">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-white text-white hover:bg-white/20"
              >
                グループ一覧
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* スクロールインジケーター */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-white/70 rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      {/* ========================================
          最新ニュースセクション
          ======================================== */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            {...fadeInUp}
          >
            <span className="inline-block text-primary font-semibold text-sm tracking-wider uppercase mb-2">
              Latest News
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-text mb-4">
              最新ニュース
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary-violet mx-auto rounded-full" />
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {latestNews.map((news) => (
              <motion.div key={news.id} variants={staggerItem}>
                <NewsCard {...news} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-10"
            {...fadeInUp}
          >
            <Link href="/news">
              <Button variant="outline" size="lg">
                ニュース一覧を見る
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ========================================
          注目メンバーセクション
          ======================================== */}
      <section className="py-20 px-4 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            {...fadeInUp}
          >
            <span className="inline-block text-primary font-semibold text-sm tracking-wider uppercase mb-2">
              Featured Members
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-text mb-4">
              注目メンバー
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-secondary-violet to-primary mx-auto rounded-full" />
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {featuredMembers.map((member) => (
              <motion.div key={member.id} variants={staggerItem}>
                <MemberCard {...member} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-10"
            {...fadeInUp}
          >
            <Link href="/members">
              <Button size="lg">
                メンバー一覧を見る
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ========================================
          グループ一覧セクション
          ======================================== */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            {...fadeInUp}
          >
            <span className="inline-block text-primary font-semibold text-sm tracking-wider uppercase mb-2">
              Groups
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-text mb-4">
              グループ一覧
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary-yellow mx-auto rounded-full" />
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {groups.map((group) => (
              <motion.div key={group.id} variants={staggerItem}>
                <GroupCard {...group} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-10"
            {...fadeInUp}
          >
            <Link href="/groups">
              <Button variant="outline" size="lg">
                すべてのグループを見る
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ========================================
          イベント・スケジュールセクション
          ======================================== */}
      <section className="py-20 px-4 bg-gradient-to-br from-neutral-text via-gray-800 to-neutral-text text-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            {...fadeInUp}
          >
            <span className="inline-block text-secondary-yellow font-semibold text-sm tracking-wider uppercase mb-2">
              Upcoming Events
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              イベント・スケジュール
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-secondary-yellow to-primary mx-auto rounded-full" />
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {upcomingEvents.map((event) => {
              const { month, day, weekday } = formatEventDate(event.date);
              const eventStyle = getEventTypeStyle(event.type);

              return (
                <motion.div
                  key={event.id}
                  variants={staggerItem}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-5 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex gap-4">
                    {/* 日付カード */}
                    <div className="flex-shrink-0 w-16 h-20 bg-white rounded-lg flex flex-col items-center justify-center text-neutral-text shadow-lg">
                      <span className="text-xs font-medium text-gray-500">
                        {month}月
                      </span>
                      <span className="text-2xl font-bold">{day}</span>
                      <span className="text-xs text-gray-500">({weekday})</span>
                    </div>

                    {/* イベント情報 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`${eventStyle.bgColor} ${eventStyle.textColor} text-xs font-bold px-2 py-1 rounded-full`}
                        >
                          {event.type === "concert"
                            ? "コンサート"
                            : event.type === "fanmeeting"
                            ? "ファンミ"
                            : "イベント"}
                        </span>
                        <span className="text-primary-light text-sm font-medium">
                          {event.groupName}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold mb-2 line-clamp-1 group-hover:text-secondary-yellow transition-colors">
                        {event.title}
                      </h3>

                      <div className="flex items-center gap-4 text-sm text-gray-300">
                        <div className="flex items-center gap-1">
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
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
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
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <span className="truncate">{event.venue}</span>
                        </div>
                      </div>
                    </div>

                    {/* 矢印 */}
                    <div className="flex-shrink-0 flex items-center">
                      <svg
                        className="w-6 h-6 text-gray-400 group-hover:text-secondary-yellow group-hover:translate-x-1 transition-all"
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
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            className="text-center mt-10"
            {...fadeInUp}
          >
            <Link href="/schedule">
              <Button
                size="lg"
                className="bg-secondary-yellow text-neutral-text hover:bg-yellow-400"
              >
                スケジュール一覧を見る
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ========================================
          CTAセクション
          ======================================== */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary via-primary-light to-secondary-violet">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              ファンクラブに入会しよう
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              限定コンテンツ、先行チケット予約、メンバーからの特別メッセージなど、
              ファンクラブ会員だけの特典が盛りだくさん！
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/fanclub">
                <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-gray-100">
                  ファンクラブ詳細を見る
                </Button>
              </Link>
              <Link href="/fanclub/register">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-white text-white hover:bg-white/20"
                >
                  今すぐ入会する
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
