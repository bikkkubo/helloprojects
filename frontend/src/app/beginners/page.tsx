"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// ========================================
// グループ基本情報
// ========================================
const GROUPS = [
  {
    id: "morning-musume",
    name: "モーニング娘。'25",
    color: "#FF1493",
    image: "/images/groups/morning-musume-group.jpg",
    description: "1997年結成。ハロプロの看板グループ。数々の名曲を生み出し、今なお進化し続ける伝説的アイドルグループ。",
    features: ["ダンス力抜群", "伝統と革新", "歌唱力の高さ"],
    recommendedSong: "LOVEマシーン",
    memberCount: 12,
  },
  {
    id: "angerme",
    name: "アンジュルム",
    color: "#9370DB",
    image: "/images/groups/angerme-group.jpg",
    description: "2009年結成（旧：スマイレージ）。個性豊かなメンバーが揃い、パワフルなパフォーマンスが魅力。",
    features: ["個性派揃い", "パワフル", "バラエティ豊か"],
    recommendedSong: "大器晩成",
    memberCount: 9,
  },
  {
    id: "juice-juice",
    name: "Juice=Juice",
    color: "#FFD700",
    image: "/images/groups/juice-juice-group.jpg",
    description: "2013年結成。高い歌唱力とダンス力を兼ね備えた実力派グループ。",
    features: ["歌唱力抜群", "大人の魅力", "実力派"],
    recommendedSong: "Magic of Love",
    memberCount: 8,
  },
  {
    id: "tsubaki-factory",
    name: "つばきファクトリー",
    color: "#FF69B4",
    image: "/images/groups/tsubaki-factory-group.jpg",
    description: "2015年結成。爽やかで可憐なイメージを持ちながら、力強いパフォーマンスも見せる。",
    features: ["爽やか", "可憐", "成長著しい"],
    recommendedSong: "初恋サンライズ",
    memberCount: 8,
  },
  {
    id: "beyooooonds",
    name: "BEYOOOOONDS",
    color: "#87CEEB",
    image: "/images/groups/beyooooonds-group.jpg",
    description: "2018年結成。3つのユニットが合体して誕生。演劇的要素を取り入れた独自のスタイルが特徴。",
    features: ["演劇的", "ユニーク", "表現力豊か"],
    recommendedSong: "眼鏡の男の子",
    memberCount: 12,
  },
  {
    id: "ocha-norma",
    name: "OCHA NORMA",
    color: "#98FB98",
    image: "/images/groups/ocha-norma-group.jpg",
    description: "2021年結成。最も新しい正規グループ。フレッシュな魅力と確かな実力を持つ。",
    features: ["フレッシュ", "勢いがある", "将来有望"],
    recommendedSong: "恋のクラウチングスタート",
    memberCount: 10,
  },
  {
    id: "rosy-chronicle",
    name: "ロージークロニクル",
    color: "#FFA07A",
    image: "/images/groups/rosy-chronicle-group.jpg",
    description: "2023年結成。ハロプロ最新グループ。今後の活躍が期待される。",
    features: ["最新", "期待の新星", "注目度急上昇"],
    recommendedSong: "新曲",
    memberCount: 6,
  },
];

// ========================================
// ハロプロ入門ガイドステップ
// ========================================
const GUIDE_STEPS = [
  {
    step: 1,
    title: "グループを知る",
    description: "まずはハロプロにどんなグループがあるか見てみましょう。それぞれに個性があります。",
    icon: "👥",
    action: { label: "グループ一覧を見る", href: "/groups" },
  },
  {
    step: 2,
    title: "推しを見つける",
    description: "気になるメンバーを見つけましょう。YouTubeやSNSでパフォーマンスをチェック！",
    icon: "💖",
    action: { label: "メンバー一覧を見る", href: "/members" },
  },
  {
    step: 3,
    title: "楽曲を聴く",
    description: "おすすめ楽曲を聴いて、お気に入りの曲を見つけましょう。",
    icon: "🎵",
    action: { label: "おすすめ楽曲を見る", href: "/recommendations" },
  },
  {
    step: 4,
    title: "ライブに行く",
    description: "実際のライブは格別！スケジュールをチェックして参加してみましょう。",
    icon: "🎤",
    action: { label: "ライブスケジュールを見る", href: "/live/schedule" },
  },
];

// ========================================
// FAQ
// ========================================
const FAQS = [
  {
    question: "ハロプロって何？",
    answer: "ハロー!プロジェクト（通称ハロプロ）は、アップフロントグループ所属の女性アイドル集団です。モーニング娘。を筆頭に、複数のアイドルグループが所属しています。1998年に始まり、25年以上の歴史があります。",
  },
  {
    question: "どこでライブのチケットを買えますか？",
    answer: "主にFC（ファンクラブ）先行、各種プレイガイド（チケットぴあ、ローソンチケットなど）、イープラスなどで購入できます。人気公演はすぐに売り切れることもあるので、FCに入会するとチケットが取りやすくなります。",
  },
  {
    question: "ファンクラブはどうやって入れますか？",
    answer: "ハロー!プロジェクトの公式ファンクラブ「Hello! Project Official Fanclub」に入会できます。年会費制で、チケット先行やオリジナルグッズなどの特典があります。公式サイトから入会手続きができます。",
  },
  {
    question: "初めてライブに行くときの持ち物は？",
    answer: "チケット、身分証明書、ペンライト（推しカラー）、タオル、飲み物などが基本です。コンサートによってはペンライトの色や持ち込みルールがあるので、事前に確認しましょう。",
  },
  {
    question: "推しが見つからないのですが...",
    answer: "焦らなくて大丈夫！YouTubeの公式チャンネルやSNS、テレビ出演などで各メンバーの魅力を発見してください。「箱推し」（グループ全体を応援）も立派な推し方です。",
  },
];

