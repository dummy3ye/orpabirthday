"use client";

import dynamic from "next/dynamic";

const CakeExperience = dynamic(
  () => import("@/components/cake/CakeExperience"),
  { ssr: false },
);

export default function CakeWithOrpaPage() {
  return <CakeExperience />;
}
