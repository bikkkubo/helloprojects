import type { Metadata } from "next";
import OshiTypeDiagnosis from "./OshiTypeDiagnosis";

export const metadata: Metadata = {
  title: "推し活タイプ診断",
  description: "12軸で推し活の傾向を可視化し、利用者平均と比較できる診断です。",
  openGraph: {
    title: "推し活タイプ診断 | ハロ！プロ リサーチ",
    description: "12軸で推し活の傾向を可視化し、利用者平均と比較できる診断です。",
    images: [
      {
        url: "/api/og?type=oshi&title=%E6%8E%A8%E3%81%97%E6%B4%BB%E3%82%BF%E3%82%A4%E3%83%97%E8%A8%BA%E6%96%AD&subtitle=12%E8%BB%B8%E3%81%A7%E6%8E%A8%E3%81%97%E6%B4%BB%E5%82%BE%E5%90%91%E3%82%92%E5%8F%AF%E8%A6%96%E5%8C%96&color=%23D4899A",
        width: 1200,
        height: 630,
        alt: "推し活タイプ診断",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "推し活タイプ診断 | ハロ！プロ リサーチ",
    description: "12軸で推し活の傾向を可視化し、利用者平均と比較できる診断です。",
    images: [
      "/api/og?type=oshi&title=%E6%8E%A8%E3%81%97%E6%B4%BB%E3%82%BF%E3%82%A4%E3%83%97%E8%A8%BA%E6%96%AD&subtitle=12%E8%BB%B8%E3%81%A7%E6%8E%A8%E3%81%97%E6%B4%BB%E5%82%BE%E5%90%91%E3%82%92%E5%8F%AF%E8%A6%96%E5%8C%96&color=%23D4899A",
    ],
  },
};

export default function OshiTypePage() {
  return <OshiTypeDiagnosis />;
}
