"use client";

import { usePathname } from "next/navigation";
import PersonalizationBar from "@/components/common/PersonalizationBar";
import StickyCTA from "@/components/common/StickyCTA";

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStandaloneExperience = pathname?.startsWith("/oshi-type");

  return (
    <>
      {!isStandaloneExperience && <PersonalizationBar />}
      <main className={`flex-1 ${isStandaloneExperience ? "" : "pb-20 md:pb-0"}`}>
        {children}
      </main>
      {!isStandaloneExperience && <StickyCTA />}
    </>
  );
}
