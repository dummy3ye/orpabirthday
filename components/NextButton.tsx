"use client";

import Link from "next/link";
import { useEffect } from "react";

type NextButtonProps = {
  href: string;
};

export function NextButton({ href }: NextButtonProps) {
  useEffect(() => {
    if (!href) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === "ArrowRight") {
        window.location.assign(href);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [href]);

  if (!href) return null;

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-full border border-[#8b6577] px-5 py-2 text-sm font-medium text-[#f7ede3] transition hover:-translate-y-0.5 hover:border-[#d8a9b5] hover:shadow-[0_8px_24px_rgba(216,169,181,0.2)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f7d8d5]"
    >
      Next <span aria-hidden="true">→</span>
    </Link>
  );
}
