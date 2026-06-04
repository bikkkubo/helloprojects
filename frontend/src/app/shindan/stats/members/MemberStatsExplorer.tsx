"use client";

import { useMemo, useState } from "react";

type CountRow = { count: number };
type MemberSummary = CountRow & { memberId: string; memberName: string; groupName: string; memberColor: string };
type BreakdownItem = CountRow & { label: string };
type MemberDetail = {
  member: MemberSummary;
  primary: BreakdownItem[];
  secondary: BreakdownItem[];
  resultTitles: BreakdownItem[];
};

type MemberStatsResponse =
  | ({ ok: true } & MemberDetail)
  | { ok: false; error?: string };

function formatNumber(value: number) {
  return new Intl.NumberFormat("ja-JP").format(value);
}

function formatPercent(count: number, total: number) {
  if (!total) return "0.0%";
  return `${((count / total) * 100).toFixed(1)}%`;
}

function isLightColor(hex: string) {
  const normalized = /^#[0-9a-fA-F]{6}$/.test(hex) ? hex.slice(1) : "d4899a";
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 210;
}

function safeColor(hex: string) {
  return /^#[0-9a-fA-F]{6}$/.test(hex) ? hex : "#D4899A";
}

function BreakdownList({
  title,
  rows,
  total,
  accent,
}: {
  title: string;
  rows: BreakdownItem[];
  total: number;
  accent: string;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-3 text-xs font-black tracking-[0.16em] text-[#B86B7A]">{title}</p>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={`${title}-${row.label}`} className="grid gap-1">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <p className="min-w-0 truncate font-black text-[#302b29]">{row.label}</p>
              <p className="shrink-0 font-black text-[#302b29]">
                {formatPercent(row.count, total)}
                <span className="ml-2 text-xs font-bold text-[#897c76]">{formatNumber(row.count)}件</span>
              </p>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-[#eee6df]">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.max((row.count / total) * 100, 2)}%`,
                  backgroundColor: accent,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MemberStatsExplorer({
  members,
  total,
}: {
  members: MemberSummary[];
  total: number;
}) {
  const [selectedMemberId, setSelectedMemberId] = useState(members[0]?.memberId ?? "");
  const [details, setDetails] = useState<Record<string, MemberDetail>>({});
  const [loadingMemberId, setLoadingMemberId] = useState("");
  const [error, setError] = useState("");

  const selectedMember = useMemo(
    () => members.find((member) => member.memberId === selectedMemberId) ?? members[0],
    [members, selectedMemberId],
  );
  const selectedDetail = selectedMember ? details[selectedMember.memberId] : undefined;

  const loadMember = async (member: MemberSummary) => {
    setSelectedMemberId(member.memberId);
    setError("");

    if (details[member.memberId]) return;

    setLoadingMemberId(member.memberId);

    try {
      const response = await fetch(`/api/shindan/member-stats?${new URLSearchParams({ memberId: member.memberId }).toString()}`);
      const data = (await response.json()) as MemberStatsResponse;

      if (!response.ok || !data.ok) {
        setError(data.ok === false ? data.error ?? "集計を取得できませんでした。" : "集計を取得できませんでした。");
        return;
      }

      setDetails((current) => ({
        ...current,
        [member.memberId]: {
          member: data.member,
          primary: data.primary,
          secondary: data.secondary,
          resultTitles: data.resultTitles,
        },
      }));
    } catch {
      setError("集計を取得できませんでした。時間をおいて再度お試しください。");
    } finally {
      setLoadingMemberId("");
    }
  };

  const selectedColor = selectedMember ? safeColor(selectedMember.memberColor) : "#D4899A";
  const selectedTextColor = isLightColor(selectedColor) ? "#302b29" : "#ffffff";

  return (
    <div className="mt-7 grid gap-6 lg:grid-cols-[360px_1fr]">
      <section className="border-y border-[#eadfd8] bg-white">
        <div className="sticky top-0 border-b border-[#eadfd8] bg-white px-4 py-4">
          <p className="text-xs font-black tracking-[0.18em] text-[#B86B7A]">MEMBER LIST</p>
          <p className="mt-1 text-sm font-bold text-[#897c76]">クリックすると詳細分類を取得します</p>
        </div>
        <div className="max-h-[78vh] overflow-y-auto">
          {members.map((member, index) => {
            const memberColor = safeColor(member.memberColor);
            const isSelected = member.memberId === selectedMember?.memberId;

            return (
              <button
                key={member.memberId}
                type="button"
                onClick={() => void loadMember(member)}
                className={[
                  "grid w-full grid-cols-[34px_1fr_auto] items-center gap-3 border-b border-[#f0e8e2] px-4 py-3 text-left transition-colors",
                  isSelected ? "bg-[#fff5f7]" : "bg-white hover:bg-[#fffaf7]",
                ].join(" ")}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#302b29] text-xs font-black text-white">
                  {index + 1}
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 shrink-0 rounded-full border border-[#d9cbc4]" style={{ backgroundColor: memberColor }} />
                    <span className="truncate text-sm font-black text-[#302b29]">{member.memberName}</span>
                  </span>
                  <span className="mt-1 block truncate text-xs font-bold text-[#897c76]">{member.groupName}</span>
                </span>
                <span className="text-right text-sm font-black text-[#302b29]">
                  {formatNumber(member.count)}
                  <span className="block text-[10px] font-bold text-[#897c76]">{formatPercent(member.count, total)}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="border-y border-[#eadfd8] bg-white px-5 py-5">
        {selectedMember ? (
          <>
            <div className="grid gap-5 border-b border-[#eadfd8] pb-5 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <p className="text-xs font-black tracking-[0.16em] text-[#B86B7A]">{selectedMember.groupName}</p>
                <h2 className="mt-2 text-4xl font-black leading-tight text-[#302b29]">{selectedMember.memberName}</h2>
                <div
                  className="mt-4 inline-flex rounded-full px-4 py-2 text-sm font-black"
                  style={{ backgroundColor: selectedColor, color: selectedTextColor }}
                >
                  {formatNumber(selectedMember.count)}人 / 全体 {formatPercent(selectedMember.count, total)}
                </div>
              </div>
              <button
                type="button"
                onClick={() => void loadMember(selectedMember)}
                disabled={loadingMemberId === selectedMember.memberId}
                className="rounded-lg border border-[#B86B7A] px-5 py-3 text-sm font-black text-[#B86B7A] transition-colors hover:bg-[#B86B7A] hover:text-white disabled:cursor-wait disabled:opacity-50"
              >
                {loadingMemberId === selectedMember.memberId ? "読み込み中" : selectedDetail ? "再読み込み" : "詳細を表示"}
              </button>
            </div>

            {error && (
              <p className="mt-5 rounded-lg border border-[#e2b8c0] bg-[#fff5f7] px-4 py-3 text-sm font-bold text-[#B86B7A]">
                {error}
              </p>
            )}

            {!selectedDetail && !error && (
              <div className="mt-8 border-y border-[#eadfd8] bg-[#fffdf9] px-5 py-8">
                <p className="text-lg font-black text-[#302b29]">メンバーを選択して「詳細を表示」を押してください。</p>
                <p className="mt-2 text-sm font-bold text-[#897c76]">
                  全分類の集計はクリック後に取得します。初期表示を軽くするため、全メンバー分は一括生成していません。
                </p>
              </div>
            )}

            {selectedDetail && (
              <div className="mt-6 grid gap-6 xl:grid-cols-3">
                <BreakdownList title="全主タイプ" rows={selectedDetail.primary} total={selectedDetail.member.count} accent="#74A88B" />
                <BreakdownList title="全副タイプ" rows={selectedDetail.secondary} total={selectedDetail.member.count} accent="#B986D9" />
                <BreakdownList title="全結果タイトル" rows={selectedDetail.resultTitles} total={selectedDetail.member.count} accent="#CC6B9B" />
              </div>
            )}
          </>
        ) : (
          <p className="text-sm font-bold text-[#897c76]">表示できるメンバーがありません。</p>
        )}
      </section>
    </div>
  );
}
