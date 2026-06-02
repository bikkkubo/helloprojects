import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const groups = {
  "juice-juice": {
    name: "Juice=Juice",
    releases: 37,
    members: 19,
  },
  angerme: {
    name: "アンジュルム",
    releases: 0,
    members: 0,
  },
  "morning-musume": {
    name: "モーニング娘。",
    releases: 0,
    members: 0,
  },
  "ocha-norma": {
    name: "OCHA NORMA",
    releases: 0,
    members: 0,
  },
  "tsubaki-factory": {
    name: "つばきファクトリー",
    releases: 0,
    members: 0,
  },
  "rosy-chronicle": {
    name: "ロージークロニクル",
    releases: 0,
    members: 0,
  },
} as const;

export function generateStaticParams() {
  return Object.keys(groups).map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const group = groups[id as keyof typeof groups];

  if (!group) {
    return {
      title: {
        absolute: "グループが見つかりません | HELLO! PROJECT CALLS",
      },
    };
  }

  return {
    title: {
      absolute: `${group.name} | HELLO! PROJECT CALLS`,
    },
    description: `${group.name}のコール情報を確認できます。`,
    openGraph: {
      title: `${group.name} | HELLO! PROJECT CALLS`,
      description: `${group.name}のコール情報を確認できます。`,
    },
  };
}

export default async function CallsGroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const group = groups[id as keyof typeof groups];

  if (!group) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#fbf6ef] px-5 py-8 text-[#2b2928] sm:px-8 md:py-12">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="inline-flex text-sm font-black text-[#9d6b66] transition hover:text-[#7f5652]"
        >
          ← グループ一覧へ戻る
        </Link>
        <p className="mt-8 text-xs font-black uppercase tracking-[0.55em] text-[#9d6b66]">
          Hello! Project Calls
        </p>
        <h1 className="mt-5 text-4xl font-black tracking-normal md:text-6xl">
          {group.name}
        </h1>
        <p className="mt-5 text-base font-semibold text-[#77706d] md:text-lg">
          {group.releases} releases / {group.members} members
        </p>

        <section className="mt-10 rounded-3xl border border-[#e4ddd4] bg-white px-8 py-8 shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-[#9d6b66]">
            Calls
          </p>
          <h2 className="mt-4 text-2xl font-black md:text-3xl">
            コール情報
          </h2>
          <p className="mt-5 max-w-3xl text-base font-medium leading-8 text-[#6f6a66] md:text-lg">
            現時点で実データが入っているのは Juice=Juice です。各グループのコール情報はこのページに追加していきます。
          </p>
        </section>
      </div>
    </main>
  );
}
