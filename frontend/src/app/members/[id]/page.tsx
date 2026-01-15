import { Metadata } from "next";
import { getMemberById } from "@/lib/data/members";
import { generateMemberMetadata, siteConfig } from "@/lib/metadata";
import { PersonJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import MemberDetailClient from "./MemberDetailClient";

// 動的メタデータ生成
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const member = getMemberById(id);

  if (!member) {
    return {
      title: "メンバーが見つかりません",
    };
  }

  return generateMemberMetadata({
    id: member.id,
    name: member.name,
    groupName: member.groupName,
    introduction: member.introduction,
    imageUrl: member.imageUrl,
  });
}

// ページコンポーネント
export default async function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = getMemberById(id);

  return (
    <>
      {/* 構造化データ */}
      {member && (
        <>
          <PersonJsonLd
            name={member.name}
            alternateName={member.nickname}
            description={
              member.introduction ||
              `${member.name}（${member.groupName}）のプロフィール情報`
            }
            url={`${siteConfig.url}/members/${member.id}`}
            imageUrl={member.imageUrl}
            birthDate={member.birthDate}
            birthPlace={member.birthPlace}
            memberOf={member.groupHistory
              .filter((h) => h.isCurrent)
              .map((h) => ({
                name: h.groupName,
                url: `${siteConfig.url}/groups/${h.groupName}`,
              }))}
            sameAs={member.snsLinks.map((sns) => sns.url)}
          />
          <BreadcrumbJsonLd
            items={[
              { name: "ホーム", url: siteConfig.url },
              { name: "メンバー", url: `${siteConfig.url}/members` },
              { name: member.name, url: `${siteConfig.url}/members/${member.id}` },
            ]}
          />
        </>
      )}

      {/* クライアントコンポーネント */}
      <MemberDetailClient memberId={id} />
    </>
  );
}
