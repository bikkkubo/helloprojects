import { Metadata } from "next";
import { getGroupById } from "@/lib/data/groups";
import { generateGroupMetadata, siteConfig } from "@/lib/metadata";
import { MusicGroupJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import GroupDetailClient from "./GroupDetailClient";

// 動的メタデータ生成
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const group = getGroupById(id);

  if (!group) {
    return {
      title: "グループが見つかりません",
    };
  }

  return generateGroupMetadata({
    id: group.id,
    name: group.name,
    nameEn: group.nameEn,
    description: group.description,
    imageUrl: group.imageUrl || group.logoUrl,
    themeColor: group.themeColor,
    memberCount: group.members.length,
  });
}

// ページコンポーネント
export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const group = getGroupById(id);

  return (
    <>
      {/* 構造化データ */}
      {group && (
        <>
          <MusicGroupJsonLd
            name={group.name}
            alternateName={group.nameEn}
            description={group.description}
            url={`${siteConfig.url}/groups/${group.id}`}
            imageUrl={group.imageUrl || group.logoUrl}
            foundingDate={group.formedDate}
            dissolutionDate={group.disbandedDate}
            members={group.members.map((m) => ({
              name: m.name,
              url: `${siteConfig.url}/members/${m.id}`,
            }))}
            sameAs={group.snsLinks.map((sns) => sns.url)}
            genre={["J-Pop", "アイドル"]}
          />
          <BreadcrumbJsonLd
            items={[
              { name: "ホーム", url: siteConfig.url },
              { name: "グループ", url: `${siteConfig.url}/groups` },
              { name: group.name, url: `${siteConfig.url}/groups/${group.id}` },
            ]}
          />
        </>
      )}

      {/* クライアントコンポーネント */}
      <GroupDetailClient groupId={id} />
    </>
  );
}