// ========================================
// コンポーネント
// ========================================
export default function BeginnersPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedGroup, setSelectedGroup] = useState(GROUPS[0]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50">
      {/* ヒーローセクション */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary-violet/20 to-secondary-orange/20" />
        <motion.div
          className="absolute top-10 left-10 w-20 h-20 bg-primary/30 rounded-full blur-2xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-32 h-32 bg-secondary-violet/30 rounded-full blur-2xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.8, 0.5, 0.8] }}
          transition={{ duration: 5, repeat: Infinity }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              Welcome to Hello! Project
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-text mb-6">
              ハロプロへようこそ！
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              初めてハロプロに興味を持った方へ。<br />
              このページでハロプロの魅力を一緒に発見しましょう！
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="#guide"
                className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors"
              >
                入門ガイドを見る
              </Link>
              <Link
                href="#groups"
                className="px-6 py-3 bg-white text-gray-700 rounded-full font-medium border border-gray-200 hover:border-primary hover:text-primary transition-colors"
              >
                グループを知る
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 入門ガイドステップ */}
      <section id="guide" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-neutral-text mb-4">
              ハロプロ入門ガイド
            </h2>
            <p className="text-gray-600">
              4つのステップでハロプロの世界へ
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {GUIDE_STEPS.map((step, index) => (
              <motion.div
                key={step.step}
                className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="absolute -top-3 -left-3 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {step.step}
                </div>
                <div className="text-4xl mb-4 mt-2">{step.icon}</div>
                <h3 className="text-xl font-bold text-neutral-text mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{step.description}</p>
                <Link
                  href={step.action.href}
                  className="inline-flex items-center text-primary text-sm font-medium hover:underline"
                >
                  {step.action.label}
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* グループ紹介 */}
      <section id="groups" className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-neutral-text mb-4">
              グループを知ろう
            </h2>
            <p className="text-gray-600">
              ハロプロには個性豊かなグループがたくさん！
            </p>
          </motion.div>

          {/* グループセレクター */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {GROUPS.map((group) => (
              <button
                key={group.id}
                onClick={() => setSelectedGroup(group)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedGroup.id === group.id
                    ? "text-white shadow-lg"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                }`}
                style={{
                  backgroundColor: selectedGroup.id === group.id ? group.color : undefined,
                }}
              >
                {group.name}
              </button>
            ))}
          </div>

          {/* 選択中のグループ詳細 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedGroup.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div
                  className="h-2"
                  style={{ backgroundColor: selectedGroup.color }}
                />
                <div className="p-8">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* 画像プレースホルダー */}
                    <div className="w-full md:w-1/3 flex-shrink-0">
                      <div
                        className="aspect-square rounded-xl flex items-center justify-center text-6xl"
                        style={{ backgroundColor: `${selectedGroup.color}20` }}
                      >
                        👥
                      </div>
                    </div>

                    {/* 詳細 */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-neutral-text mb-2">
                        {selectedGroup.name}
                      </h3>
                      <p className="text-gray-600 mb-4">{selectedGroup.description}</p>

                      {/* 特徴タグ */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedGroup.features.map((feature) => (
                          <span
                            key={feature}
                            className="px-3 py-1 text-sm rounded-full"
                            style={{
                              backgroundColor: `${selectedGroup.color}20`,
                              color: selectedGroup.color,
                            }}
                          >
                            {feature}
                          </span>
                        ))}
                      </div>

                      {/* 基本情報 */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <p className="text-sm text-gray-500">メンバー数</p>
                          <p className="font-bold text-neutral-text">{selectedGroup.memberCount}名</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">おすすめ曲</p>
                          <p className="font-bold text-neutral-text">{selectedGroup.recommendedSong}</p>
                        </div>
                      </div>

                      <Link
                        href={`/groups/${selectedGroup.id}`}
                        className="inline-flex items-center px-6 py-3 rounded-lg text-white font-medium transition-opacity hover:opacity-90"
                        style={{ backgroundColor: selectedGroup.color }}
                      >
                        詳しく見る
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-neutral-text mb-4">
              よくある質問
            </h2>
            <p className="text-gray-600">
              初心者の方からよく寄せられる質問にお答えします
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto space-y-4">
            {FAQS.map((faq, index) => (
              <motion.div
                key={index}
                className="border border-gray-200 rounded-xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-neutral-text">{faq.question}</span>
                  <motion.svg
                    animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                    className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </button>
                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0 text-gray-600 text-sm">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary-violet text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">
              さあ、ハロプロの世界へ！
            </h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              まだ迷っている？大丈夫、一歩踏み出せばきっと素敵な推しに出会えます。
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/members"
                className="px-8 py-3 bg-white text-primary rounded-full font-medium hover:bg-gray-100 transition-colors"
              >
                メンバーを探す
              </Link>
              <Link
                href="/recommendations"
                className="px-8 py-3 bg-white/20 text-white rounded-full font-medium border border-white/30 hover:bg-white/30 transition-colors"
              >
                おすすめ楽曲を聴く
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
