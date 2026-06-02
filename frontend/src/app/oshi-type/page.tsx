import type { Metadata } from "next";
import OshiTypeDiagnosis from "./OshiTypeDiagnosis";

export const metadata: Metadata = {
  title: "推し活タイプ診断 | HelloProjects",
  description: "12軸で推し活の傾向を可視化し、利用者平均と比較できる診断プロトタイプです。",
};

export default function OshiTypePage() {
  return <OshiTypeDiagnosis />;
}
