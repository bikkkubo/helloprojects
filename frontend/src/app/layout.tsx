import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PersonalizationBar from "@/components/common/PersonalizationBar";
import StickyCTA from "@/components/common/StickyCTA";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/seo/JsonLd";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-jp",
});

const siteConfig = {
  name: "ハロー!プロジェクト ポータル",
  description: "ハロー!プロジェクトの最新ニュース、メンバー情報、イベントスケジュールをお届けする総合ファンポータルサイト",
  url: "https://helloprojects.fan",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "ハロー!プロジェクト",
    "ハロプロ",
    "モーニング娘。",
    "アンジュルム",
    "Juice=Juice",
    "つばきファクトリー",
    "BEYOOOOONDS",
    "OCHA NORMA",
    "ロージークロニクル",
    "アイドル",
    "J-POP",
  ],
  authors: [{ name: "HelloProjects Fan Portal" }],
  creator: "HelloProjects Fan Portal",
  publisher: "HelloProjects Fan Portal",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/og-image.png"],
    creator: "@helloprojects",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: siteConfig.url,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#E91E8C" },
    { media: "(prefers-color-scheme: dark)", color: "#E91E8C" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={notoSansJP.variable}>
      <head>
        <OrganizationJsonLd />
        <WebsiteJsonLd />
      </head>
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
