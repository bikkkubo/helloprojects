import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "HELLO! PROJECT CALLS",
  },
  description: "ハロー!プロジェクトのコール情報をグループ別に確認できます。",
  openGraph: {
    title: "HELLO! PROJECT CALLS",
    description: "ハロー!プロジェクトのコール情報をグループ別に確認できます。",
  },
};

const groups = [
  {
    name: "Juice=Juice",
    href: "/calls/juice-juice",
    releases: 37,
    members: 19,
  },
  {
    name: "アンジュルム",
    href: "/calls/angerme",
    releases: 0,
    members: 0,
  },
  {
    name: "モーニング娘。",
    href: "/calls/morning-musume",
    releases: 0,
    members: 0,
  },
  {
    name: "OCHA NORMA",
    href: "/calls/ocha-norma",
    releases: 0,
    members: 0,
  },
  {
    name: "つばきファクトリー",
    href: "/calls/tsubaki-factory",
    releases: 0,
    members: 0,
  },
  {
    name: "ロージークロニクル",
    href: "/calls/rosy-chronicle",
    releases: 0,
    members: 0,
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#fbf6ef] px-5 py-8 text-[#2b2928] sm:px-8 md:py-12">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-black uppercase tracking-[0.55em] text-[#9d6b66]">
          Hello! Project Calls
        </p>
        <h1 className="mt-5 text-4xl font-black tracking-normal md:text-5xl">
          グループを選ぶ
        </h1>
        <p className="mt-6 max-w-5xl text-base font-medium leading-8 text-[#6f6a66] md:text-xl">
          ローカル検証用にグループ別ページへ分けています。現時点で実データが入っているのは Juice=Juice です。
        </p>

        <section className="mt-10 grid gap-5 md:grid-cols-2">
          {groups.map((group) => (
            <Link
              key={group.name}
              href={group.href}
              className="rounded-3xl border border-[#e4ddd4] bg-white px-8 py-8 shadow-sm transition hover:-translate-y-0.5 hover:border-[#b9847d] hover:shadow-md"
            >
              <h2 className="text-3xl font-black leading-tight md:text-4xl">
                {group.name}
              </h2>
              <p className="mt-4 text-base font-semibold text-[#77706d] md:text-lg">
                {group.releases} releases / {group.members} members
              </p>
              <p className="mt-8 text-base font-black text-[#9d6b66]">
                ページを見る
              </p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
