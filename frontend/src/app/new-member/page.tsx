import type { Metadata } from "next";
import NewMemberMaker from "./NewMemberMaker";

export const metadata: Metadata = {
  title: "新メンバー風メーカー",
  description: "自分の写真をアップロードして、モーニング娘。新メンバー発表風の画像を作れるファン向け画像メーカーです。",
  alternates: {
    canonical: "/new-member",
  },
  openGraph: {
    title: "新メンバー風メーカー | ハロ！プロ リサーチ",
    description: "自分の写真をアップロードして、モーニング娘。新メンバー発表風の画像を作れるファン向け画像メーカーです。",
    url: "/new-member",
  },
  twitter: {
    card: "summary",
    title: "新メンバー風メーカー | ハロ！プロ リサーチ",
    description: "自分の写真をアップロードして、モーニング娘。新メンバー発表風の画像を作れるファン向け画像メーカーです。",
  },
};

export default function NewMemberPage() {
  return <NewMemberMaker />;
}
