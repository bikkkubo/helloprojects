"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PersonalizationBar from "@/components/common/PersonalizationBar";
import StickyCTA from "@/components/common/StickyCTA";

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStandaloneExperience =
    pathname?.startsWith("/oshi-type") || pathname?.startsWith("/shindan");

  return (
    <>
      {!isStandaloneExperience && <Header />}
      {!isStandaloneExperience && <PersonalizationBar />}
      <main className={`flex-1 ${isStandaloneExperience ? "" : "pb-20 md:pb-0"}`}>
        {children}
      </main>
      {!isStandaloneExperience && <StickyCTA />}
      {!isStandaloneExperience && <Footer />}
    </>
  );
}
