import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PersonalizationBar from "@/components/common/PersonalizationBar";
import StickyCTA from "@/components/common/StickyCTA";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  title: {
    default: "HelloProjects - ハロープロジェクト総合ポータル",
    template: "%s | HelloProjects",
  },
  description: "ハロープロジェクトの最新ニュース、メンバー情報、スケジュールをお届けする総合ファンポータルサイト",
  keywords: ["ハロープロジェクト", "モーニング娘", "アンジュルム", "Juice=Juice", "アイドル"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={notoSansJP.variable}>
      <body className="font-sans min-h-screen flex flex-col">
        <Header />
        <PersonalizationBar />
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
        <StickyCTA />
        <Footer />
      </body>
    </html>
  );
}
